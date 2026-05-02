import { TamaguiProvider, Theme } from 'tamagui'
import config from '../tamagui.config'
import { BrandColors } from '../constants/theme'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      <Theme name="dark">
        {children}
      </Theme>
    </TamaguiProvider>
  )
}
