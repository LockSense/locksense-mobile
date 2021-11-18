import React, { Dispatch, SetStateAction, useContext } from 'react';

// TODO: useReducer instead of passing setStates around.

type StoreContextValue<T extends {}> = {
  store: T;
  setStore: Dispatch<SetStateAction<T>>;
};

const StoreContext = React.createContext<StoreContextValue<any>>({
  store: {},
  setStore: (client) => console.error('setDoorID not initialised'),
});

export const StoreProvider = <T extends {}>(props: React.ProviderProps<StoreContextValue<T>>) => (
  <StoreContext.Provider {...props} />
);

export const useStore = () => useContext(StoreContext);
