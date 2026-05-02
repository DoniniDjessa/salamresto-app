import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { BrandColors, FONTS } from '../constants/theme'
import { ChevronRight } from 'lucide-react-native'

interface SectionHeaderProps {
  title: string
  onSeeAll?: () => void
}

export function SectionHeader({ title, onSeeAll }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} style={styles.seeAll}>
          <Text style={styles.seeAllText}>Voir plus</Text>
          <ChevronRight size={16} color={BrandColors.primary} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: BrandColors.primary,
  },
})
