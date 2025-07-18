"use client";

import { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface Props {
  children: ReactNode;
  attribute?: "class" | "data-theme";
}

export function ThemeProvider({ children, attribute = "class" }: Props) {
  return (
    <NextThemesProvider attribute={attribute} defaultTheme="light" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
