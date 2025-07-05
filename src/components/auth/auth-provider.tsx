"use client";

import { createContext, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import type { User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AppLayout } from "@/components/shared/app-layout";
import { Loader2 } from "lucide-react";
import { ThemeProvider } from "next-themes";

type AuthContextType = {
  user: User | null | undefined;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    if (!loading) {
      if (!user && !isAuthPage) {
        router.push("/login");
      }
      if (user && isAuthPage) {
        router.push("/");
      }
    }
  }, [user, loading, isAuthPage, router, pathname]);

  const value = { user, loading };

  return (
    <AuthContext.Provider value={value}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : isAuthPage || !user ? (
          children
        ) : (
          <AppLayout>{children}</AppLayout>
        )}
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
