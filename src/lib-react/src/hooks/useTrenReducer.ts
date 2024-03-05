import { useCallback, useEffect, useReducer, useRef } from "react";

import { TrenStoreState } from "@/lib-base";

import { equals } from "../utils/equals";
import { useTrenStore } from "./useTrenStore";

export type TrenStoreUpdate<T = unknown> = {
  type: "updateStore";
  newState: TrenStoreState<T>;
  oldState: TrenStoreState<T>;
  stateChange: Partial<TrenStoreState<T>>;
};

export const useTrenReducer = <S, A, T>(
  reduce: (state: S, action: A | TrenStoreUpdate<T>) => S,
  init: (storeState: TrenStoreState<T>) => S
): [S, (action: A | TrenStoreUpdate<T>) => void] => {
  const store = useTrenStore<T>();
  const oldStore = useRef(store);
  const state = useRef(init(store.state));
  const [, rerender] = useReducer(() => ({}), {});

  const dispatch = useCallback(
    (action: A | TrenStoreUpdate<T>) => {
      const newState = reduce(state.current, action);

      if (!equals(newState, state.current)) {
        state.current = newState;
        rerender();
      }
    },
    [reduce]
  );

  useEffect(() => store.subscribe(params => dispatch({ type: "updateStore", ...params })), [
    store,
    dispatch
  ]);

  if (oldStore.current !== store) {
    state.current = init(store.state);
    oldStore.current = store;
  }

  return [state.current, dispatch];
};
