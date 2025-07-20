import React, { createContext, useEffect } from 'react';
import type { StoreApi } from 'zustand';

export const createZustandContext = <TInitial extends object, TStore extends StoreApi<any>>(
  getStore: (props: { initialValue?: Partial<TInitial> }) => TStore,
) => {
  const Context = createContext<TStore | null>(null);

  const Provider = ({
    children,
    initialValue = {} as Partial<TInitial>,
  }: {
    children?: React.ReactNode;
    initialValue?: Partial<TInitial>;
  }) => {
    const [store] = React.useState(() => getStore({ initialValue }));

    return <Context.Provider value={store}>{children}</Context.Provider>;
  };

  return {
    Context,
    Provider,
    useContext: () => React.useContext(Context),
    subscribe: (listener: (state: any) => void) => {
      const store = React.useContext(Context);
      if (!store) {
        throw new Error('Store cannot be null when subscribing to changes.');
      }
      useEffect(() => {
        const unsubscribe = store.subscribe(listener);
        return unsubscribe;
      }, [store]);

      return store;
    },
  };
};

// ======================================================================== //
// NOTE: HELPER METHOD TO CREATE (generic) SETTERS FOR ZUSTAND STORE 🚀👍🏻

type SetState<T> = (partial: Partial<T> | ((state: T) => Partial<T>), replace?: boolean) => void;

/**
 * Utility type that generates setter function types based on a values object type
 * @template TValues - The values object type
 * @template TPrefix - The prefix to use for setter names (defaults to empty string)
 * @returns Object type with setter functions for each property in TValues
 */
export type CreateSettersType<TValues extends Record<string, any>, TPrefix extends string = ''> = {
  [K in keyof TValues as `set${TPrefix}${Capitalize<string & K>}`]: (val: TValues[K]) => void;
};

export const createSetters = <
  TStore extends { [K in keyof TValues]: TValues[K] },
  TValues extends Record<string, any>,
  TPrefix extends string = '',
>({
  set,
  prefix = '' as TPrefix,
  defaultValue: defaultValues,
}: {
  defaultValue: TValues;
  set: SetState<TStore>;
  prefix?: TPrefix;
}): CreateSettersType<TValues, TPrefix> => {
  return Object.keys(defaultValues).reduce(
    (acc, key) => ({
      ...acc,
      [`set${prefix}${key.charAt(0).toUpperCase() + key.slice(1)}`]: (val: TValues[typeof key]) =>
        set((state) => ({ ...state, [key]: val })),
    }),
    {},
  ) as CreateSettersType<TValues, TPrefix>;
};
