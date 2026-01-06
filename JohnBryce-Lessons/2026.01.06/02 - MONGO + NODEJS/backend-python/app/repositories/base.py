"""
Base repository abstraction with generic async CRUD operations.
"""
from abc import ABC, abstractmethod
from typing import Any, Generic, Optional, TypeVar

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection

from app.config.database import get_database

# Type variables for generic repository
T = TypeVar("T")  # Model type
CreateT = TypeVar("CreateT")  # Create schema type
UpdateT = TypeVar("UpdateT")  # Update schema type


class BaseRepository(ABC, Generic[T, CreateT, UpdateT]):
    """
    Abstract base repository with generic async CRUD operations.
    """

    def __init__(self, collection_name: str) -> None:
        """
        Initialize repository with collection name.

        Args:
            collection_name: Name of the MongoDB collection.
        """
        self._collection_name = collection_name

    @property
    def collection(self) -> AsyncIOMotorCollection:
        """
        Get the MongoDB collection.

        Returns:
            AsyncIOMotorCollection: The MongoDB collection.
        """
        db = get_database()
        return db[self._collection_name]

    @abstractmethod
    def _document_to_model(self, document: dict[str, Any]) -> T:
        """
        Convert a MongoDB document to a model instance.

        Args:
            document: MongoDB document dictionary.

        Returns:
            T: Model instance.
        """
        pass

    @abstractmethod
    def _create_to_document(self, data: CreateT) -> dict[str, Any]:
        """
        Convert a create schema to a MongoDB document.

        Args:
            data: Create schema instance.

        Returns:
            dict: MongoDB document dictionary.
        """
        pass

    @abstractmethod
    def _update_to_document(self, data: UpdateT) -> dict[str, Any]:
        """
        Convert an update schema to a MongoDB update document.

        Args:
            data: Update schema instance.

        Returns:
            dict: MongoDB update document dictionary.
        """
        pass

    async def find_all(self) -> list[T]:
        """
        Find all documents in the collection.

        Returns:
            list[T]: List of model instances.
        """
        documents = await self.collection.find().to_list(length=None)
        return [self._document_to_model(doc) for doc in documents]

    async def find_by_id(self, id: str) -> Optional[T]:
        """
        Find a document by its ID.

        Args:
            id: Document ID as string.

        Returns:
            Optional[T]: Model instance if found, None otherwise.
        """
        if not ObjectId.is_valid(id):
            return None

        document = await self.collection.find_one({"_id": ObjectId(id)})
        if document is None:
            return None

        return self._document_to_model(document)

    async def create(self, data: CreateT) -> T:
        """
        Create a new document.

        Args:
            data: Create schema instance.

        Returns:
            T: Created model instance.
        """
        document = self._create_to_document(data)
        result = await self.collection.insert_one(document)
        document["_id"] = result.inserted_id
        return self._document_to_model(document)

    async def update(self, id: str, data: UpdateT) -> Optional[T]:
        """
        Update a document by its ID.

        Args:
            id: Document ID as string.
            data: Update schema instance.

        Returns:
            Optional[T]: Updated model instance if found, None otherwise.
        """
        if not ObjectId.is_valid(id):
            return None

        update_data = self._update_to_document(data)
        if not update_data:
            # No fields to update, return current document
            return await self.find_by_id(id)

        result = await self.collection.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": update_data},
            return_document=True,
        )

        if result is None:
            return None

        return self._document_to_model(result)

    async def delete(self, id: str) -> bool:
        """
        Delete a document by its ID.

        Args:
            id: Document ID as string.

        Returns:
            bool: True if document was deleted, False otherwise.
        """
        if not ObjectId.is_valid(id):
            return False

        result = await self.collection.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0
