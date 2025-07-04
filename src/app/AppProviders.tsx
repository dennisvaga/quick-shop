import { QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { queryClient } from "~/lib/queryClient";

const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default AppProviders;
