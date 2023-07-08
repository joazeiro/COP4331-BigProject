import pymongo
from constants import Keys
import sys

def connect_database():
    db_connection = pymongo.MongoClient(Keys.DB_URI, connectTimeoutMS=30000, socketTimeoutMS=None, connect=False, maxPoolsize=1)
    db = db_connection[Keys.DB_NAME]

    return db


def access_user_collection():
    db = connect_database()
    user_collection = db[Keys.COLLECTION_USER]
    
    return user_collection


def access_post_collection():
    db = connect_database()
    post_collection = db[Keys.COLLECTION_POST]

    return post_collection
