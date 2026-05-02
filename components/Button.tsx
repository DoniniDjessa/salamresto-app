import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ViewStyle } from 'react-native'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  label: string
  icon?: React.ReactNode
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  label,
  icon,
  fullWidth = false,
  style,
  ...props
}: ButtonProps) {
  const sizeStyles = getSizeStyle(size)
  const variantStyles = getVariantStyle(variant)

  return (
    <TouchableOpacity
      style={[
        styles.base,
        sizeStyles,
        variantStyles,
        fullWidth && { width: '100%' },
        style,
      ]}
      activeOpacity={0.8}
      {...props}
    >
      {icon && icon}
      <Text style={[styles.text, sizeStyles.text, variantStyles.text]}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

function getSizeStyle(size: 'sm' | 'md' | 'lg'): any {
  switch (size) {
    case 'sm':
      return { paddingVertical: 8, paddingHorizontal: 12, text: { fontSize: 12 } }
    case 'md':
      return { paddingVertical: 12, paddingHorizontal: 16, text: { fontSize: 14 } }
    case 'lg':
      return { paddingVertical: 16, paddingHorizontal: 20, text: { fontSize: 16 } }
  }
}

function getVariantStyle(variant: 'primary' | 'secondary' | 'danger' | 'ghost'): any {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: BrandColors.primary,
        text: { color: '#FFFFFF', fontFamily: FONTS.bold },
      }
    case 'secondary':
      return {
        backgroundColor: BrandColors.card,
        borderWidth: 1,
        borderColor: BrandColors.border,
        text: { color: BrandColors.textPrimary, fontFamily: FONTS.semiBold },
      }
    case 'danger':
      return {
        backgroundColor: BrandColors.danger,
        text: { color: '#FFFFFF', fontFamily: FONTS.bold },
      }
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        text: { color: BrandColors.primary, fontFamily: FONTS.semiBold },
      }
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontFamily: FONTS.bold,
  },
})
