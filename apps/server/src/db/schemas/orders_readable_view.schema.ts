import { integer, sqliteView, text } from 'drizzle-orm/sqlite-core';

// ======================================================================== //
// TYPESCRIPT TYPES FOR orders_readable VIEW
//
// This file provides TypeScript types for the orders_readable view
// WITHOUT actually creating the view (which is handled by the seeding system).
//
// The actual view is created by:
// - apps/server/src/db/utils/create-view.ts
// - apps/server/src/db/seeds/views.seed.ts
// ======================================================================== //

// Define the shape of the orders_readable view for TypeScript
export interface OrdersReadableView {
  id: string;
  mode: string;
  drinkType: string;
  drinkSubtype: string | null;
  volume: string;
  containerType: string;
  temperatureProfile: string;
  defaultTempConsume: number;
  defaultTempFreeze: number;
  isActive: number; // SQLite boolean as integer
  createdAt: number | null; // SQLite timestamp as integer
  updatedAt: number | null; // SQLite timestamp as integer
}

// Export a query helper for type-safe access to the view
export const orders_readable = {
  // This provides the table name for raw SQL queries
  _: {
    name: 'orders_readable' as const,
  },
} as const;
