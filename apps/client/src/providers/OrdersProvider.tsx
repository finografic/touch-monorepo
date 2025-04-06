import { createContext, useContext, useState, ReactNode } from 'react';

// Types based on your DB schema
type BeverageType = {
  id: string;
  name: string;
  displayName: string;
  hasSubtypes: boolean;
  defaultConsumptionTemp: number;
  defaultFreezeTemp: number;
};

type BeverageSubtype = {
  id: string;
  beverageTypeId: string;
  name: string;
  displayName: string;
  consumptionTemp: number;
  freezeTemp: number;
};

type OrderItem = {
  padNumber: number;
  beverageType?: BeverageType;
  beverageSubtype?: BeverageSubtype;
  // We'll add more properties as we build out the flow
};

type OrdersContextType = {
  activePads: Record<number, boolean>;
  setActivePads: (pads: Record<number, boolean>) => void;
  orders: Record<number, OrderItem>;
  setOrders: (orders: Record<number, OrderItem>) => void;
  handleNextStep: () => void;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  // State for active pads (from MenuPage)
  const [activePads, setActivePads] = useState<Record<number, boolean>>({
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
  });

  // State for orders (will contain the full order data for each pad)
  const [orders, setOrders] = useState<Record<number, OrderItem>>({});

  const handleNextStep = () => {
    // Convert active pads to order items
    const newOrders = { ...orders };
    Object.entries(activePads).forEach(([padNumber, isActive]) => {
      if (isActive) {
        // Only create/update orders for active pads
        const padNum = parseInt(padNumber);
        if (!newOrders[padNum]) {
          newOrders[padNum] = {
            padNumber: padNum,
          };
        }
      }
    });
    setOrders(newOrders);
  };

  return (
    <OrdersContext.Provider
      value={{
        activePads,
        setActivePads,
        orders,
        setOrders,
        handleNextStep,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

// Custom hook to use the orders context
export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};
