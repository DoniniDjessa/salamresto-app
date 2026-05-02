import { View, Text, StyleSheet } from 'react-native'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'

interface ScreenHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function ScreenHeader({ title, subtitle, action }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {action && <View style={styles.action}>{action}</View>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BrandColors.bg,
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: BrandColors.textSecondary,
  },
  action: {
    marginLeft: 12,
  },
})
