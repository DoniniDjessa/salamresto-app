import { View, ViewProps, StyleSheet } from 'react-native'
import { BrandColors, RADIUS } from '../constants/theme'

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: number
}

export function Card({ 
  style, 
  variant = 'default', 
  padding = 16,
  children,
  ...props 
}: CardProps) {
  return (
    <View
      style={[
        styles.card,
        styles[variant],
        { padding },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  default: {
    backgroundColor: BrandColors.card,
    borderWidth: 1,
    borderColor: BrandColors.borderLight,
  },
  elevated: {
    backgroundColor: BrandColors.card,
    borderWidth: 1,
    borderColor: BrandColors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: BrandColors.border,
  },
})
