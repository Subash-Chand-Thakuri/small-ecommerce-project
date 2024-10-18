import asyncHandler from "express-async-handler";
import { db } from "../config/db.js";
import { sql } from "drizzle-orm";
import { products } from "../schemas/drizzle-schemas.js";

const productsData = [
    { id: 1, name: "Item 1", price: 10, weight: 200 },
    { id: 2, name: "Item 2", price: 100, weight: 20 },
    { id: 3, name: "Item 3", price: 30, weight: 300 },
    { id: 4, name: "Item 4", price: 20, weight: 500 },
    { id: 5, name: "Item 5", price: 30, weight: 250 },
    { id: 6, name: "Item 6", price: 40, weight: 10 },
    { id: 7, name: "Item 7", price: 200, weight: 10 },
    { id: 8, name: "Item 8", price: 120, weight: 500 },
    { id: 9, name: "Item 9", price: 130, weight: 790 },
    { id: 10, name: "Item 10", price: 20, weight: 100 },
    { id: 11, name: "Item 11", price: 10, weight: 340 },
    { id: 12, name: "Item 12", price: 4, weight: 800 },
    { id: 13, name: "Item 13", price: 5, weight: 200 },
    { id: 14, name: "Item 14", price: 240, weight: 20 },
    { id: 15, name: "Item 15", price: 123, weight: 700 },
    { id: 16, name: "Item 16", price: 245, weight: 10 },
    { id: 17, name: "Item 17", price: 230, weight: 20 },
    { id: 18, name: "Item 18", price: 110, weight: 200 },
    { id: 19, name: "Item 19", price: 45, weight: 200 },
    { id: 20, name: "Item 20", price: 67, weight: 20 },
    { id: 21, name: "Item 21", price: 88, weight: 300 },
    { id: 22, name: "Item 22", price: 10, weight: 500 },
    { id: 23, name: "Item 23", price: 17, weight: 250 },
    { id: 24, name: "Item 24", price: 19, weight: 10 },
    { id: 25, name: "Item 25", price: 89, weight: 10 },
    { id: 26, name: "Item 26", price: 45, weight: 500 },
    { id: 27, name: "Item 27", price: 99, weight: 790 },
    { id: 28, name: "Item 28", price: 125, weight: 100 },
    { id: 29, name: "Item 29", price: 198, weight: 340 },
    { id: 30, name: "Item 30", price: 220, weight: 800 },
    { id: 31, name: "Item 31", price: 249, weight: 200 },
    { id: 32, name: "Item 32", price: 230, weight: 20 },
    { id: 33, name: "Item 33", price: 190, weight: 700 },
    { id: 34, name: "Item 34", price: 45, weight: 10 },
    { id: 35, name: "Item 35", price: 12, weight: 20 },
    { id: 36, name: "Item 36", price: 5, weight: 200 },
    { id: 37, name: "Item 37", price: 2, weight: 200 },
    { id: 38, name: "Item 38", price: 90, weight: 20 },
    { id: 39, name: "Item 39", price: 12, weight: 300 },
    { id: 40, name: "Item 40", price: 167, weight: 500 },
    { id: 41, name: "Item 41", price: 12, weight: 250 },
    { id: 42, name: "Item 42", price: 8, weight: 10 },
    { id: 43, name: "Item 43", price: 2, weight: 10 },
    { id: 44, name: "Item 44", price: 9, weight: 500 },
    { id: 45, name: "Item 45", price: 210, weight: 790 },
    { id: 46, name: "Item 46", price: 167, weight: 100 },
    { id: 47, name: "Item 47", price: 23, weight: 340 },
    { id: 48, name: "Item 48", price: 190, weight: 800 },
    { id: 49, name: "Item 49", price: 199, weight: 200 },
    { id: 50, name: "Item 50", price: 12, weight: 20 },
  ];
  

export const getProducts = asyncHandler(async (req, res) => {
  try {
    const rows = await db.select().from(products);

    // Use rows if found, otherwise return productsData
    const fetchedProducts = rows.length > 0 ? rows : productsData;

    res.json({
      status: 200,
      message: "Products fetched successfully",
      products: fetchedProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

export const getProductById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const [row] = await db.select().from(products).where(products.id.eq(id));

    if (row) {
      res.json({
        status: 200,
        message: "Product fetched successfully",
        product: row,
      });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});
