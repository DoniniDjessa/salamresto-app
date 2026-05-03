import { useState, useEffect } from 'react'
import { ScrollView, View, StyleSheet, ActivityIndicator, Text } from 'react-native'
import { ScreenHeader } from '../../components/ScreenHeader'
import { SectionHeader } from '../../components/SectionHeader'
import { TaskCard } from '../../components/TaskCard'
import { StatCard } from '../../components/StatCard'
import { BrandColors, FONTS } from '../../constants/theme'
import { TrendingUp, ShoppingBag, Truck, Activity } from 'lucide-react-native'
import { supabase } from '../../lib/supabase'

export default function HomeScreen() {
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [stats, setStats] = useState({ totalRevenue: 0, totalExpenses: 0, deliveryWaiting: 0, orderCount: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    const channel = supabase.channel('dashboard-updates')
      .on('postgres_changes', { event: '*', table: 'resto-orders', schema: 'public' }, () => {
        fetchDashboardData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchDashboardData() {
    const { data: orders } = await supabase
      .from('resto-orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    
    const { data: allOrders } = await supabase.from('resto-orders').select('total, type, status')
    const { data: expenses } = await supabase.from('resto-expenses').select('amount')
    
    if (orders) setRecentOrders(orders)
    
    let totalRev = 0
    let totalExp = 0
    let dWaiting = 0

    if (allOrders) {
      totalRev = allOrders.reduce((acc, o) => acc + (o.total || 0), 0)
      dWaiting = allOrders.filter(o => o.type === 'external' && o.status !== 'livre' && o.status !== 'annule').length
    }
    if (expenses) {
      totalExp = expenses.reduce((acc, e) => acc + (e.amount || 0), 0)
    }

    setStats({ 
      totalRevenue: totalRev, 
      totalExpenses: totalExp, 
      deliveryWaiting: dWaiting,
      orderCount: allOrders?.length || 0
    })
    setLoading(false)
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title="Tableau de Bord"
        subtitle="Bonjour, Chef Zack"
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={BrandColors.primary} size="large" />
        </View>
      ) : (
        <>
      {/* Main Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.mainStat}>
          <StatCard
            icon={<TrendingUp size={28} color={BrandColors.primary} />}
            label="Revenu Total"
            value={`${stats.totalRevenue.toLocaleString()} F`}
            trend={{ value: 12, isPositive: true }}
            color={BrandColors.primary}
          />
        </View>
        
        <View style={styles.secondaryStatsGrid}>
          <View style={styles.statItem}>
            <StatCard
              icon={<ShoppingBag size={22} color={BrandColors.success} />}
              label="Commandes"
              value={stats.orderCount.toString()}
              color={BrandColors.success}
              subtitle="Aujourd'hui"
            />
          </View>
          <View style={styles.statItem}>
            <StatCard
              icon={<Truck size={22} color={BrandColors.warning} />}
              label="Livraisons"
              value={stats.deliveryWaiting.toString()}
              color={BrandColors.warning}
              subtitle="En attente"
            />
          </View>
        </View>

        <View style={styles.mainStat}>
          <StatCard
            icon={<Activity size={24} color={BrandColors.danger} />}
            label="Dépenses du Jour"
            value={`${stats.totalExpenses.toLocaleString()} F`}
            color={BrandColors.danger}
          />
        </View>
      </View>

          {/* Recent Activity */}
          <SectionHeader
            title="Activité Récente"
            onSeeAll={() => console.log('See all')}
          />

          <View style={styles.tasksContainer}>
            {recentOrders.map(o => (
              <TaskCard
                key={o.id}
                title={o.type === 'salle' ? `Table ${o.tablenumber}` : o.customername || 'Commande Externe'}
                description={`${o.items?.length || 0} articles • ${o.total?.toLocaleString()} F`}
                status={o.status === 'en_attente' ? 'urgent' : o.status === 'en_preparation' ? 'pending' : 'completed'}
                time={new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                onPress={() => console.log('Task pressed')}
              />
            ))}
            {recentOrders.length === 0 && (
              <Text style={styles.emptyText}>Aucune activité récente</Text>
            )}
          </View>
        </>
      )}
      <View style={{ height: 100 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.bg,
  },
  center: {
    paddingVertical: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  mainStat: {
    width: '100%',
  },
  secondaryStatsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
  },
  tasksContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: BrandColors.textMuted,
    fontFamily: FONTS.medium,
    marginTop: 20,
  }
})
