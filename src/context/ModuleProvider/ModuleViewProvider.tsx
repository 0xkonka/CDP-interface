import React, { useState, useCallback, useEffect, useRef } from "react";
import { useLiquitySelector } from "@/lib-react"; 
import { LiquityStoreState, UserModuleStatus } from "@/lib-base";
import { ModuleViewContext } from "./ModuleViewContext";
import type { ModuleView, ModuleEvent } from "./types";

type ModuleEventTransitions = Record<ModuleView, Partial<Record<ModuleEvent, ModuleView>>>;

const transitions: ModuleEventTransitions = {
  NONE: {
    OPEN_MODULE_PRESSED: "OPENING",
    MODULE_OPENED: "ACTIVE"
  },
  LIQUIDATED: {
    OPEN_MODULE_PRESSED: "OPENING",
    MODULE_SURPLUS_COLLATERAL_CLAIMED: "NONE",
    MODULE_OPENED: "ACTIVE"
  },
  REDEEMED: {
    OPEN_MODULE_PRESSED: "OPENING",
    MODULE_SURPLUS_COLLATERAL_CLAIMED: "NONE",
    MODULE_OPENED: "ACTIVE"
  },
  OPENING: {
    CANCEL_ADJUST_MODULE_PRESSED: "NONE",
    MODULE_OPENED: "ACTIVE"
  },
  ADJUSTING: {
    CANCEL_ADJUST_MODULE_PRESSED: "ACTIVE",
    MODULE_ADJUSTED: "ACTIVE",
    MODULE_CLOSED: "NONE",
    MODULE_LIQUIDATED: "LIQUIDATED",
    MODULE_REDEEMED: "REDEEMED"
  },
  CLOSING: {
    CANCEL_ADJUST_MODULE_PRESSED: "ACTIVE",
    MODULE_CLOSED: "NONE",
    MODULE_ADJUSTED: "ACTIVE",
    MODULE_LIQUIDATED: "LIQUIDATED",
    MODULE_REDEEMED: "REDEEMED"
  },
  ACTIVE: {
    ADJUST_MODULE_PRESSED: "ADJUSTING",
    CLOSE_MODULE_PRESSED: "CLOSING",
    MODULE_CLOSED: "NONE",
    MODULE_LIQUIDATED: "LIQUIDATED",
    MODULE_REDEEMED: "REDEEMED"
  }
};

type ModuleStateEvents = Partial<Record<UserModuleStatus, ModuleEvent>>;

const moduleStatusEvents: ModuleStateEvents = {
  open: "MODULE_OPENED",
  closedByOwner: "MODULE_CLOSED",
  closedByLiquidation: "MODULE_LIQUIDATED",
  closedByRedemption: "MODULE_REDEEMED"
};

const transition = (view: ModuleView, event: ModuleEvent): ModuleView => {
  const nextView = transitions[view][event] ?? view;
  return nextView;
};

const getInitialView = (moduleStatus: UserModuleStatus): ModuleView => {
  if (moduleStatus === "closedByLiquidation") {
    return "LIQUIDATED";
  }
  if (moduleStatus === "closedByRedemption") {
    return "REDEEMED";
  }
  if (moduleStatus === "open") {
    return "ACTIVE";
  }
  return "NONE";
};

const select = ({ module: { status } }: LiquityStoreState) => status;

export const ModuleViewProvider: React.FC = props => {
  const { children } = props;
  const moduleStatus = useLiquitySelector(select);

  console.log('moduleStatus', moduleStatus)

  const [view, setView] = useState<ModuleView>(getInitialView(moduleStatus));
  const viewRef = useRef<ModuleView>(view);

  console.log('view', view)
  console.log('viewRef', viewRef)

  const dispatchEvent = useCallback((event: ModuleEvent) => {
    const nextView = transition(viewRef.current, event);

    console.log(
      "dispatchEvent() [current-view, event, next-view]",
      viewRef.current,
      event,
      nextView
    );
    setView(nextView);
  }, []);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    const event = moduleStatusEvents[moduleStatus] ?? null;
    if (event !== null) {
      dispatchEvent(event);
    }
  }, [moduleStatus, dispatchEvent]);

  const provider = {
    view,
    dispatchEvent
  };
  return <ModuleViewContext.Provider value={provider}>{children}</ModuleViewContext.Provider>;
};
