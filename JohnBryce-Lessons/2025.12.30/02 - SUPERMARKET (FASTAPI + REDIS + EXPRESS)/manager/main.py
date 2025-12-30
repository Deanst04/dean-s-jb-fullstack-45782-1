from fastapi import FastAPI
from pydantic import BaseModel # Pydantic helps us define the shape of the data we expect
import redis

app = FastAPI()

r = redis.Redis(
    host='localhost',
    port=6379,
    decode_responses=True
)

# Define the structure of a product using Pydantic.
# This ensures that whoever calls our API sends exactly these fields.
class Product(BaseModel):
    name: str
    price: float
    category: str
    in_stock: bool

@app.get("/")
def read_root():
    return {"message": "Manager Server is running"}

@app.post("/products")
def add_product(product: Product):
    new_id = r.incr("product_id_counter")
    product_key = f"product:{new_id}"
    
    # 1. Convert Pydantic model to a dict
    product_data = product.model_dump()
    
    # 2. FIX: Convert boolean to string
    # Redis cannot store boolean values (True/False) directly.
    # We must convert them to strings ("True"/"False") or integers (1/0).
    product_data['in_stock'] = str(product_data['in_stock'])
    
    # 3. Save the product data (now containing only strings/numbers)
    r.hset(product_key, mapping=product_data)
    
    r.sadd("products:ids", new_id)
    
    return {
        "message": "Product added successfully", 
        "id": new_id, 
        "product": product
    }