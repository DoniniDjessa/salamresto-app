import { useState, useEffect } from 'react'
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, FlatList, Alert } from 'react-native'
import { Truck, MapPin, User, CheckCircle, Package, ArrowRight, Clock, Navigation, CheckSquare } from 'lucide-react-native'
import { BrandColors, FONTS, RADIUS } from '../../constants/theme'
import { ScreenHeader } from '../../components/ScreenHeader'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { supabase } from '../../lib/supabase'

const TABS = [
  { id: 'pret', label: 'À préparer', icon: Package },
  { id: 'en_livraison', label: 'En route', icon: Navigation },
  { id: 'livre', label: 'Livrés', icon: CheckSquare },
]

export default function DeliveryScreen() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pret')

  useEffect(() => {
    fetchOrders()
    const channel = supabase.channel('delivery-updates-tabs')
      .on('postgres_changes', { event: '*', table: 'resto-orders', schema: 'public' }, () => {
        fetchOrders()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchOrders() {
    const { data } = await supabase
      .from('resto-orders')
      .select('*')
      .eq('type', 'external')
      .in('status', ['pret', 'en_livraison', 'livre', 'paye'])
      .order('updated_at', { ascending: false })
    
    if (data) setOrders(data)
    setLoading(false)
  }

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('resto-orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId)
    
    if (!error) fetchOrders()
    else Alert.alert("Erreur", error.message)
  }

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'livre') return o.status === 'livre' || o.status === 'paye'
    return o.status === activeTab
  })

  const DeliveryCard = ({ order }: { order: any }) => (
    <Card variant="elevated" padding={16} style={[styles.deliveryCard, { borderLeftWidth: 6, borderLeftColor: order.status === 'pret' ? BrandColors.primary : order.status === 'en_livraison' ? BrandColors.warning : BrandColors.success }]}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.orderId}>#{order.id.slice(0, 4).toUpperCase()}</Text>
          <View style={styles.timeRow}>
            <Clock size={12} color={BrandColors.textSecondary} />
            <Text style={styles.timeText}>
              {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
        <View style={[styles.paymentBadge, { backgroundColor: order.payment_method === 'online' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)' }]}>
          <Text style={[styles.paymentText, { color: order.payment_method === 'online' ? BrandColors.success : BrandColors.warning }]}>
            {order.payment_method === 'online' ? 'PAYÉ' : 'À PAYER'}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <User size={16} color={BrandColors.textSecondary} />
        <Text style={styles.infoText}>{order.customername}</Text>
      </View>
      <View style={styles.infoRow}>
        <MapPin size={16} color={BrandColors.textSecondary} />
        <Text style={styles.infoText} numberOfLines={2}>{order.deliveryaddress}</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.totalAmount}>{order.total?.toLocaleString()} F</Text>
        {order.status === 'pret' && (
          <TouchableOpacity style={styles.actionBtn} onPress={() => updateStatus(order.id, 'en_livraison')}>
            <Text style={styles.actionBtnText}>DÉMARRER</Text>
            <ArrowRight size={16} color="white" />
          </TouchableOpacity>
        )}
        {order.status === 'en_livraison' && (
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: BrandColors.success }]} onPress={() => updateStatus(order.id, 'livre')}>
            <CheckCircle size={16} color="white" />
            <Text style={styles.actionBtnText}>TERMINER</Text>
          </TouchableOpacity>
        )}
        {(order.status === 'livre' || order.status === 'paye') && (
          <View style={styles.completedBadge}>
            <CheckCircle size={14} color={BrandColors.success} />
            <Text style={styles.completedText}>LIVRÉ</Text>
          </View>
        )}
      </View>
    </Card>
  )

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Livraisons"
        subtitle="Suivi des expéditions"
        showBack={false}
      />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          const count = orders.filter(o => {
            if (tab.id === 'livre') return o.status === 'livre' || o.status === 'paye'
            return o.status === tab.id
          }).length
          
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Icon size={18} color={isActive ? BrandColors.primary : BrandColors.textSecondary} />
              <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>{tab.label}</Text>
              {count > 0 && (
                <View style={[styles.countBadge, isActive && styles.activeCountBadge]}>
                  <Text style={[styles.countText, isActive && styles.activeCountText]}>{count}</Text>
                </View>
              )}
            </TouchableOpacity>
          )
        })}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={BrandColors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <DeliveryCard order={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Truck size={64} color={BrandColors.textMuted} />
              <Text style={styles.emptyText}>Aucune livraison {activeTab.replace('_', ' ')}</Text>
            </View>
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.bg,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    backgroundColor: BrandColors.card,
    borderWidth: 1,
    borderColor: BrandColors.borderLight,
  },
  activeTab: {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderColor: BrandColors.primary,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: BrandColors.textSecondary,
  },
  activeTabLabel: {
    color: BrandColors.primary,
  },
  countBadge: {
    backgroundColor: BrandColors.bgSecondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    minWidth: 18,
    alignItems: 'center',
  },
  activeCountBadge: {
    backgroundColor: BrandColors.primary,
  },
  countText: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    color: BrandColors.textSecondary,
  },
  activeCountText: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  timeText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: BrandColors.textSecondary,
  },
  paymentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  paymentText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: BrandColors.textSecondary,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BrandColors.borderLight,
  },
  totalAmount: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
  },
  actionBtnText: {
    color: 'white',
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  completedText: {
    color: BrandColors.success,
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    gap: 16,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: BrandColors.textMuted,
  },
})
