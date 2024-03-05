import { useContext } from "react";

import { TrenStore } from "@/lib-base";

import { TrenStoreContext } from "../components/TrenStoreProvider";

export const useTrenStore = <T>(): TrenStore<T> => {
  const store = useContext(TrenStoreContext);

  if (!store) {
    throw new Error("You must provide a TrenStore via TrenStoreProvider");
  }

  return store as TrenStore<T>;
};
