"""
Product service implementing business logic.
"""
from fastapi import HTTPException, status

from app.models.product import ProductCreate, ProductResponse, ProductUpdate
from app.repositories.product_repository import ProductRepository, product_repository


class ProductService:
    """
    Service layer for product business logic.
    """

    def __init__(self, repository: ProductRepository) -> None:
        """
        Initialize product service with repository.

        Args:
            repository: ProductRepository instance.
        """
        self._repository = repository

    async def get_all_products(self) -> list[ProductResponse]:
        """
        Get all products.

        Returns:
            list[ProductResponse]: List of all products.
        """
        products = await self._repository.find_all()
        return [ProductResponse.from_db_model(product) for product in products]

    async def get_product_by_id(self, id: str) -> ProductResponse:
        """
        Get a product by its ID.

        Args:
            id: Product ID as string.

        Returns:
            ProductResponse: Product data.

        Raises:
            HTTPException: If product is not found.
        """
        product = await self._repository.find_by_id(id)
        if product is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id '{id}' not found",
            )
        return ProductResponse.from_db_model(product)

    async def create_product(self, data: ProductCreate) -> ProductResponse:
        """
        Create a new product.

        Args:
            data: ProductCreate schema with product data.

        Returns:
            ProductResponse: Created product data.
        """
        product = await self._repository.create(data)
        return ProductResponse.from_db_model(product)

    async def update_product(self, id: str, data: ProductUpdate) -> ProductResponse:
        """
        Update an existing product.

        Args:
            id: Product ID as string.
            data: ProductUpdate schema with fields to update.

        Returns:
            ProductResponse: Updated product data.

        Raises:
            HTTPException: If product is not found.
        """
        product = await self._repository.update(id, data)
        if product is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id '{id}' not found",
            )
        return ProductResponse.from_db_model(product)

    async def delete_product(self, id: str) -> bool:
        """
        Delete a product by its ID.

        Args:
            id: Product ID as string.

        Returns:
            bool: True if product was deleted.

        Raises:
            HTTPException: If product is not found.
        """
        deleted = await self._repository.delete(id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id '{id}' not found",
            )
        return True


# Singleton instance
product_service = ProductService(product_repository)
