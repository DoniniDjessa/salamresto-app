import { ScrollView, View, StyleSheet, Text } from 'react-native'
import { TrendingUp, BarChart3, ShoppingBag, Truck } from 'lucide-react-native'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'
import { ScreenHeader } from '../components/ScreenHeader'
import { StatCard } from '../components/StatCard'
import { Card } from '../components/Card'

const revenueChannels = [
  { icon: ShoppingBag, label: 'En salle', value: '320K F', percentage: 45 },
  { icon: Truck, label: 'Livraison', value: '185K F', percentage: 25 },
  { icon: BarChart3, label: 'Commande en ligne', value: '225K F', percentage: 30 },
]

export default function RevenuesScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Encaissements"
        subtitle="Détail des revenus par canal"
      />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
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
                        { width: `${channel.percentage * 2}%` },
                      ]}
                    />
                  </View>
                </Card>
              )
            })}
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
                    <View style={[styles.hourlyFill, { width: `${(i + 1) * 13}%` }]} />
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
  statsGrid: {
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
  channelList: {
    gap: 12,
    paddingBottom: 100,
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
           <Card f={1} p="$5" bg={BrandColors.primary} br={24} elevate shadowColor={BrandColors.primary} shadowOpacity={0.2}>
              <Text color="rgba(255,255,255,0.8)" fow="800" fsz={10} mb="$1" ls={1}>LIVRAISON</Text>
              <Text color="white" fsz={22} fow="900">130K F</Text>
           </Card>
        </XStack>

        <YStack gap="$5">
           <XStack jc="space-between" ai="center">
              <Text color="white" fsz={18} fow="900">Journal des Ventes</Text>
              <Button circular size="$3" bg={BrandColors.card} icon={Filter} />
           </XStack>

           {[
             { id: '5542', type: 'Salle', amount: '12,500 F', time: '14:32' },
             { id: '5543', type: 'Web', amount: '18,000 F', time: '15:10' },
             { id: '5544', type: 'Salle', amount: '25,500 F', time: '15:45' },
             { id: '5545', type: 'App', amount: '8,000 F', time: '16:05' }
           ].map((sale, i) => (
              <XStack key={i} jc="space-between" ai="center" p="$4" bg={BrandColors.card} br={22} bw={1} bc="rgba(255,255,255,0.03)">
                 <XStack gap="$3" ai="center">
                    <View bg="rgba(16, 185, 129, 0.1)" p="$3" br={14}>
                       <BarChart3 size={20} color={BrandColors.success} />
                    </View>
                    <YStack>
                       <Text color="white" fow="800" fsz={15}>Commande #{sale.id}</Text>
                       <Text color={BrandColors.textSecondary} fsz={11}>{sale.type} • {sale.time}</Text>
                    </YStack>
                 </XStack>
                 <Text color="white" fow="900" fsz={15}>{sale.amount}</Text>
              </XStack>
           ))}
        </YStack>
      </ScrollView>
    </View>
  )
}
