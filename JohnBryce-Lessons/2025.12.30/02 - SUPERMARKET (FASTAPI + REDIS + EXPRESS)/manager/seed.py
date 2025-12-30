import requests
import random
import time

# Configuration
SERVER_URL = "http://127.0.0.1:8000/products"
TOTAL_PRODUCTS = 1000  # You can change this to 5000 or 10000 to test heavier loads

# Data pools for random generation
adjectives = ["Fresh", "Organic", "Premium", "Tasty", "Homemade", "Spicy", "Sweet", "Green", "Vegan", "Gluten-Free"]
nouns = ["Milk", "Bread", "Cheese", "Apple", "Banana", "Tomato", "Pasta", "Rice", "Coffee", "Tea", "Cake", "Pizza", "Burger", "Salad", "Juice"]
categories = ["Dairy", "Bakery", "Vegetables", "Pantry", "Drinks", "Snacks", "Meat", "Frozen"]

def generate_random_product():
    """Generates a random product object."""
    name = f"{random.choice(adjectives)} {random.choice(nouns)} {random.randint(1, 100)}"
    return {
        "name": name,
        "price": round(random.uniform(1.5, 99.9), 2),  # Random price between 1.5 and 99.9
        "category": random.choice(categories),
        "in_stock": random.choice([True, True, True, False])  # 75% chance of being in stock
    }

def run_stress_test():
    print(f"🚀 Starting stress test: Inserting {TOTAL_PRODUCTS} products...")
    
    start_time = time.time()
    success_count = 0
    fail_count = 0

    # Using a Session object improves performance by reusing the TCP connection
    with requests.Session() as session:
        for i in range(TOTAL_PRODUCTS):
            product = generate_random_product()
            
            try:
                response = session.post(SERVER_URL, json=product)
                if response.status_code == 200:
                    success_count += 1
                    # Print progress every 100 items to avoid flooding the terminal
                    if success_count % 100 == 0:
                        print(f"   [Progress] {success_count}/{TOTAL_PRODUCTS} products added...")
                else:
                    fail_count += 1
                    print(f"⚠️ Failed to add product: {response.text}")
            except Exception as e:
                fail_count += 1
                print(f"❌ Connection Error: {e}")
                # Stop if server is down
                if fail_count > 10:
                    print("🚨 Too many errors. Stopping script.")
                    break

    end_time = time.time()
    duration = end_time - start_time
    
    print("\n" + "="*40)
    print(f"🏁 STRESS TEST COMPLETE")
    print(f"✅ Successful: {success_count}")
    print(f"❌ Failed: {fail_count}")
    print(f"⏱️ Time taken: {duration:.2f} seconds")
    print(f"⚡ Rate: {success_count / duration:.0f} requests/second")
    print("="*40)

if __name__ == "__main__":
    run_stress_test()