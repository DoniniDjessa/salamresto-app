import { useState, useEffect } from 'react'
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import { ScreenHeader } from '../../components/ScreenHeader'
import { TaskCard } from '../../components/TaskCard'
import { Button } from '../../components/Button'
import { BrandColors, FONTS, RADIUS } from '../../constants/theme'
import { Plus, ShoppingBag, Clock, CheckCircle2, LayoutList, CheckCircle, Wallet } from 'lucide-react-native'
import { supabase } from '../../lib/supabase'

const TABS = [
  { id: 'ongoing', label: 'En cours', icon: LayoutList, statuses: ['en_attente', 'en_preparation'] },
  { id: 'ready', label: 'Prêtes', icon: CheckCircle, statuses: ['pret'] },
  { id: 'completed', label: 'Terminées', icon: Wallet, statuses: ['livre', 'paye'] },
]

export default function OrdersScreen() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('ongoing')

  useEffect(() => {
    fetchOrders()
    const channel = supabase.channel('orders-updates-tabs')
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
      .order('created_at', { ascending: false })
    
    if (data) setOrders(data)
    setLoading(false)
  }

  const currentTab = TABS.find(t => t.id === activeTab)
  const filteredOrders = orders.filter(o => currentTab?.statuses.includes(o.status))

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('resto-orders')
      .update({ status: newStatus })
      .eq('id', orderId)
    
    if (!error) fetchOrders()
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Commandes"
        showBack={false}
        action={
          <Button
            variant="primary"
            size="sm"
            label="Nouvelle"
            icon={<Plus size={16} color="#FFFFFF" />}
            onPress={() => console.log('New order')}
          />
        }
      />

      {/* Status Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          const count = orders.filter(o => tab.statuses.includes(o.status)).length
          
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
          renderItem={({ item }) => (
            <TaskCard
              title={item.type === 'salle' ? `Table ${item.tablenumber}` : item.customername || 'Commande Externe'}
              description={`${item.items?.length || 0} articles • ${item.total?.toLocaleString()} F`}
              status={item.status === 'en_attente' ? 'urgent' : item.status === 'en_preparation' ? 'pending' : 'completed'}
              time={new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              action={
                item.status === 'pret' ? (
                  <Button
                    variant="success"
                    size="sm"
                    label="Servi"
                    onPress={() => handleUpdateStatus(item.id, 'paye')}
                  />
                ) : item.status === 'en_attente' ? (
                  <Button
                    variant="primary"
                    size="sm"
                    label="En cuisine"
                    onPress={() => handleUpdateStatus(item.id, 'en_preparation')}
                  />
                ) : null
              }
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ShoppingBag size={48} color={BrandColors.textMuted} />
              <Text style={styles.emptyText}>Aucune commande {activeTab}</Text>
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
    gap: 4,
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
    gap: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
