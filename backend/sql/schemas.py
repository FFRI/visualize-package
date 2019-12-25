"""
Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
"""

from pydantic import BaseModel


class UserBase(BaseModel):
    pass


class UserCreate(UserBase):
    access_token: str
    user_id: str
