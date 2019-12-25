"""
Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
"""
import os
import random
import string
from fastapi import Depends, Cookie, FastAPI, HTTPException
import requests
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from starlette.responses import Response, JSONResponse
from urllib.parse import urljoin

from sql import crud, models, schemas
from sql.database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

npm_base_url = "https://replicate.npmjs.com/"
github_api_base_url = "https://api.github.com/repos"
app = FastAPI()

origins = [os.environ.get("NPM_DEVS_VISUALIZER_REDIRECT_URL", "http://localhost:1234")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def internal_get_package_info(url: str):
    raw_res_npm = requests.get(url)
    res_npm = raw_res_npm.json()

    if raw_res_npm.status_code != 200:
        if raw_res_npm.status_code >= 500:
            raise HTTPException(
                status_code=503, detail="https://replicate.npmjs.com/ Unavailable"
            )
        if raw_res_npm.status_code == 404:
            raise HTTPException(status_code=404, detail="not_found")
        if "error" in res_npm:
            raise HTTPException(
                status_code=500, detail=f"GitHub API: {res_npm['error']}"
            )
        raise HTTPException(status_code=500)

    for k in ("time", "maintainers", "repository"):
        if k not in res_npm:
            raise HTTPException(status_code=404, detail=f"{k} not found")

    return {
        "time": res_npm["time"],
        "maintainers": res_npm["maintainers"],
        "url": res_npm["repository"]["url"].replace("git+", "").replace(".git", ""),
    }


@app.get("/npm/{package}")
def get_package_info(package: str):
    return internal_get_package_info(urljoin(npm_base_url, package))


@app.get("/npm/{scope}/{package}")
def get_scoped_package_info(scope: str, package: str):
    return internal_get_package_info(npm_base_url + scope + r"%2F" + package)


def loop_fetch(limit: int, url: str, token: str = None):
    arr = []
    i = 1
    is_limit = False
    has_error = False
    message = ""
    headers = (
        {
            "User-Agent": "npm devs visualizer",
            "Accept": "application/vnd.github.v3+json",
            "Authorization": f"token {token}",
        }
        if token
        else {
            "User-Agent": "npm devs visualizer",
            "Accept": "application/vnd.github.v3+json",
        }
    )
    while True:
        if i > limit:
            is_limit = True
            break
        res = requests.get(f"{url}per_page=100&page={i}", headers=headers).json()
        if not res:
            break
        if "message" in res:
            has_error = True
            message = res["message"]
            break
        if "error" in res:
            has_error = True
            message = res["error"]
            break
        arr += res
        i += 1
    return arr, is_limit, has_error, message


@app.get("/github/{repo}/{package}")
def get_github(
    repo: str,
    package: str,
    max_limit: int = 1,
    user_id: str = Cookie(None),
    db: Session = Depends(get_db),
):
    access_token = None
    if user_id is not None:
        auth_user = crud.get_user_by_user_id(db, user_id)
        if auth_user is not None:
            access_token = auth_user.access_token

    res_commits, is_commits_limit, has_commits_error, commits_message = loop_fetch(
        max_limit, f"{github_api_base_url}/{repo}/{package}/commits?", access_token
    )
    res_pulls, is_pulls_limit, has_pulls_error, pulls_message = loop_fetch(
        max_limit,
        f"{github_api_base_url}/{repo}/{package}/pulls?state=all&",
        access_token,
    )
    res_issues, is_issues_limit, has_issues_error, issues_message = loop_fetch(
        max_limit,
        f"{github_api_base_url}/{repo}/{package}/issues?state=all&",
        access_token,
    )

    return {
        "commits": {
            "content": [commit["commit"]["author"]["date"] for commit in res_commits]
            if not has_commits_error
            else [],
            "limit": is_commits_limit,
            "error": has_commits_error,
            "message": commits_message,
        },
        "pulls": {
            "content": [
                {"createdAt": pull["created_at"], "closedAt": pull["closed_at"]}
                for pull in res_pulls
            ]
            if not has_pulls_error
            else [],
            "limit": is_pulls_limit,
            "error": has_pulls_error,
            "message": pulls_message,
        },
        "issues": {
            "content": [
                {"createdAt": issue["created_at"], "closedAt": issue["closed_at"]}
                for issue in res_issues
            ]
            if not has_issues_error
            else [],
            "limit": is_issues_limit,
            "error": has_issues_error,
            "message": issues_message,
        },
    }


def create_new_user(token: str, database: Session):
    new_user_id = "".join(random.choices(string.ascii_letters + string.digits, k=32))
    crud.create_user(
        database, schemas.UserCreate(access_token=token, user_id=new_user_id)
    )
    content = {"message": "OK"}
    response = JSONResponse(content=content)
    response.set_cookie(key="user_id", value=new_user_id)
    return response


@app.get("/github/auth")
def auth_github(
    client_id: str,
    code: str,
    user_id: str = Cookie(None),
    db: Session = Depends(get_db),
):
    client_secret = os.environ["NPM_DEVS_VISUALIZER_CLIENT_SECRET"]

    raw_res = requests.post(
        f"https://github.com/login/oauth/access_token?client_id={client_id}&client_secret={client_secret}&code={code}",
        headers={"User-Agent": "npm devs visualizer", "Accept": "application/json"},
    )
    res = raw_res.json()
    if raw_res.status_code != 200:
        if raw_res.status_code >= 500:
            raise HTTPException(status_code=503, detail="GitHub API Unavailable")
        if raw_res.status_code == 404:
            raise HTTPException(status_code=404, detail="not found")
        if "message" in res:
            raise HTTPException(status_code=500, detail=f"GitHub API: {res['message']}")
        if "error" in res:
            raise HTTPException(status_code=500, detail=f"GitHub API: {res['error']}")
        raise HTTPException(status_code=500)

    access_token = res["access_token"]

    if user_id is None:
        return create_new_user(access_token, db)

    auth_user = crud.get_user_by_user_id(db, user_id)
    if auth_user:
        auth_user.access_token = access_token
        return {"message": "OK"}

    return create_new_user(access_token, db)


@app.delete("/github/auth", status_code=204)
def delete_auth_github(
    client_id: str, user_id: str = Cookie(None), db: Session = Depends(get_db)
):
    client_secret = os.environ["NPM_DEVS_VISUALIZER_CLIENT_SECRET"]

    if user_id is None:
        raise HTTPException(
            status_code=404, detail="Access token not found in the request"
        )

    auth_user = crud.get_user_by_user_id(db, user_id)
    if auth_user is None:
        raise HTTPException(status_code=404, detail="Access token not found in the DB")

    raw_res = requests.delete(
        f"https://api.github.com/applications/{client_id}/tokens/{auth_user.access_token}",
        headers={"User-Agent": "npm devs visualizer", "Accept": "application/json"},
        auth=(client_id, client_secret),
    )

    if raw_res.status_code != 204:
        res = raw_res.json()
        if raw_res.status_code >= 500:
            raise HTTPException(status_code=503, detail="GitHub API Unavailable")
        if raw_res.status_code == 404:
            raise HTTPException(status_code=404, detail="not found")
        if "message" in res:
            raise HTTPException(status_code=500, detail=f"GitHub API: {res['message']}")
        if "error" in res:
            raise HTTPException(status_code=500, detail=f"GitHub API: {res['error']}")
        raise HTTPException(status_code=500)

    crud.delete_user(db=db, user_id=user_id)

    response = Response(status_code=204)
    response.delete_cookie(key="user_id")
    return response
