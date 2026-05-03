import { ScrollView, View, StyleSheet, Text } from 'react-native'
import { Activity, BarChart2, Users, ShoppingBag, Zap, Circle } from 'lucide-react-native'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'
import { ScreenHeader } from '../components/ScreenHeader'
import { StatCard } from '../components/StatCard'
import { Card } from '../components/Card'

export default function AnalyticsScreen() {
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
        title="Analyses & Performance"
        subtitle="Suivez la croissance de votre restaurant"
      />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.metricsGrid}>
          <StatCard
            icon={<Users size={24} color={BrandColors.primary} />}
            label="Clients (Aujourd'hui)"
            value="124"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            icon={<ShoppingBag size={24} color={BrandColors.primary} />}
            label="Panier Moyen"
            value="8,500 F"
            trend={{ value: 2.4, isPositive: true }}
          />
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
                    <Text style={styles.itemSalesCount}>{item.sales} ventes ce mois</Text>
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
                  Les ventes augmentent de 25% les vendredis. Envisagez une promotion sur les boissons pour maximiser le profit.
                </Text>
              </View>
            </View>
          </Card>
        </View>
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
  metricsGrid: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
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
