import { useState, useEffect } from 'react'
import { ScrollView, View, StyleSheet, Text, FlatList, ActivityIndicator } from 'react-native'
import { TrendingUp, BarChart3, ShoppingBag, Truck, Filter } from 'lucide-react-native'
import { BrandColors, FONTS, RADIUS } from '../../constants/theme'
import { ScreenHeader } from '../../components/ScreenHeader'
import { StatCard } from '../../components/StatCard'
import { Card } from '../../components/Card'
import { supabase } from '../../lib/supabase'

export default function RevenuesScreen() {
  const [loading, setLoading] = useState(true)
  const [revenues, setRevenues] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, byChannel: { salle: 0, livraison: 0, web: 0 } })

  useEffect(() => {
    fetchRevenues()
  }, [])

  async function fetchRevenues() {
    const { data } = await supabase
      .from('resto-orders')
      .select('*')
      .eq('status', 'paye')
      .order('created_at', { ascending: false })

    if (data) {
      setRevenues(data)
      const total = data.reduce((acc, o) => acc + (o.total || 0), 0)
      const salle = data.filter(o => o.type === 'salle').reduce((acc, o) => acc + (o.total || 0), 0)
      const livraison = data.filter(o => o.type === 'external').reduce((acc, o) => acc + (o.total || 0), 0)
      
      setStats({
        total,
        byChannel: {
          salle,
          livraison,
          web: 0 // For now
        }
      })
    }
    setLoading(false)
  }

  const revenueChannels = [
    { icon: ShoppingBag, label: 'En salle', value: `${stats.byChannel.salle.toLocaleString()} F`, percentage: stats.total > 0 ? Math.round((stats.byChannel.salle / stats.total) * 100) : 0 },
    { icon: Truck, label: 'Livraison', value: `${stats.byChannel.livraison.toLocaleString()} F`, percentage: stats.total > 0 ? Math.round((stats.byChannel.livraison / stats.total) * 100) : 0 },
  ]

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={BrandColors.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Encaissements"
        subtitle="Détail des revenus par canal"
        showBack={false}
      />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsGrid}>
          <StatCard
            icon={<TrendingUp size={24} color={BrandColors.primary} />}
            label="Revenu Total"
            value={`${stats.total.toLocaleString()} F`}
            trend={{ value: 0, isPositive: true }}
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
            {revenues.slice(0, 10).map((sale, i) => (
              <Card key={i} variant="default" padding={12} style={styles.saleCard}>
                <View style={styles.saleContent}>
                  <View style={styles.saleIconContainer}>
                    <BarChart3 size={18} color={BrandColors.success} />
                  </View>
                  <View style={styles.saleInfo}>
                    <Text style={styles.saleTitle}>Commande #{sale.id.toString().slice(-4)}</Text>
                    <Text style={styles.saleSub}>{sale.type === 'salle' ? `Table ${sale.tablenumber}` : 'Livraison'} • {new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>
                  <Text style={styles.saleAmount}>{sale.total?.toLocaleString()} F</Text>
                </View>
              </Card>
            ))}
            {revenues.length === 0 && <Text style={styles.emptyText}>Aucun encaissement</Text>}
          </View>
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
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
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
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
    borderColor: 'rgba(0, 0, 0, 0.03)',
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
  emptyText: {
    textAlign: 'center',
    color: BrandColors.textMuted,
    fontFamily: FONTS.medium,
    marginTop: 20,
  }
})
