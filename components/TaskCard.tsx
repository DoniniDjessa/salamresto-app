import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Card } from './Card'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'
import { Clock, AlertCircle } from 'lucide-react-native'

interface TaskCardProps {
  title: string
  subtitle?: string
  status: 'todo' | 'in_progress' | 'done' | 'urgent' | 'pending' | 'completed'
  time?: string
  onPress?: () => void
  action?: React.ReactNode
}

export function TaskCard({
  title,
  subtitle,
  status,
  time,
  onPress,
  action,
}: TaskCardProps) {
  const getStatusInfo = () => {
    switch(status) {
      case 'urgent': return { color: BrandColors.danger, label: 'Urgent' }
      case 'todo': 
      case 'pending': return { color: BrandColors.warning, label: 'En attente' }
      case 'in_progress': return { color: BrandColors.primary, label: 'En cours' }
      case 'done':
      case 'completed': return { color: BrandColors.success, label: 'Terminé' }
      default: return { color: BrandColors.textSecondary, label: status }
    }
  }

  const { color, label } = getStatusInfo()

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card variant="default" padding={16} style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${color}15` }]}>
            <Text style={[styles.statusText, { color }]}>{label}</Text>
          </View>
        </View>

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
  card: {
    marginBottom: 4,
    borderColor: BrandColors.borderLight,
    backgroundColor: BrandColors.card,
  },
  title: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: BrandColors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.md,
  },
  statusText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: BrandColors.textMuted,
  },
})
