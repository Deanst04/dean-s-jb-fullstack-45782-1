#!/usr/bin/env python3
"""
MongoDB Product Seeder Script

Populates the products collection with realistic e-commerce data using Faker.
Supports CLI arguments for custom product counts and optional clearing of existing data.

Usage:
    python seed_products.py          # Seeds 100 products (default)
    python seed_products.py 500      # Seeds 500 products
    python seed_products.py --clear  # Clears existing products before seeding
    python seed_products.py 500 --clear
"""

import argparse
import asyncio
import os
import random
import signal
import sys
import time
from datetime import datetime, timedelta, timezone
from typing import Any

from dotenv import load_dotenv
from faker import Faker
from motor.motor_asyncio import AsyncIOMotorClient

# Load environment variables
load_dotenv()

# Initialize Faker
fake = Faker()

# Category configurations with brands, product types, adjectives, and price ranges
CATEGORY_CONFIG: dict[str, dict[str, Any]] = {
    "Electronics": {
        "brands": ["Samsung", "Apple", "Sony", "LG", "Dell", "HP", "Asus", "Lenovo"],
        "product_types": ["Smartphone", "Laptop", "Tablet", "Monitor", "Headphones", "Speaker", "Camera", "Smartwatch"],
        "adjectives": ["Pro", "Ultra", "Plus", "Max", "Elite", "Premium", "Advanced", "Smart"],
        "variants": ["X", "S", "SE", "Mini", "Lite", "Air", "Plus", "2024", "Gen 5"],
        "price_range": (50, 2000),
    },
    "Clothing": {
        "brands": ["Nike", "Adidas", "Levi's", "Zara", "H&M", "Uniqlo", "Gap", "Tommy Hilfiger"],
        "product_types": ["T-Shirt", "Jeans", "Jacket", "Hoodie", "Sneakers", "Dress", "Sweater", "Shorts"],
        "adjectives": ["Classic", "Slim", "Vintage", "Modern", "Comfort", "Sport", "Urban", "Essential"],
        "variants": ["Fit", "Edition", "Collection", "Series", "Style", "Line"],
        "price_range": (15, 300),
    },
    "Home & Kitchen": {
        "brands": ["Philips", "Bosch", "Tefal", "IKEA", "Ninja", "KitchenAid", "Cuisinart", "Instant Pot"],
        "product_types": ["Blender", "Toaster", "Coffee Maker", "Air Fryer", "Mixer", "Cookware Set", "Knife Set", "Vacuum"],
        "adjectives": ["Digital", "Smart", "Professional", "Compact", "Deluxe", "Multi-Function", "Eco", "Silent"],
        "variants": ["Pro", "Plus", "Max", "Home", "Chef", "Series"],
        "price_range": (10, 800),
    },
    "Sports": {
        "brands": ["Decathlon", "Puma", "Under Armour", "Reebok", "Wilson", "Spalding", "Columbia", "The North Face"],
        "product_types": ["Running Shoes", "Yoga Mat", "Dumbbell Set", "Fitness Tracker", "Backpack", "Tennis Racket", "Basketball", "Cycling Gear"],
        "adjectives": ["Performance", "Training", "Pro", "Endurance", "Flex", "Power", "Aero", "Trail"],
        "variants": ["X", "Elite", "Lite", "Tour", "Sport", "Active"],
        "price_range": (10, 500),
    },
    "Beauty": {
        "brands": ["L'Oréal", "Maybelline", "Nivea", "The Ordinary", "Neutrogena", "Olay", "Clinique", "MAC"],
        "product_types": ["Moisturizer", "Serum", "Lipstick", "Foundation", "Mascara", "Sunscreen", "Face Wash", "Hair Oil"],
        "adjectives": ["Hydrating", "Revitalizing", "Matte", "Glow", "Natural", "Intensive", "Daily", "Anti-Aging"],
        "variants": ["SPF 50", "24H", "Vitamin C", "Retinol", "Collagen", "Original"],
        "price_range": (5, 200),
    },
    "Toys": {
        "brands": ["LEGO", "Hasbro", "Mattel", "Fisher-Price", "Playmobil", "Hot Wheels", "Nerf", "Barbie"],
        "product_types": ["Building Set", "Action Figure", "Board Game", "Puzzle", "Remote Car", "Doll", "Plush Toy", "Educational Kit"],
        "adjectives": ["Deluxe", "Ultimate", "Creative", "Adventure", "Magic", "Super", "Classic", "Interactive"],
        "variants": ["Edition", "Collection", "Series", "Pack", "Bundle", "Set"],
        "price_range": (5, 250),
    },
    "Books": {
        "brands": ["Penguin", "HarperCollins", "O'Reilly", "Wiley", "McGraw-Hill", "Random House", "Simon & Schuster", "Scholastic"],
        "product_types": ["Programming Guide", "Novel", "Cookbook", "Self-Help Book", "Textbook", "Biography", "Science Book", "Art Book"],
        "adjectives": ["Complete", "Essential", "Illustrated", "Definitive", "Practical", "Modern", "Comprehensive", "Beginner's"],
        "variants": ["2nd Edition", "Revised", "Hardcover", "Paperback", "Deluxe", "Annotated"],
        "price_range": (5, 120),
    },
    "Automotive": {
        "brands": ["Michelin", "Bosch", "Castrol", "Mobil", "Continental", "Goodyear", "3M", "Meguiar's"],
        "product_types": ["Tire", "Car Battery", "Motor Oil", "Brake Pads", "Air Filter", "Wiper Blades", "Car Polish", "Jump Starter"],
        "adjectives": ["Premium", "Heavy-Duty", "All-Season", "Performance", "Synthetic", "Pro", "Ultra", "Long-Life"],
        "variants": ["Plus", "Max", "Sport", "Touring", "HD", "GT"],
        "price_range": (10, 900),
    },
    "Garden": {
        "brands": ["Gardena", "Fiskars", "Greenworks", "Black+Decker", "Husqvarna", "Scotts", "Miracle-Gro", "Weber"],
        "product_types": ["Lawn Mower", "Pruning Shears", "Garden Hose", "Sprinkler", "Hedge Trimmer", "Potting Soil", "Plant Food", "BBQ Grill"],
        "adjectives": ["Electric", "Cordless", "Professional", "Eco", "Heavy-Duty", "Compact", "Smart", "Organic"],
        "variants": ["Pro", "Plus", "Lite", "Max", "Series", "XL"],
        "price_range": (10, 700),
    },
    "Office": {
        "brands": ["HP", "Logitech", "Brother", "Canon", "Epson", "Microsoft", "Staples", "3M"],
        "product_types": ["Printer", "Keyboard", "Mouse", "Monitor Stand", "Desk Lamp", "Paper Shredder", "Label Maker", "Webcam"],
        "adjectives": ["Wireless", "Ergonomic", "Professional", "Compact", "Smart", "Silent", "High-Speed", "LED"],
        "variants": ["Pro", "Plus", "Business", "Home", "Elite", "HD"],
        "price_range": (10, 600),
    },
}


def generate_stock() -> int:
    """Generate stock levels with weighted distribution."""
    rand = random.random()
    if rand < 0.70:  # 70% chance: 10-100
        return random.randint(10, 100)
    elif rand < 0.90:  # 20% chance: 1-10
        return random.randint(1, 10)
    else:  # 10% chance: 0
        return 0


def generate_product() -> dict[str, Any]:
    """Generate a single realistic product document."""
    category = random.choice(list(CATEGORY_CONFIG.keys()))
    config = CATEGORY_CONFIG[category]

    brand = random.choice(config["brands"])
    adjective = random.choice(config["adjectives"])
    product_type = random.choice(config["product_types"])
    variant = random.choice(config["variants"])

    # Generate product name
    name = f"{brand} {adjective} {product_type} {variant}"

    # Generate price within category range
    min_price, max_price = config["price_range"]
    price = round(random.uniform(min_price, max_price), 2)

    # Generate stock with weighted distribution
    stock = generate_stock()

    # Generate timestamps within last 90 days
    days_ago = random.randint(0, 90)
    created_at = datetime.now(timezone.utc) - timedelta(days=days_ago)

    # updated_at is same as created_at or slightly after (0-7 days)
    update_offset = random.randint(0, min(7, days_ago))
    updated_at = created_at + timedelta(days=update_offset)

    return {
        "name": name,
        "price": price,
        "stock": stock,
        "created_at": created_at,
        "updated_at": updated_at,
    }


def validate_count(value: str) -> int:
    """Validate product count is within acceptable range."""
    try:
        count = int(value)
        if count < 1 or count > 10000:
            raise argparse.ArgumentTypeError(
                f"Count must be between 1 and 10000, got {count}"
            )
        return count
    except ValueError:
        raise argparse.ArgumentTypeError(f"Invalid count value: {value}")


async def seed_products(
    count: int,
    clear_existing: bool,
    skip_confirmation: bool = False,
) -> None:
    """Main seeding function."""
    # Get environment variables
    mongodb_uri = os.getenv("MONGODB_URI")
    mongodb_database = os.getenv("MONGODB_DATABASE")

    if not mongodb_uri:
        print("Error: MONGODB_URI environment variable is not set.")
        print("Please ensure .env file exists with MONGODB_URI defined.")
        sys.exit(1)

    if not mongodb_database:
        print("Error: MONGODB_DATABASE environment variable is not set.")
        print("Please ensure .env file exists with MONGODB_DATABASE defined.")
        sys.exit(1)

    # Display seeding plan
    print("\n" + "=" * 50)
    print("MongoDB Product Seeder")
    print("=" * 50)
    print(f"Database:   {mongodb_database}")
    print(f"Collection: products")
    print(f"Products:   {count:,}")
    if clear_existing:
        print("Action:     CLEAR existing products, then insert new ones")
    else:
        print("Action:     INSERT new products (keep existing)")
    print("=" * 50)

    # Confirmation prompt
    if not skip_confirmation:
        while True:
            response = input("\nProceed with seeding? (y/n): ").strip().lower()
            if response in ("y", "yes"):
                break
            elif response in ("n", "no"):
                print("Seeding cancelled.")
                return
            else:
                print("Please enter 'y' or 'n'.")

    # Connect to MongoDB
    print("\nConnecting to MongoDB...")
    try:
        client: AsyncIOMotorClient = AsyncIOMotorClient(mongodb_uri)
        # Test connection
        await client.admin.command("ping")
        print("Connected successfully!")
    except Exception as e:
        print(f"Error: Failed to connect to MongoDB: {e}")
        sys.exit(1)

    db = client[mongodb_database]
    collection = db["products"]

    start_time = time.time()

    try:
        # Clear existing products if requested
        if clear_existing:
            print("\nClearing existing products...")
            result = await collection.delete_many({})
            print(f"Deleted {result.deleted_count:,} existing products.")

        # Generate products
        print(f"\nGenerating {count:,} products...")
        products = [generate_product() for _ in range(count)]

        # Insert in batches of 100
        batch_size = 100
        total_inserted = 0

        print("Inserting products in batches...")
        for i in range(0, len(products), batch_size):
            batch = products[i : i + batch_size]
            await collection.insert_many(batch)
            total_inserted += len(batch)

            # Progress indicator
            progress = (total_inserted / count) * 100
            print(f"\rProgress: {total_inserted:,}/{count:,} ({progress:.1f}%)", end="")

        print()  # New line after progress

        elapsed_time = time.time() - start_time

        # Calculate statistics
        prices = [p["price"] for p in products]
        stocks = [p["stock"] for p in products]

        stock_zero = sum(1 for s in stocks if s == 0)
        stock_low = sum(1 for s in stocks if 1 <= s <= 10)
        stock_normal = sum(1 for s in stocks if s > 10)

        # Print summary
        print("\n" + "=" * 50)
        print("SEEDING COMPLETE")
        print("=" * 50)
        print(f"Total inserted:    {total_inserted:,} products")
        print(f"Time taken:        {elapsed_time:.2f} seconds")
        print(f"Insert rate:       {total_inserted / elapsed_time:.0f} products/sec")
        print()
        print("Price Statistics:")
        print(f"  Min price:       ${min(prices):,.2f}")
        print(f"  Max price:       ${max(prices):,.2f}")
        print(f"  Avg price:       ${sum(prices) / len(prices):,.2f}")
        print()
        print("Stock Distribution:")
        print(f"  Out of stock (0):      {stock_zero:,} ({stock_zero / count * 100:.1f}%)")
        print(f"  Low stock (1-10):      {stock_low:,} ({stock_low / count * 100:.1f}%)")
        print(f"  Normal stock (10+):    {stock_normal:,} ({stock_normal / count * 100:.1f}%)")
        print()
        print("Sample Products:")
        for product in random.sample(products, min(5, len(products))):
            print(f"  - {product['name']} (${product['price']:.2f}, stock: {product['stock']})")
        print("=" * 50)

    except Exception as e:
        print(f"\nError during seeding: {e}")
        sys.exit(1)
    finally:
        client.close()
        print("\nDatabase connection closed.")


def handle_sigint(signum: int, frame: Any) -> None:
    """Handle Ctrl+C gracefully."""
    print("\n\nSeeding interrupted by user. Exiting...")
    sys.exit(0)


def main() -> None:
    """Entry point with CLI argument parsing."""
    # Set up signal handler for graceful shutdown
    signal.signal(signal.SIGINT, handle_sigint)

    parser = argparse.ArgumentParser(
        description="Seed MongoDB products collection with realistic e-commerce data.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python seed_products.py          # Seed 100 products (default)
  python seed_products.py 500      # Seed 500 products
  python seed_products.py --clear  # Clear existing, then seed 100 products
  python seed_products.py 1000 --clear  # Clear existing, then seed 1000 products
  python seed_products.py -y       # Skip confirmation prompt
        """,
    )

    parser.add_argument(
        "count",
        nargs="?",
        type=validate_count,
        default=100,
        help="Number of products to seed (1-10000, default: 100)",
    )

    parser.add_argument(
        "--clear",
        "-c",
        action="store_true",
        help="Clear existing products before seeding",
    )

    parser.add_argument(
        "-y",
        "--yes",
        action="store_true",
        help="Skip confirmation prompt",
    )

    args = parser.parse_args()

    # Run the async seeding function
    asyncio.run(seed_products(args.count, args.clear, args.yes))


if __name__ == "__main__":
    main()
