"""
MongoDB Atlas async connection module using Motor.
"""
import logging
import os
from typing import Optional

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

load_dotenv()

logger = logging.getLogger(__name__)

# MongoDB client and database instances
_client: Optional[AsyncIOMotorClient] = None
db: Optional[AsyncIOMotorDatabase] = None


async def connect_to_mongodb() -> None:
    """
    Establish async connection to MongoDB Atlas.
    """
    global _client, db

    mongodb_uri = os.getenv("MONGODB_URI")
    if not mongodb_uri:
        raise ValueError("MONGODB_URI environment variable is not set")

    database_name = os.getenv("MONGODB_DATABASE", "fastapi_db")

    try:
        _client = AsyncIOMotorClient(mongodb_uri)
        db = _client[database_name]

        # Verify connection by pinging the database
        await _client.admin.command("ping")
        logger.info(f"Successfully connected to MongoDB database: {database_name}")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise


async def close_mongodb_connection() -> None:
    """
    Close the MongoDB connection.
    """
    global _client, db

    if _client is not None:
        _client.close()
        _client = None
        db = None
        logger.info("MongoDB connection closed")


def get_database() -> AsyncIOMotorDatabase:
    """
    Get the database instance.

    Returns:
        AsyncIOMotorDatabase: The MongoDB database instance.

    Raises:
        RuntimeError: If database connection is not established.
    """
    if db is None:
        raise RuntimeError("Database connection not established. Call connect_to_mongodb() first.")
    return db
