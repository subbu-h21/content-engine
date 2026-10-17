/** Props reach components through context so scene code stays about content, not plumbing. */
import React, { createContext, useContext } from "react";
import type { ReelProps } from "./schema";

const Ctx = createContext<ReelProps | null>(null);

export const ReelProvider: React.FC<{ value: ReelProps; children: React.ReactNode }> = ({ value, children }) => (
  <Ctx.Provider value={value}>{children}</Ctx.Provider>
);

export const useReel = (): ReelProps => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useReel outside ReelProvider");
  return v;
};

export const db = (x: number): number => Math.pow(10, x / 20);
