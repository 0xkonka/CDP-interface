import { createContext, useContext } from "react";
import type { ModuleView, ModuleEvent } from "./types";

type ModuleViewContextType = {
  view: ModuleView;
  dispatchEvent: (event: ModuleEvent) => void;
};

export const ModuleViewContext = createContext<ModuleViewContextType | null>(null);

export const useModuleView = (): ModuleViewContextType => {

  const context: ModuleViewContextType | null = useContext(ModuleViewContext);

  if (context === null) {
    throw new Error("You must add a <ModuleViewProvider> into the React tree");
  }

  return context;
};
