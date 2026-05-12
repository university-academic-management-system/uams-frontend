"use client"

import { ChakraProvider,createSystem,defaultConfig,defaultSystem, defineConfig } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"


const config = defineConfig({
  preflight: false,
})

const system = createSystem(defaultConfig, config)


export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider forcedTheme="light" {...props} />
    </ChakraProvider>
  )
}
