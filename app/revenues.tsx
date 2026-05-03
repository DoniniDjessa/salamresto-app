import { ScrollView, View, StyleSheet, Text, FlatList } from 'react-native'
import { TrendingUp, BarChart3, ShoppingBag, Truck, Filter } from 'lucide-react-native'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'
import { ScreenHeader } from '../components/ScreenHeader'
import { StatCard } from '../components/StatCard'
import { Card } from '../components/Card'

const revenueChannels = [
  { icon: ShoppingBag, label: 'En salle', value: '320K F', percentage: 45 },
  { icon: Truck, label: 'Livraison', value: '185K F', percentage: 25 },
  { icon: BarChart3, label: 'Commande en ligne', value: '225K F', percentage: 30 },
]

const recentSales = [
  { id: '5542', type: 'Salle', amount: '12,500 F', time: '14:32' },
  { id: '5543', type: 'Web', amount: '18,000 F', time: '15:10' },
  { id: '5544', type: 'Salle', amount: '25,500 F', time: '15:45' },
  { id: '5545', type: 'App', amount: '8,000 F', time: '16:05' }
]

export default function RevenuesScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Encaissements"
        subtitle="Détail des revenus par canal"
      />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsGrid}>
          <StatCard
            icon={<TrendingUp size={24} color={BrandColors.primary} />}
            label="Revenu Total Jour"
            value="730K F"
            trend={{ value: 15, isPositive: true }}
          />
        </View>

        {/* Revenue by Channel */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Revenus par Canal</Text>
          <View style={styles.channelList}>
            {revenueChannels.map((channel, index) => {
              const Icon = channel.icon
              return (
                <Card key={index} variant="elevated" padding={16}>
                  <View style={styles.channelHeader}>
                    <View style={styles.channelIcon}>
                      <Icon size={20} color={BrandColors.primary} />
                    </View>
                    <View style={styles.channelInfo}>
                      <Text style={styles.channelLabel}>{channel.label}</Text>
                      <Text style={styles.channelValue}>{channel.value}</Text>
                    </View>
                    <Text style={styles.channelPercent}>{channel.percentage}%</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${channel.percentage}%` },
                      ]}
                    />
                  </View>
                </Card>
              )
            })}
          </View>
        </View>

        {/* Recent Sales Journal */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Journal des Ventes</Text>
            <Filter size={18} color={BrandColors.textSecondary} />
          </View>
          <View style={styles.salesList}>
            {recentSales.map((sale, i) => (
              <Card key={i} variant="default" padding={12} style={styles.saleCard}>
                <View style={styles.saleContent}>
                  <View style={styles.saleIconContainer}>
                    <BarChart3 size={18} color={BrandColors.success} />
                  </View>
                  <View style={styles.saleInfo}>
                    <Text style={styles.saleTitle}>Commande #{sale.id}</Text>
                    <Text style={styles.saleSub}>{sale.type} • {sale.time}</Text>
                  </View>
                  <Text style={styles.saleAmount}>{sale.amount}</Text>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Hourly Breakdown */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Revenus par Heure</Text>
          <Card variant="elevated" padding={16}>
            <View style={styles.hourlyList}>
              {['9h-11h', '11h-13h', '13h-15h', '15h-17h', '17h-19h', '19h-21h'].map((time, i) => (
                <View key={i} style={styles.hourlyItem}>
                  <Text style={styles.hourlyTime}>{time}</Text>
                  <View style={styles.hourlyBar}>
                    <View style={[styles.hourlyFill, { width: `${(i + 1) * 15}%` }]} />
                  </View>
                  <Text style={styles.hourlyAmount}>{50 + i * 20}K F</Text>
                </View>
              ))}
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
  statsGrid: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
  },
  channelList: {
    gap: 12,
  },
  channelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  channelIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelInfo: {
    flex: 1,
  },
  channelLabel: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: BrandColors.textSecondary,
    marginBottom: 4,
  },
  channelValue: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
  },
  channelPercent: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: BrandColors.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: BrandColors.primary,
    borderRadius: RADIUS.full,
  },
  salesList: {
    gap: 10,
  },
  saleCard: {
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
  saleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  saleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saleInfo: {
    flex: 1,
  },
  saleTitle: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
  },
  saleSub: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: BrandColors.textSecondary,
  },
  saleAmount: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
  },
  hourlyList: {
    gap: 12,
  },
  hourlyItem: {
    gap: 8,
  },
  hourlyTime: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: BrandColors.textSecondary,
  },
  hourlyBar: {
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  hourlyFill: {
    height: '100%',
    backgroundColor: BrandColors.primary,
    borderRadius: RADIUS.md,
  },
  hourlyAmount: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
  },
})
