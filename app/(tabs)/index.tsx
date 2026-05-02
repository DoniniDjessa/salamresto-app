import { ScrollView, View, StyleSheet } from 'react-native'
import { ScreenHeader } from '../../components/ScreenHeader'
import { SectionHeader } from '../../components/SectionHeader'
import { TaskCard } from '../../components/TaskCard'
import { StatCard } from '../../components/StatCard'
import { Card } from '../../components/Card'
import { BrandColors } from '../../constants/theme'
import { TrendingUp, Users, Utensils } from 'lucide-react-native'

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title="Tableau de Bord"
        subtitle="Bienvenue à Salamresto"
      />

      {/* Stats Row */}
      <View style={styles.statsGrid}>
        <StatCard
          icon={<Utensils size={24} color={BrandColors.primary} />}
          label="Commandes actives"
          value="8"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          icon={<Users size={24} color={BrandColors.primary} />}
          label="Tables occupées"
          value="12"
          subtitle="sur 20"
        />
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          icon={<TrendingUp size={24} color={BrandColors.primary} />}
          label="Chiffre du jour"
          value="2,450€"
          trend={{ value: 8, isPositive: true }}
        />
      </View>

      {/* Recent Tasks */}
      <SectionHeader
        title="Tâches récentes"
        onSeeAll={() => console.log('See all tasks')}
      />

      <View style={styles.tasksContainer}>
        <TaskCard
          title="Appel serveur"
          description="Le client demande l'aide"
          tableId="5"
          status="urgent"
          time="Maintenant"
          onPress={() => console.log('Task pressed')}
        />
        <TaskCard
          title="Commande à valider"
          description="Table 3 - 3 plats de salade"
          tableId="3"
          status="pending"
          time="Il y à 2 min"
          onPress={() => console.log('Task pressed')}
        />
        <TaskCard
          title="Addition demandée"
          description="Table 8 - Prête à payer"
          tableId="8"
          status="pending"
          time="Il y à 5 min"
          onPress={() => console.log('Task pressed')}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.bg,
  },
  statsGrid: {
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  tasksContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 12,
  },
})
