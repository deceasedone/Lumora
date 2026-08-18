"use client"

import { ReactNode } from "react"
import { JotaiInitializer } from "@/context/initializer"
import { Provider as JotaiProvider } from "jotai"
import { ReactLenis } from "lenis/react"
import { ThemeProvider } from "@/components/theme-provider"
import { ShimejiProvider } from "@/components/shimeji/ShimejiSpec"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <JotaiProvider>
      <ThemeProvider attribute="data-theme" defaultTheme="dark">
        <ReactLenis root />
        <JotaiInitializer />
        <ShimejiProvider
          specsUrl="/specs/shimeji-specs.json"
          sheetOverrides={{
            "vocaloid-hatsune-miku": "/sprites/miku.png",
            "vocaloid-ia": "/sprites/ia.png",
          }}
        >
          {children}
        </ShimejiProvider>
      </ThemeProvider>
    </JotaiProvider>
  )
}
