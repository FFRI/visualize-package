"""
Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
"""

from starlette.testclient import TestClient
from main import app
from unittest.mock import patch, MagicMock


class JsonMock:
    def __init__(self, json_data):
        self.json_data = json_data

    def json(self):
        return self.json_data


class ResponseMock:
    def __init__(self, content, status_code):
        self.content = content
        self.status_code = status_code

    def json(self):
        return self.content


client = TestClient(app)


@patch("main.requests")
def test_get_package_ok(mock):
    mock_res = MagicMock(
        return_value=ResponseMock(
            content={
                "time": {
                    "modified": "2019-06-04T11:51:28.541Z",
                    "created": "2011-10-26T17:46:21.942Z",
                    "0.0.1": "2011-10-26T17:46:22.746Z",
                    "0.0.2": "2011-10-28T22:40:36.115Z",
                    "0.0.3": "2011-10-29T13:40:41.073Z",
                    "0.1.2": "2011-12-21T20:56:27.003Z",
                },
                "maintainers": [{"name": "adam", "email": "adam@example.com"}],
                "repository": {
                    "type": "git",
                    "url": "git+https://github.com/ffri/sample.git",
                },
            },
            status_code=200,
        )
    )
    mock.get = mock_res
    response = client.get("/npm/sample")
    assert response.status_code == 200
    res = response.json()
    assert "time" in res and "maintainers" in res and "url" in res
    assert res["url"] == "https://github.com/ffri/sample"


@patch("main.requests")
def test_get_package_not_found(mock):
    mock_res = MagicMock(
        return_value=ResponseMock(
            content={
                "time": {
                    "modified": "2019-06-04T11:51:28.541Z",
                    "created": "2011-10-26T17:46:21.942Z",
                    "0.0.1": "2011-10-26T17:46:22.746Z",
                    "0.0.2": "2011-10-28T22:40:36.115Z",
                    "0.0.3": "2011-10-29T13:40:41.073Z",
                    "0.1.2": "2011-12-21T20:56:27.003Z",
                },
                "repository": {
                    "type": "git",
                    "url": "git+https://github.com/ffri/sample.git",
                },
            },
            status_code=200,
        )
    )
    mock.get = mock_res
    response = client.get("/npm/sample")
    assert response.status_code == 404
    res = response.json()
    assert res["detail"] == "maintainers not found"


@patch("main.requests")
def test_get_package_error(mock):
    mock_res = MagicMock(
        return_value=ResponseMock(content={"error": "not_found"}, status_code=404)
    )
    mock.get = mock_res
    response = client.get("/npm/sample")
    assert response.status_code == 404
    res = response.json()
    assert res["detail"] == "not_found"


@patch("main.requests")
def test_get_package_500_error(mock):
    mock_res = MagicMock(
        return_value=ResponseMock(
            content={"error": "internal server error"}, status_code=500
        )
    )
    mock.get = mock_res
    response = client.get("/npm/sample")
    assert response.status_code == 503
    res = response.json()
    assert res["detail"] == "https://replicate.npmjs.com/ Unavailable"


@patch("main.requests")
def test_get_scoped_package_ok(mock):
    mock_res = MagicMock(
        return_value=ResponseMock(
            content={
                "time": {
                    "modified": "2019-06-04T11:51:28.541Z",
                    "created": "2011-10-26T17:46:21.942Z",
                    "0.0.1": "2011-10-26T17:46:22.746Z",
                    "0.0.2": "2011-10-28T22:40:36.115Z",
                    "0.0.3": "2011-10-29T13:40:41.073Z",
                    "0.1.2": "2011-12-21T20:56:27.003Z",
                },
                "maintainers": [{"name": "adam", "email": "adam@example.com"}],
                "repository": {
                    "type": "git",
                    "url": "git+https://github.com/ffri/sample.git",
                },
            },
            status_code=200,
        )
    )
    mock.get = mock_res
    response = client.get("/npm/@ffri/sample")
    assert response.status_code == 200
    res = response.json()
    assert "time" in res and "maintainers" in res and "url" in res
    assert res["url"] == "https://github.com/ffri/sample"


@patch("main.requests")
def test_get_scoped_package_not_found(mock):
    mock_res = MagicMock(
        return_value=ResponseMock(
            content={
                "time": {
                    "modified": "2019-06-04T11:51:28.541Z",
                    "created": "2011-10-26T17:46:21.942Z",
                    "0.0.1": "2011-10-26T17:46:22.746Z",
                    "0.0.2": "2011-10-28T22:40:36.115Z",
                    "0.0.3": "2011-10-29T13:40:41.073Z",
                    "0.1.2": "2011-12-21T20:56:27.003Z",
                },
                "repository": {
                    "type": "git",
                    "url": "git+https://github.com/ffri/sample.git",
                },
            },
            status_code=200,
        )
    )
    mock.get = mock_res
    response = client.get("/npm/@ffri/sample")
    assert response.status_code == 404
    res = response.json()
    assert res["detail"] == "maintainers not found"


@patch("main.requests")
def test_get_scoped_package_error(mock):
    mock_res = MagicMock(
        return_value=ResponseMock(content={"error": "not_found"}, status_code=404)
    )
    mock.get = mock_res
    response = client.get("/npm/@ffri/sample")
    assert response.status_code == 404
    res = response.json()
    assert res["detail"] == "not_found"


@patch("main.requests")
def test_get_scoped_package_500_error(mock):
    mock_res = MagicMock(
        return_value=ResponseMock(
            content={"error": "internal server error"}, status_code=500
        )
    )
    mock.get = mock_res
    response = client.get("/npm/@ffri/sample")
    assert response.status_code == 503
    res = response.json()
    assert res["detail"] == "https://replicate.npmjs.com/ Unavailable"


@patch("main.crud")
@patch("main.requests")
def test_get_github_ok(mock_res, mock_crud):
    mock_res.get.side_effect = [
        JsonMock([{"commit": {"author": {"date": "2019-06-05T00:20:06Z"}}}]),
        JsonMock(
            [
                {
                    "created_at": "2019-06-04T22:51:10Z",
                    "closed_at": "2019-06-04T22:58:11Z",
                }
            ]
        ),
        JsonMock(
            [
                {
                    "created_at": "2019-06-04T22:51:10Z",
                    "closed_at": "2019-06-04T22:58:11Z",
                }
            ]
        ),
    ]
    mock_crud.get_user_by_user_id = MagicMock(access_token="aaaaaaaa")
    response = client.get("/github/ffri/sample", headers={"cookie": "user_id=aaaaaaaa"})
    assert response.status_code == 200
    res = response.json()
    assert "commits" in res and "pulls" in res and "issues" in res
    assert (
        not res["commits"]["error"]
        and not res["pulls"]["error"]
        and not res["issues"]["error"]
    )


@patch("main.os")
@patch("main.crud")
@patch("main.requests")
def test_delete_auth_github_ok(mock_requests, mock_crud, mock_os):
    mock_os.environ = MagicMock()
    mock_requests.delete = MagicMock(
        return_value=ResponseMock(content={"message": "No Content"}, status_code=204)
    )
    mock_crud.get_user_by_user_id = MagicMock(access_token="aaaaaaaaa")
    mock_crud.delete_user = MagicMock()
    response = client.delete(
        "/github/auth?client_id=aaaaaaaa&user_id=bbbbbbbb",
        headers={"cookie": "user_id=cccccccc"},
    )
    assert response.status_code == 204


@patch("main.os")
@patch("main.crud")
@patch("main.requests")
def test_delete_auth_github_without_user_id(mock_requests, mock_crud, mock_os):
    mock_os.environ = MagicMock()
    mock_res = MagicMock(
        return_value=ResponseMock(content={"message": "No Content"}, status_code=204)
    )
    mock_requests.delete = mock_res
    mock_crud.get_user_by_user_id = MagicMock(access_token="aaaaaaaaa")
    mock_crud.delete_user = MagicMock()
    response = client.delete("/github/auth?client_id=aaaaaaaa&user_id=bbbbbbbb")
    assert response.status_code == 404


@patch("main.os")
@patch("main.crud")
@patch("main.requests")
def test_delete_auth_github_no_match_user_id(mock_requests, mock_crud, mock_os):
    mock_os.environ = MagicMock()
    mock_res = MagicMock(
        return_value=ResponseMock(content={"message": "No Content"}, status_code=204)
    )
    mock_requests.delete = mock_res
    mock_crud.get_user_by_user_id = MagicMock(return_value=None)
    mock_crud.delete_user = MagicMock()
    response = client.delete(
        "/github/auth?client_id=aaaaaaaa&user_id=bbbbbbbb",
        headers={"cookie": "user_id=cccccccc"},
    )
    assert response.status_code == 404


@patch("main.os")
@patch("main.crud")
@patch("main.requests")
def test_delete_auth_github_ng(mock_requests, mock_crud, mock_os):
    mock_os.environ = MagicMock()
    mock_res = MagicMock(
        return_value=ResponseMock(content={"message": "not found"}, status_code=404)
    )
    mock_requests.delete = mock_res
    mock_crud.get_user_by_user_id = MagicMock(access_token="aaaaaaaa")
    mock_crud.delete_user = MagicMock()
    response = client.delete(
        "/github/auth?client_id=aaaaaaaa&user_id=bbbbbbbb",
        headers={"cookie": "user_id=cccccccc"},
    )
    assert response.status_code == 404
    res = response.json()
    assert res["detail"] == "not found"


@patch("main.os")
@patch("main.crud")
@patch("main.requests")
def test_delete_auth_github_error(mock_requests, mock_crud, mock_os):
    mock_os.environ = MagicMock()
    mock_res = MagicMock(
        return_value=ResponseMock(
            content={"error": "internal server error"}, status_code=500
        )
    )
    mock_requests.delete = mock_res
    mock_crud.get_user_by_user_id = MagicMock(access_token="aaaaaaaa")
    mock_crud.delete_user = MagicMock()
    response = client.delete(
        "/github/auth?client_id=aaaaaaaa&user_id=bbbbbbbb",
        headers={"cookie": "user_id=cccccccc"},
    )
    assert response.status_code == 503
    res = response.json()
    assert res["detail"] == "GitHub API Unavailable"


@patch("main.os")
@patch("main.crud")
@patch("main.requests")
def test_auth_github_ok(mock_requests, mock_crud, mock_os):
    mock_os.environ = MagicMock()
    mock_res = MagicMock(
        return_value=ResponseMock(
            content={
                "access_token": "aaaaaaaa",
                "scope": "repo",
                "token_type": "bearer",
            },
            status_code=200,
        )
    )
    mock_requests.post = mock_res
    mock_crud.get_user_by_user_id = MagicMock(access_token="aaaaaaaaa")
    response = client.get(
        "/github/auth?client_id=aaaaaaaaaaa&code=ccccccccc",
        headers={"cookie": "user_id=cccccccc"},
    )
    assert response.status_code == 200
    assert "message" in response.json()


@patch("main.os")
@patch("main.crud")
@patch("main.requests")
def test_auth_github_no_match_user_id(mock_requests, mock_crud, mock_os):
    mock_os.environ = MagicMock()
    mock_res = MagicMock(
        return_value=ResponseMock(
            content={
                "access_token": "aaaaaaaa",
                "scope": "repo",
                "token_type": "bearer",
            },
            status_code=200,
        )
    )
    mock_requests.post = mock_res
    mock_crud.get_user_by_user_id = MagicMock(return_value=None)
    mock_crud.create_user = MagicMock()
    response = client.get(
        "/github/auth?client_id=aaaaaaaaaaa&code=ccccccccc",
        headers={"cookie": "user_id=cccccccc"},
    )
    assert response.status_code == 200
    assert "message" in response.json()


@patch("main.os")
@patch("main.crud")
@patch("main.requests")
def test_auth_github_without_user_id(mock_requests, mock_crud, mock_os):
    mock_os.environ = MagicMock()
    mock_res = MagicMock(
        return_value=ResponseMock(
            content={
                "access_token": "aaaaaaaa",
                "scope": "repo",
                "token_type": "bearer",
            },
            status_code=200,
        )
    )
    mock_requests.post = mock_res
    mock_crud.create_user = MagicMock()
    response = client.get("/github/auth?client_id=aaaaaaaaaaa&code=ccccccccc")
    assert response.status_code == 200
    assert "message" in response.json()


@patch("main.os")
@patch("main.requests")
def test_auth_github_ng(mock_requests, mock_os):
    mock_os.environ = MagicMock()
    mock_res = MagicMock(
        return_value=ResponseMock(content={"message": "not found"}, status_code=404)
    )
    mock_requests.post = mock_res
    response = client.get("/github/auth?client_id=aaaaaaaaaaa&code=ccccccccc")
    assert response.status_code == 404
    res = response.json()
    assert res["detail"] == "not found"


@patch("main.os")
@patch("main.requests")
def test_auth_github_error(mock_requests, mock_os):
    mock_os.environ = MagicMock()
    mock_res = MagicMock(
        return_value=ResponseMock(
            content={"error": "internal server error"}, status_code=500
        )
    )
    mock_requests.post = mock_res
    response = client.get("/github/auth?client_id=aaaaaaaaaaa&code=ccccccccc")
    assert response.status_code == 503
    res = response.json()
    assert res["detail"] == "GitHub API Unavailable"
