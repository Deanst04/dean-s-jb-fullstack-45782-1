"""
Product controller implementing API endpoints.
"""
from fastapi import APIRouter, status

from app.models.product import ProductCreate, ProductResponse
from app.services.product_service import product_service

router = APIRouter(
    prefix="/api/products",
    tags=["products"],
)


@router.get(
    "",
    response_model=list[ProductResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all products",
    description="Retrieve a list of all products.",
)
async def get_all_products() -> list[ProductResponse]:
    """
    Get all products.

    Returns:
        list[ProductResponse]: List of all products.
    """
    return await product_service.get_all_products()


@router.get(
    "/{product_id}",
    response_model=ProductResponse,
    status_code=status.HTTP_200_OK,
    summary="Get product by ID",
    description="Retrieve a single product by its ID.",
    responses={
        404: {"description": "Product not found"},
    },
)
async def get_product_by_id(product_id: str) -> ProductResponse:
    """
    Get a product by its ID.

    Args:
        product_id: Product ID as string.

    Returns:
        ProductResponse: Product data.

    Raises:
        HTTPException: If product is not found (404).
    """
    return await product_service.get_product_by_id(product_id)


@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new product",
    description="Create a new product with the provided data.",
)
async def create_product(product_data: ProductCreate) -> ProductResponse:
    """
    Create a new product.

    Args:
        product_data: ProductCreate schema with product data.

    Returns:
        ProductResponse: Created product data.
    """
    return await product_service.create_product(product_data)
