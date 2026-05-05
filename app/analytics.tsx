import { useState, useEffect } from 'react'
import { ScrollView, View, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import { TrendingUp, ShoppingBag, Truck, Activity, Zap, Filter, Calendar } from 'lucide-react-native'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'
import { ScreenHeader } from '../components/ScreenHeader'
import { StatCard } from '../components/StatCard'
import { Card } from '../components/Card'
import { supabase } from '../lib/supabase'

export default function AnalyticsScreen() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalRevenue: 0, totalExpenses: 0, deliveryWaiting: 0, orderCount: 0 })
  const [selectedPeriod, setSelectedPeriod] = useState('Aujourd\'hui')

  useEffect(() => {
    fetchAnalyticsData()
    const channel = supabase.channel('analytics-updates')
      .on('postgres_changes', { event: '*', table: 'resto-orders', schema: 'public' }, () => {
        fetchAnalyticsData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedPeriod])

  async function fetchAnalyticsData() {
    setLoading(true)
    const { data: allOrders } = await supabase.from('resto-orders').select('total, type, status')
    const { data: expenses } = await supabase.from('resto-expenses').select('amount')
    
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

  const attendanceData = [
    { time: '11h-12h', count: 12 },
    { time: '12h-13h', count: 45 },
    { time: '13h-14h', count: 38 },
    { time: '14h-15h', count: 15 },
  ]

  const topItems = [
    { name: 'Thieboudienne Poisson', sales: 142, trend: '+12%' },
    { name: 'Dibi Agneau', sales: 98, trend: '+5%' },
    { name: 'Yassa Poulet', sales: 76, trend: '-2%' },
  ]

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Analyses"
        subtitle="Performance & Croissance"
      />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        {/* Filters Section */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {['Aujourd\'hui', 'Hier', '7 Jours', '30 Jours', 'Personnalisé'].map((period) => (
              <TouchableOpacity 
                key={period} 
                style={[styles.filterChip, selectedPeriod === period && styles.activeFilterChip]}
                onPress={() => setSelectedPeriod(period)}
              >
                {period === 'Personnalisé' && <Calendar size={14} color={selectedPeriod === period ? 'white' : BrandColors.textSecondary} style={{ marginRight: 6 }} />}
                <Text style={[styles.filterText, selectedPeriod === period && styles.activeFilterText]}>{period}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.moreFilterBtn}>
             <Filter size={20} color={BrandColors.primary} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={BrandColors.primary} size="large" />
          </View>
        ) : (
          <>
            {/* Summary Cards (From Home) */}
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
                  />
                </View>
                <View style={styles.statItem}>
                  <StatCard
                    icon={<Truck size={22} color={BrandColors.warning} />}
                    label="Livraisons"
                    value={stats.deliveryWaiting.toString()}
                    color={BrandColors.warning}
                  />
                </View>
              </View>

              <View style={styles.mainStat}>
                <StatCard
                  icon={<Activity size={24} color={BrandColors.danger} />}
                  label="Dépenses Totales"
                  value={`${stats.totalExpenses.toLocaleString()} F`}
                  color={BrandColors.danger}
                />
              </View>
            </View>

            {/* Attendance Chart */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Affluence par Heure</Text>
              <Card variant="elevated" padding={16}>
                <View style={styles.attendanceList}>
                  {attendanceData.map((item, i) => (
                    <View key={i} style={styles.attendanceItem}>
                      <Text style={styles.attendanceTime}>{item.time}</Text>
                      <View style={styles.attendanceBar}>
                        <View style={[styles.attendanceBarFill, { width: `${(item.count / 50) * 100}%` }]} />
                      </View>
                      <Text style={styles.attendanceCount}>{item.count} clients</Text>
                    </View>
                  ))}
                </View>
              </Card>
            </View>

            {/* Top Selling Products */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Meilleures Ventes</Text>
              <View style={styles.itemsList}>
                {topItems.map((item, i) => (
                  <Card key={i} variant="elevated" padding={16} style={styles.itemRow}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemIcon}>
                        <Text style={{ fontSize: 20 }}>🥘</Text>
                      </View>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemSalesCount}>{item.sales} ventes</Text>
                      </View>
                      <Text style={[styles.itemTrend, { color: item.trend.startsWith('+') ? BrandColors.success : BrandColors.danger }]}>
                        {item.trend}
                      </Text>
                    </View>
                  </Card>
                ))}
              </View>
            </View>

            {/* AI Insight Card */}
            <View style={styles.sectionContainer}>
              <Card variant="elevated" padding={20} style={styles.insightCard}>
                <View style={styles.insightContent}>
                  <View style={styles.insightIconContainer}>
                    <Zap size={24} color="white" />
                  </View>
                  <View style={styles.insightTextContainer}>
                    <Text style={styles.insightTitle}>Conseil RestoFlow AI</Text>
                    <Text style={styles.insightDescription}>
                      Basé sur vos {selectedPeriod.toLowerCase()}, nous recommandons d'augmenter le stock de "Thieboudienne" pour demain.
                    </Text>
                  </View>
                </View>
              </Card>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  center: {
    paddingVertical: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  filterScroll: {
    gap: 8,
    paddingRight: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderWidth: 1,
    borderColor: BrandColors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeFilterChip: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primary,
  },
  filterText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: BrandColors.textSecondary,
  },
  activeFilterText: {
    color: 'white',
    fontFamily: FONTS.bold,
  },
  moreFilterBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
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
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
    marginBottom: 12,
  },
  attendanceList: {
    gap: 12,
  },
  attendanceItem: {
    gap: 6,
  },
  attendanceTime: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: BrandColors.textSecondary,
  },
  attendanceBar: {
    height: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  attendanceBarFill: {
    height: '100%',
    backgroundColor: BrandColors.primary,
    borderRadius: RADIUS.full,
  },
  attendanceCount: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: BrandColors.textPrimary,
    textAlign: 'right',
  },
  itemsList: {
    gap: 12,
  },
  itemRow: {
    marginBottom: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
  },
  itemSalesCount: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: BrandColors.textSecondary,
  },
  itemTrend: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  insightCard: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primary,
  },
  insightContent: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  insightIconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightTextContainer: {
    flex: 1,
    gap: 4,
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
  },
  insightDescription: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
})
