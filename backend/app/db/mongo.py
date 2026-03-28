import os

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "app_db")

client = AsyncIOMotorClient(MONGODB_URL)
db = client[MONGODB_DB_NAME]


def get_users_collection():
    return db["users"]


def get_profiles_collection():
    return db["profiles"]


async def ensure_indexes():
    users_collection = get_users_collection()
    profiles_collection = get_profiles_collection()
    await users_collection.create_index("email", unique=True)
    await profiles_collection.create_index("user_id", unique=True)
