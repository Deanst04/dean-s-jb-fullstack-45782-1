"""
Product repository implementation.
"""
from datetime import datetime, timezone
from typing import Any, Optional

from bson import ObjectId

from app.models.product import ProductCreate, ProductInDB, ProductUpdate
from app.repositories.base import BaseRepository


class ProductRepository(BaseRepository[ProductInDB, ProductCreate, ProductUpdate]):
    """
    Repository for Product CRUD operations.
    """

    def __init__(self) -> None:
        """Initialize product repository with 'products' collection."""
        super().__init__("products")

    def _document_to_model(self, document: dict[str, Any]) -> ProductInDB:
        """
        Convert a MongoDB document to a ProductInDB instance.

        Args:
            document: MongoDB document dictionary.

        Returns:
            ProductInDB: Product model instance.
        """
        return ProductInDB(
            id=document["_id"],
            name=document["name"],
            price=document["price"],
            stock=document.get("stock", 0),
            created_at=document.get("created_at", datetime.now(timezone.utc)),
            updated_at=document.get("updated_at", datetime.now(timezone.utc)),
        )

    def _create_to_document(self, data: ProductCreate) -> dict[str, Any]:
        """
        Convert a ProductCreate schema to a MongoDB document.

        Args:
            data: ProductCreate schema instance.

        Returns:
            dict: MongoDB document dictionary.
        """
        now = datetime.now(timezone.utc)
        return {
            "name": data.name,
            "price": data.price,
            "stock": data.stock,
            "created_at": now,
            "updated_at": now,
        }

    def _update_to_document(self, data: ProductUpdate) -> dict[str, Any]:
        """
        Convert a ProductUpdate schema to a MongoDB update document.

        Args:
            data: ProductUpdate schema instance.

        Returns:
            dict: MongoDB update document dictionary with only non-None fields.
        """
        update_data: dict[str, Any] = {}

        if data.name is not None:
            update_data["name"] = data.name
        if data.price is not None:
            update_data["price"] = data.price
        if data.stock is not None:
            update_data["stock"] = data.stock

        # Always update the updated_at timestamp
        if update_data:
            update_data["updated_at"] = datetime.now(timezone.utc)

        return update_data

    async def update(self, id: str, data: ProductUpdate) -> Optional[ProductInDB]:
        """
        Update a product by its ID.

        Overrides base method to ensure updated_at is always set.

        Args:
            id: Product ID as string.
            data: ProductUpdate schema instance.

        Returns:
            Optional[ProductInDB]: Updated product if found, None otherwise.
        """
        if not ObjectId.is_valid(id):
            return None

        update_data = self._update_to_document(data)

        # If no fields provided, still update updated_at
        if not update_data:
            update_data = {"updated_at": datetime.now(timezone.utc)}

        result = await self.collection.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": update_data},
            return_document=True,
        )

        if result is None:
            return None

        return self._document_to_model(result)


# Singleton instance
product_repository = ProductRepository()
