import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Card } from './Card'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'
import { Clock, AlertCircle } from 'lucide-react-native'

interface TaskCardProps {
  title: string
  description?: string
  tableId?: string
  status: 'pending' | 'urgent' | 'completed'
  time?: string
  onPress?: () => void
  action?: React.ReactNode
}

export function TaskCard({
  title,
  description,
  tableId,
  status,
  time,
  onPress,
  action,
}: TaskCardProps) {
  const statusColor =
    status === 'urgent'
      ? BrandColors.danger
      : status === 'pending'
        ? BrandColors.warning
        : BrandColors.success

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card variant="elevated" padding={16}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{title}</Text>
            {tableId && <Text style={styles.tableId}>Table {tableId}</Text>}
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {status === 'urgent' ? 'Urgent' : status === 'pending' ? 'En attente' : 'Complété'}
            </Text>
          </View>
        </View>

        {description && <Text style={styles.description}>{description}</Text>}

        <View style={styles.footer}>
          {time && (
            <View style={styles.timeRow}>
              <Clock size={14} color={BrandColors.textSecondary} />
              <Text style={styles.timeText}>{time}</Text>
            </View>
          )}
          {action && <View>{action}</View>}
        </View>
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
    marginBottom: 4,
  },
  tableId: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: BrandColors.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
  },
  statusText: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
  },
  description: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: BrandColors.textSecondary,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: BrandColors.textSecondary,
  },
})
