"""
Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
"""

from sqlalchemy.orm import Session

from . import models, schemas


def get_user(db: Session, id_: int):
    return db.query(models.User).filter(models.User.id == id_).first()


def get_user_by_user_id(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.user_id == user_id).first()


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(access_token=user.access_token, user_id=user.user_id)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: str):
    db_user = get_user_by_user_id(db, user_id)
    if db_user is None:
        return
    db.delete(db_user)
    db.commit()
