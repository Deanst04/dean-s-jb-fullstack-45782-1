import "dotenv/config";
import express, { Application } from "express";
import { connectDatabase } from "./config/database";
import { productRoutes } from "./routes/product.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/products", productRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function bootstrap(): Promise<void> {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
