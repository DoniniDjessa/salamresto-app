import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { ScreenHeader } from '../components/ScreenHeader'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'
import { Users, Wallet, PieChart, ChevronRight } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { Card } from '../components/Card'

export default function GestionScreen() {
  const router = useRouter()

  const sections = [
    {
      title: 'Équipe',
      description: 'Gérer le personnel et les accès',
      icon: Users,
      route: '/profiles',
      color: '#6366F1' // Indigo
    },
    {
      title: 'Comptabilité',
      description: 'Bilans et clôtures de caisse',
      icon: Wallet,
      route: '/accounting',
      color: '#F43F5E' // Rose
    },
    {
      title: 'Analyses',
      description: 'Statistiques et rapports de performance',
      icon: PieChart,
      route: '/analytics',
      color: '#10B981' // Emerald
    }
  ]

  return (
    <View style={styles.container}>
      <ScreenHeader 
        title="Gestion" 
        subtitle="Outils d'administration" 
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>ADMINISTRATION</Text>
        
        {sections.map((item, index) => {
          const Icon = item.icon
          return (
            <TouchableOpacity 
              key={index}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <Card variant="elevated" padding={16} style={styles.menuItem}>
                <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                  <Icon size={24} color={item.color} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                </View>
                <ChevronRight size={20} color={BrandColors.textMuted} />
              </Card>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.bg,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: BrandColors.textMuted,
    marginBottom: 8,
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: BrandColors.textSecondary,
  }
})
