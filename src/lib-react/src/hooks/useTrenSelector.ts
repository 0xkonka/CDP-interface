import { useEffect, useReducer } from "react";

import { TrenStoreState } from "@/lib-base";

import { equals } from "../utils/equals";
import { useTrenStore } from "./useTrenStore";

export const useTrenSelector = <S, T>(select: (state: TrenStoreState<T>) => S): S => {
  const store = useTrenStore<T>();
  const [, rerender] = useReducer(() => ({}), {});

  useEffect(
    () =>
      store.subscribe(({ newState, oldState }) => {
        if (!equals(select(newState), select(oldState))) {
          rerender();
        }
      }),
    [store, select]
  );

  return select(store.state);
};
