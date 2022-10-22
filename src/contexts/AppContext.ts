import React from "react";

export const AppContext = React.createContext<AppContext>({
  step: 0,
  setStep: () => {},
  setTransactionId: () => {},
  transactionId: undefined,
  setCategoryId: () => {},
  categoryId: undefined
});