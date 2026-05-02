import { View, Text, StyleSheet } from 'react-native'
import { Card } from './Card'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'

interface StatCardProps {
  icon?: React.ReactNode
  label: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: string
}

export function StatCard({
  icon,
  label,
  value,
  subtitle,
  trend,
  color = BrandColors.primary,
}: StatCardProps) {
  return (
    <Card variant="elevated" padding={16}>
      <View style={styles.container}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
            {icon}
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.valueRow}>
            <Text style={styles.value}>{value}</Text>
            {trend && (
              <Text
                style={[
                  styles.trend,
                  { color: trend.isPositive ? BrandColors.success : BrandColors.danger },
                ]}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </Text>
            )}
          </View>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: BrandColors.textSecondary,
    marginBottom: 6,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
  },
  trend: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: BrandColors.textMuted,
  },
})
