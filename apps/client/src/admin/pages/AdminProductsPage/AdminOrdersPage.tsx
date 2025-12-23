import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * AdminOrdersPage - Parent route wrapper for all order-related routes
 *
 * This component serves as a parent route that uses <Outlet /> to render nested child routes:
 * - /admin/items (index) → AdminOrdersListPage (table view)
 * - /admin/items/:orderId → AdminOrderEditPage (edit form)
 *
 * Benefits of this nested route pattern:
 * - ✅ Can share state, context, or layout between list and edit views
 * - ✅ Can add shared UI elements (breadcrumbs, filters, etc.)
 * - ✅ More scalable for adding future order-related routes
 * - ✅ Can implement shared data loading or error boundaries
 * - ✅ Better separation of concerns (route structure mirrors feature structure)
 *
 * Future enhancements could include:
 * - Shared order context provider
 * - Persistent filters/search across views
 * - Shared loading/error states
 * - Breadcrumb navigation
 */
export const AdminOrdersPage: React.FC = () => {
  return <Outlet />;
};
