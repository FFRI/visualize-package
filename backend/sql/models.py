"""
Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
"""

from sqlalchemy import Column, Integer, String

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    access_token = Column(String)
    user_id = Column(String, index=True)
