import { useState, useEffect } from 'react'
import { ScrollView, View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, FlatList } from 'react-native'
import { ScreenHeader } from '../../components/ScreenHeader'
import { SectionHeader } from '../../components/SectionHeader'
import { TaskCard } from '../../components/TaskCard'
import { StatCard } from '../../components/StatCard'
import { BrandColors, FONTS, RADIUS } from '../../constants/theme'
import { TrendingUp, ShoppingBag, Truck, Activity, Wallet, Bell } from 'lucide-react-native'
import { supabase } from '../../lib/supabase'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'

export default function HomeScreen() {
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [stats, setStats] = useState({ totalRevenue: 0, totalExpenses: 0, deliveryWaiting: 0, orderCount: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day')

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
  }, [selectedPeriod])

  async function fetchDashboardData() {
    setLoading(true)
    const now = new Date()
    let startDate = new Date()
    
    if (selectedPeriod === 'day') startDate.setHours(0,0,0,0)
    else if (selectedPeriod === 'week') startDate.setDate(now.getDate() - 7)
    else if (selectedPeriod === 'month') startDate.setMonth(now.getMonth() - 1)

    const dateStr = startDate.toISOString()

    const { data: orders } = await supabase
      .from('resto-orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    
    const { data: allOrders } = await supabase
      .from('resto-orders')
      .select('total, type, status, created_at')
      .gte('created_at', dateStr)

    const { data: expenses } = await supabase
      .from('resto-expenses')
      .select('amount, date')
      .gte('date', dateStr)
    
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
        showBack={false}
        action={
          <TouchableOpacity style={styles.notificationBtn} onPress={() => router.push('/notifications')}>
            <Bell size={24} color={BrandColors.textPrimary} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        }
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={BrandColors.primary} size="large" />
        </View>
      ) : (
        <>
      {/* Big Yearly Summary Card */}
      <View style={styles.summaryCardContainer}>
        <LinearGradient
          colors={['#6366F1', '#8B5CF6', '#D946EF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryCard}
        >
          {/* Decorative Balls with Gradients */}
          <LinearGradient
            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.05)']}
            style={styles.ballOne}
          />
          <LinearGradient
            colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.01)']}
            style={styles.ballTwo}
          />
          
          <View style={styles.summaryContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <View style={styles.summaryIconBg}>
                <Wallet size={18} color="white" />
              </View>
              <Text style={styles.summaryLabel}>Chiffre d'Affaires Annuel</Text>
            </View>
            
            <View style={styles.amountContainer}>
              <Text style={styles.currency}>F</Text>
              <Text style={styles.summaryValue}>{stats.totalRevenue.toLocaleString()}</Text>
            </View>

            <View style={styles.summaryBadge}>
              <View style={styles.trendIconContainer}>
                <TrendingUp size={12} color="#10B981" />
              </View>
              <Text style={styles.summaryBadgeText}>+24.5% par rapport à 2025</Text>
            </View>
          </View>
          
          <View style={styles.summaryDecoration}>
             <Activity size={80} color="rgba(255,255,255,0.12)" />
          </View>
        </LinearGradient>
      </View>

      {/* Period Filter */}
      <View style={styles.filterContainer}>
        {['day', 'week', 'month'].map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.filterBtn, selectedPeriod === p && styles.filterBtnActive]}
            onPress={() => setSelectedPeriod(p as any)}
          >
            <Text style={[styles.filterBtnText, selectedPeriod === p && styles.filterBtnTextActive]}>
              {p === 'day' ? 'JOUR' : p === 'week' ? 'SEMAINE' : 'MOIS'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsGrid}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push('/finance')}>
          <StatCard
            label="Revenus"
            value={stats.totalRevenue.toLocaleString() + " F"}
            icon={<TrendingUp size={18} color={BrandColors.success} />}
            color={BrandColors.success}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push('/finance')}>
          <StatCard
            label="Dépenses"
            value={stats.totalExpenses.toLocaleString() + " F"}
            icon={<Wallet size={18} color={BrandColors.danger} />}
            color={BrandColors.danger}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.statsGrid, { marginTop: -8 }]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push('/enregistrements')}>
          <StatCard
            label="Commandes"
            value={stats.orderCount.toString()}
            icon={<ShoppingBag size={18} color="#8B5CF6" />}
            trend={{ value: 12, isPositive: true }}
            color="#8B5CF6"
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push('/delivery')}>
          <StatCard
            label="Livraisons"
            value={stats.deliveryWaiting.toString()}
            icon={<Truck size={18} color="#F59E0B" />}
            subtitle="En attente"
            color="#F59E0B"
          />
        </TouchableOpacity>
      </View>

      <SectionHeader title="Activités Récentes" />
      <View style={styles.tasksContainer}>
        {recentOrders.map((order) => (
          <TaskCard
            key={order.id}
            title={order.type === 'external' ? order.customername : `Table ${order.tablenumber}`}
            subtitle={`${order.items?.length || 0} articles • ${order.total.toLocaleString()} F`}
            status={order.status === 'en_attente' ? 'todo' : order.status === 'livre' ? 'done' : 'in_progress'}
            time={new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            onPress={() => router.push({ pathname: '/enregistrements', params: { orderId: order.id } })}
          />
        ))}
      </View>
      <View style={{ height: 100 }} />
      </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.bg,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  summaryCardContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  summaryCard: {
    borderRadius: RADIUS.xl,
    padding: 24,
    height: 180,
    overflow: 'hidden',
    position: 'relative',
    elevation: 8,
    shadowColor: BrandColors.primary,
    shadowOffset: { width: 0, shadowRadius: 15 },
    shadowOpacity: 0.3,
  },
  ballOne: {
    position: 'absolute',
    top: -40,
    right: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  ballTwo: {
    position: 'absolute',
    bottom: -50,
    left: -20,
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  summaryContent: {
    zIndex: 2,
  },
  summaryIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.5,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginVertical: 4,
  },
  currency: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: 'rgba(255,255,255,0.7)',
  },
  summaryValue: {
    fontSize: 38,
    fontFamily: FONTS.bold,
    color: 'white',
  },
  summaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    gap: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  trendIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: 'white',
  },
  summaryDecoration: {
    position: 'absolute',
    bottom: -10,
    right: -10,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 24,
  },
  tasksContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: BrandColors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BrandColors.borderLight,
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: BrandColors.card,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.lg,
    backgroundColor: BrandColors.card,
    borderWidth: 1,
    borderColor: BrandColors.borderLight,
  },
  filterBtnActive: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primary,
  },
  filterBtnText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: BrandColors.textSecondary,
  },
  filterBtnTextActive: {
    color: 'white',
  },
})
