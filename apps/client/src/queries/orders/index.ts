export const GET_ORDERS_QUERYKEY = ['get-orders'] as const;
export const GET_ORDERS_READABLE_QUERYKEY = ['get-orders-readable'] as const;
export const GET_ORDER_READABLE_QUERYKEY = ['get-order-readable'] as const;
export const POST_ORDER_READABLE_QUERYKEY = ['post-order-readable'] as const;
export const PATCH_ORDER_READABLE_QUERYKEY = ['patch-order-readable'] as const;
export const DELETE_ORDER_READABLE_QUERYKEY = ['delete-order-readable'] as const;

export * from './useCreateOrder';
export * from './useDeleteOrder';
export * from './useGetOrderReadableById';
export * from './useGetOrdersReadable';
export * from './useUpdateOrder';
export * from './useUpdateTemperatureProfiles';
