import { createContext } from "react";

import { Vault } from "@jones-dao/sdk";

export const VaultContext = createContext<
  Partial<Vault> & { loading: boolean; userDataLoading: boolean }
>({
  loading: false,
  userDataLoading: false,
});
