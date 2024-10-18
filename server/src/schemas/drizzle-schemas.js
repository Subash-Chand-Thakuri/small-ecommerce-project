import { mysqlTable, int, varchar, decimal } from 'drizzle-orm/mysql-core';

// Schema for 'products' table
export const products = mysqlTable('products', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  weight: int('weight').notNull(),
});

// Schema for 'courier_charges' table
export const courierCharges = mysqlTable('courier_charges', {
  id: int('id').primaryKey().autoincrement(),
  weightRange: varchar('weight_range', { length: 255 }).notNull(),
  charge: decimal('charge', { precision: 10, scale: 2 }).notNull(),
});
