"""
Base model abstraction using Pydantic v2 for MongoDB.
"""
from datetime import datetime, timezone
from typing import Annotated, Any, Optional

from bson import ObjectId
from pydantic import BaseModel, ConfigDict, Field
from pydantic.functional_validators import BeforeValidator


def validate_object_id(value: Any) -> ObjectId:
    """
    Validate and convert value to ObjectId.
    """
    if isinstance(value, ObjectId):
        return value
    if isinstance(value, str):
        if ObjectId.is_valid(value):
            return ObjectId(value)
        raise ValueError(f"Invalid ObjectId: {value}")
    raise ValueError(f"Cannot convert {type(value)} to ObjectId")


# Custom type for MongoDB ObjectId handling
PyObjectId = Annotated[ObjectId, BeforeValidator(validate_object_id)]


def get_utc_now() -> datetime:
    """Get current UTC datetime."""
    return datetime.now(timezone.utc)


class BaseDBModel(BaseModel):
    """
    Base model for MongoDB documents with common fields.
    """

    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    created_at: datetime = Field(default_factory=get_utc_now)
    updated_at: datetime = Field(default_factory=get_utc_now)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
        json_schema_extra={
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z",
            }
        },
    )

    def model_dump_mongo(self) -> dict[str, Any]:
        """
        Convert model to MongoDB-compatible dictionary.
        Excludes None values and converts id to _id.
        """
        data = self.model_dump(by_alias=True, exclude_none=True)
        return data
