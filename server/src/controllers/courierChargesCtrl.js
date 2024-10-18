import asyncHandler from "express-async-handler";
import { db } from "../config/db.js";
import { sql } from "drizzle-orm";
import { courierCharges } from "../schemas/drizzle-schemas.js";

const COURIER_COSTS = [
  { range: "0-200", price: 5 },
  { range: "200-500", price: 10 },
  { range: "500-1000", price: 15 },
  { range: "1000-5000", price: 20 },
];

export const getCourierCharges = asyncHandler(async (req, res) => {
  try {
    const rows = await db.select().from(courierCharges);

    // Use rows if found, otherwise return productsData
    const fetchedCourierCharges = rows.length > 0 ? rows : COURIER_COSTS;

    res.json({
      status: 200,
      message: "Courier charges fetched successfully",
      products: fetchedCourierCharges,
    });
  } catch (error) {
    console.error("Error fetching courier charges:", error);
    res.status(500).json({ message: "Failed to fetch courier charges" });
  }
});

export const getCourierChargeById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const [row] = await db
      .select()
      .from(courierCharges)
      .where(courierCharges.id.eq(id));

    if (row) {
      res.json({
        status: 200,
        message: "Courier charge fetched successfully",
        courierCharge: row,
      });
    } else {
      res.status(404).json({ message: "Courier charge not found" });
    }
  } catch (error) {
    console.error("Error fetching courier charge by ID:", error);
    res.status(500).json({ message: "Failed to fetch courier charge" });
  }
});
