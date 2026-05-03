import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { BrandColors, FONTS } from '../constants/theme'
import { Menu } from 'lucide-react-native'
import { useNavigation } from 'expo-router'
import { DrawerNavigationProp } from '@react-navigation/drawer'

interface ScreenHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  showMenu?: boolean
}

export function ScreenHeader({ title, subtitle, action, showMenu = true }: ScreenHeaderProps) {
  const navigation = useNavigation<DrawerNavigationProp<any>>()

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showMenu && (
          <TouchableOpacity 
            onPress={() => navigation.openDrawer()}
            style={styles.menuButton}
          >
            <Menu color={BrandColors.textPrimary} size={24} />
          </TouchableOpacity>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
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
    paddingTop: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: BrandColors.textSecondary,
  },
  action: {
    marginLeft: 12,
  },
})
