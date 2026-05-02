import { ScrollView, View, StyleSheet, Text } from 'react-native'
import { Activity, Users, ShoppingBag, Clock } from 'lucide-react-native'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'
import { ScreenHeader } from '../components/ScreenHeader'
import { StatCard } from '../components/StatCard'
import { Card } from '../components/Card'

export default function AnalyticsScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Analyses Live"
        subtitle="Performances et insights prédictifs"
      />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <StatCard
            icon={<Users size={24} color={BrandColors.primary} />}
            label="Clients aujourd'hui"
            value="142"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            icon={<ShoppingBag size={24} color={BrandColors.primary} />}
            label="Tickets moyens"
            value="5,400 F"
            trend={{ value: 5, isPositive: true }}
          />
        </View>

        <View style={styles.metricsGrid}>
          <StatCard
            icon={<Clock size={24} color={BrandColors.primary} />}
            label="Temps service moyen"
            value="18 min"
            subtitle="vs 20 min hier"
          />
        </View>

        {/* Attendance Chart */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Fréquentation par Heure</Text>
          <Card variant="elevated" padding={16}>
            <View style={styles.attendanceList}>
              {[
                { time: '9h-11h', count: 20 },
                { time: '11h-13h', count: 85 },
                { time: '13h-15h', count: 45 },
                { time: '15h-17h', count: 30 },
                { time: '17h-19h', count: 95 },
                { time: '19h-21h', count: 110 },
              ].map((slot, i) => (
                <View key={i} style={styles.attendanceItem}>
                  <Text style={styles.attendanceTime}>{slot.time}</Text>
                  <View style={styles.attendanceBar}>
                    <View
                      style={[
                        styles.attendanceBarFill,
                        { width: `${(slot.count / 110) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.attendanceCount}>{slot.count}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Popular Items */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Plats Populaires</Text>
          <Card variant="elevated" padding={16}>
            <View style={styles.itemsList}>
              {[
                { name: 'Couscous Merguez', sales: 34 },
                { name: 'Salade Chef', sales: 28 },
                { name: 'Pâtes Carbonara', sales: 26 },
                { name: 'Burger Premium', sales: 22 },
              ].map((item, i) => (
                <View key={i} style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.itemBar}>
                    <View
                      style={[
                        styles.itemBarFill,
                        { width: `${(item.sales / 34) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.itemSales}>{item.sales}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Performance Insights */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <Card variant="elevated" padding={16}>
            <View style={styles.insightsList}>
              <InsightItem
                title="Heure de pointe"
                description="19h-21h avec 110 clients"
                color={BrandColors.primary}
              />
              <InsightItem
                title="Plat du jour"
                description="Couscous Merguez en tête avec 34 ventes"
                color={BrandColors.success}
              />
              <InsightItem
                title="Ticket moyen"
                description="5,400 F (+5% vs hier)"
                color={BrandColors.warning}
              />
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  )
}

function InsightItem({ title, description, color }: any) {
  return (
    <View style={styles.insightItem}>
      <View style={[styles.insightIcon, { backgroundColor: `${color}20` }]}>
        <View style={[styles.insightDot, { backgroundColor: color }]} />
      </View>
      <View style={styles.insightText}>
        <Text style={styles.insightTitle}>{title}</Text>
        <Text style={styles.insightDescription}>{description}</Text>
      </View>
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
  metricsGrid: {
    paddingHorizontal: 16,
    marginBottom: 16,
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
    gap: 16,
  },
  attendanceItem: {
    gap: 8,
  },
  attendanceTime: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: BrandColors.textSecondary,
  },
  attendanceBar: {
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  attendanceBarFill: {
    height: '100%',
    backgroundColor: BrandColors.primary,
    borderRadius: RADIUS.md,
  },
  attendanceCount: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
    textAlign: 'right',
  },
  itemsList: {
    gap: 16,
  },
  itemRow: {
    gap: 8,
  },
  itemName: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: BrandColors.textSecondary,
  },
  itemBar: {
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  itemBarFill: {
    height: '100%',
    backgroundColor: BrandColors.primary,
    borderRadius: RADIUS.md,
  },
  itemSales: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
    textAlign: 'right',
  },
  insightsList: {
    gap: 12,
    paddingBottom: 100,
  },
  insightItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
  },
  insightIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  insightText: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  insightTitle: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
  },
  insightDescription: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: BrandColors.textSecondary,
  },
})
                    <Text color={BrandColors.textSecondary} fsz={11}>Tendance sur 7 jours</Text>
                 </YStack>
                 <Activity size={22} color={BrandColors.primary} />
              </XStack>
              <XStack gap="$3" ai="flex-end" height={80}>
                 {[30, 60, 45, 95, 70, 85, 40].map((h, i) => (
                    <View key={i} flex={1} bg={i === 3 ? BrandColors.primary : 'rgba(139, 92, 246, 0.2)'} height={`${h}%`} br={4} />
                 ))}
              </XStack>
           </Card>

           {/* Top Selling Products */}
           <YStack gap="$4">
              <Text color="white" fsz={18} fow="900">Meilleures Ventes</Text>
              {[
                 { name: 'Thieboudienne Poisson', sales: 142, trend: '+12%' },
                 { name: 'Dibi Agneau', sales: 98, trend: '+5%' },
                 { name: 'Yassa Poulet', sales: 76, trend: '-2%' }
              ].map((item, i) => (
                 <XStack key={i} jc="space-between" ai="center" p="$4" bg={BrandColors.card} br={22} bw={1} bc="rgba(255,255,255,0.03)">
                    <XStack gap="$4" ai="center">
                       <Circle size={45} bg="rgba(255, 255, 255, 0.03)">
                          <Text fsz={22}>🥘</Text>
                       </Circle>
                       <YStack>
                          <Text color="white" fow="800" fsz={15}>{item.name}</Text>
                          <Text color={BrandColors.textSecondary} fsz={11}>{item.sales} ventes ce mois</Text>
                       </YStack>
                    </XStack>
                    <Text color={item.trend.startsWith('+') ? BrandColors.success : BrandColors.danger} fow="900" fsz={12}>{item.trend}</Text>
                 </XStack>
              ))}
           </YStack>

           {/* AI Insight Card */}
           <Card p="$6" bg={BrandColors.primary} br={28} mt="$4" elevate shadowColor={BrandColors.primary} shadowOpacity={0.3}>
              <XStack gap="$4" ai="center">
                 <View bg="rgba(255,255,255,0.2)" p="$3" br={16}>
                    <Zap size={26} color="white" />
                 </View>
                 <YStack f={1} gap="$1">
                    <Text color="white" fow="900" fsz={16}>Conseil RestoFlow</Text>
                    <Text color="rgba(255,255,255,0.8)" fsz={12} lineHeight={18}>
                       Les ventes augmentent de 25% les vendredis. Envisagez une promotion sur les boissons pour maximiser le profit.
                    </Text>
                 </YStack>
              </XStack>
           </Card>
        </YStack>
      </ScrollView>
    </View>
  )
}
