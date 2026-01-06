"""
Product model definitions using Pydantic v2.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.base import BaseDBModel, PyObjectId


class ProductBase(BaseModel):
    """
    Base product model with common fields and validations.
    """

    name: str = Field(..., min_length=1, description="Product name")
    price: float = Field(..., description="Product price")
    stock: int = Field(default=0, description="Product stock quantity")

    @field_validator("name", mode="before")
    @classmethod
    def trim_name(cls, value: str) -> str:
        """Trim whitespace from name."""
        if isinstance(value, str):
            return value.strip()
        return value

    @field_validator("price")
    @classmethod
    def validate_price(cls, value: float) -> float:
        """Ensure price is non-negative."""
        if value < 0:
            raise ValueError("Price must be >= 0")
        return value

    @field_validator("stock")
    @classmethod
    def validate_stock(cls, value: int) -> int:
        """Ensure stock is non-negative."""
        if value < 0:
            raise ValueError("Stock must be >= 0")
        return value

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Sample Product",
                "price": 29.99,
                "stock": 100,
            }
        }
    )


class ProductCreate(ProductBase):
    """
    Model for creating a new product.
    """

    pass


class ProductUpdate(BaseModel):
    """
    Model for updating a product. All fields are optional.
    """

    name: Optional[str] = Field(default=None, min_length=1, description="Product name")
    price: Optional[float] = Field(default=None, description="Product price")
    stock: Optional[int] = Field(default=None, description="Product stock quantity")

    @field_validator("name", mode="before")
    @classmethod
    def trim_name(cls, value: Optional[str]) -> Optional[str]:
        """Trim whitespace from name if provided."""
        if isinstance(value, str):
            return value.strip()
        return value

    @field_validator("price")
    @classmethod
    def validate_price(cls, value: Optional[float]) -> Optional[float]:
        """Ensure price is non-negative if provided."""
        if value is not None and value < 0:
            raise ValueError("Price must be >= 0")
        return value

    @field_validator("stock")
    @classmethod
    def validate_stock(cls, value: Optional[int]) -> Optional[int]:
        """Ensure stock is non-negative if provided."""
        if value is not None and value < 0:
            raise ValueError("Stock must be >= 0")
        return value

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Updated Product",
                "price": 39.99,
                "stock": 50,
            }
        }
    )


class ProductInDB(ProductBase, BaseDBModel):
    """
    Full product model as stored in the database.
    """

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "name": "Sample Product",
                "price": 29.99,
                "stock": 100,
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z",
            }
        },
    )


class ProductResponse(BaseModel):
    """
    Product response model for API responses.
    """

    id: str = Field(..., description="Product ID")
    name: str = Field(..., description="Product name")
    price: float = Field(..., description="Product price")
    stock: int = Field(..., description="Product stock quantity")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "name": "Sample Product",
                "price": 29.99,
                "stock": 100,
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z",
            }
        }
    )

    @classmethod
    def from_db_model(cls, product: ProductInDB) -> "ProductResponse":
        """
        Create a ProductResponse from a ProductInDB instance.
        """
        return cls(
            id=str(product.id),
            name=product.name,
            price=product.price,
            stock=product.stock,
            created_at=product.created_at,
            updated_at=product.updated_at,
        )
