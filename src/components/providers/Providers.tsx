"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ApiError, setUnauthorizedHandler } from "@/lib/api/client";
import { clearAuthToken } from "@/lib/auth-storage";
import { useAppDispatch } from "@/store/hooks";
import { AuthHydrator } from "./AuthHydrator";

function UnauthorizedListener({ queryClient }: { queryClient: QueryClient }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearAuthToken(dispatch);
      queryClient.clear();
      if (pathname !== "/login" && pathname !== "/register") router.push("/login");
    });
  }, [dispatch, queryClient, router, pathname]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            retry: (failureCount, error) => {
              if (error instanceof ApiError && error.status >= 400 && error.status < 500)
                return false;
              return failureCount < 3;
            },
          },
        },
      })
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthHydrator />
        <UnauthorizedListener queryClient={queryClient} />
        {children}
      </QueryClientProvider>
    </Provider>
  );
}
