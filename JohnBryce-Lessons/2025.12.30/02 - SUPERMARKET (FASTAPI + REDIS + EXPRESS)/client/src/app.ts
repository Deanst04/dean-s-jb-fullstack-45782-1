import express, { Request, Response } from 'express';
import { createClient } from 'redis';
import cors from 'cors';

// Define the interface for our Product.
// This helps TypeScript understand the structure we expect to return.
interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    in_stock: boolean;
}

const app = express();
app.use(cors());

// Initialize the Redis client
const client = createClient();

client.on('error', (err) => console.log('Redis Client Error', err));

app.get('/products', async (req: Request, res: Response) => {
    try {
        // STEP 1: Fetch the Catalog (Index)
        // Returns an array of strings: ['1', '3', '4']
        const productIds = await client.sMembers('products:ids');

        const products: Product[] = [];

        // STEP 2: Fetch and Parse details for each product
        for (const id of productIds) {
            const productKey = `product:${id}`;
            
            // Fetch the raw data from Redis (everything is a string here!)
            const rawData = await client.hGetAll(productKey);

            // Check if the product actually exists
            if (Object.keys(rawData).length > 0) {
                
                // STEP 3: Data Parsing / Hydration
                // We must manually convert the Redis strings back to real JS types.
                const parsedProduct: Product = {
                    id: id,
                    name: rawData.name,
                    // Convert string "12.5" -> number 12.5
                    price: parseFloat(rawData.price),
                    category: rawData.category,
                    // Convert string "True" -> boolean true
                    // In Python we saved it as "True" (capital T), so we check against that.
                    in_stock: rawData.in_stock === 'True' 
                };

                products.push(parsedProduct);
            }
        }

        res.json(products);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

async function startServer() {
    await client.connect();
    console.log("Connected to Redis");

    app.listen(3001, () => {
        console.log('Client Server is running on port 3001');
    });
}

startServer();