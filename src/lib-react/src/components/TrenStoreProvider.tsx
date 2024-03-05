import { TrenStore } from "@/lib-base";
import React, { createContext, useEffect, useState } from "react";

export const TrenStoreContext = createContext<TrenStore | undefined>(undefined);

type TrenStoreProviderProps = {
  store: TrenStore;
  loader?: React.ReactNode;
  children?: React.ReactNode;
};

export const TrenStoreProvider: React.FC<TrenStoreProviderProps> = ({
  store,
  loader,
  children
}) => {
  const [loadedStore, setLoadedStore] = useState<TrenStore>();

  useEffect(() => {
    store.onLoaded = () => setLoadedStore(store);
    const stop = store.start();

    return () => {
      store.onLoaded = undefined;
      setLoadedStore(undefined);
      stop();
    };
  }, [store]);

  if (!loadedStore) {
    return <>{loader}</>;
  }

  return <TrenStoreContext.Provider value={loadedStore}>{children}</TrenStoreContext.Provider>;
};
