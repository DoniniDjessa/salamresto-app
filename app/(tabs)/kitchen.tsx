import { useState, useEffect } from 'react'
import { ScrollView, View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, FlatList } from 'react-native'
import { ScreenHeader } from '../../components/ScreenHeader'
import { SectionHeader } from '../../components/SectionHeader'
import { TaskCard } from '../../components/TaskCard'
import { Button } from '../../components/Button'
import { BrandColors, FONTS, RADIUS } from '../../constants/theme'
import { supabase } from '../../lib/supabase'
import { Clock, ChefHat, CheckCircle, History } from 'lucide-react-native'

type KitchenTab = 'A_PREPARER' | 'PRET' | 'HISTORIQUE'

export default function KitchenScreen() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<KitchenTab>('A_PREPARER')

  useEffect(() => {
    fetchOrders()
    const channel = supabase.channel('kitchen-orders')
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

  async function updateStatus(orderId: string, newStatus: string) {
    const { error } = await supabase
      .from('resto-orders')
      .update({ status: newStatus })
      .eq('id', orderId)
    
    if (error) alert("Erreur lors de la mise à jour: " + error.message)
  }

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'A_PREPARER') return order.status === 'en_attente' || order.status === 'en_preparation'
    if (activeTab === 'PRET') return order.status === 'pret'
    return order.status === 'livre' || order.status === 'annule'
  })

  const TabItem = ({ id, label, icon: Icon }: { id: KitchenTab, label: string, icon: any }) => (
    <TouchableOpacity 
      style={[styles.tab, activeTab === id && styles.activeTab]} 
      onPress={() => setActiveTab(id)}
    >
      <Icon size={18} color={activeTab === id ? 'white' : BrandColors.textSecondary} />
      <Text style={[styles.tabText, activeTab === id && styles.activeTabText]}>{label}</Text>
      {id !== 'HISTORIQUE' && (
        <View style={[styles.badge, activeTab === id && styles.activeBadge]}>
          <Text style={[styles.badgeText, activeTab === id && styles.activeBadgeText]}>
            {orders.filter(o => {
              if (id === 'A_PREPARER') return o.status === 'en_attente' || o.status === 'en_preparation'
              return o.status === 'pret'
            }).length}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Écran Cuisine"
        subtitle="Gestion des commandes en temps réel"
      />

      <View style={styles.tabBarContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tabBarScroll}
        >
          <TabItem id="A_PREPARER" label="À Préparer" icon={ChefHat} />
          <TabItem id="PRET" label="Prêt à Servir" icon={CheckCircle} />
          <TabItem id="HISTORIQUE" label="Historique" icon={History} />
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={BrandColors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TaskCard
              title={item.type === 'external' ? `LIVRAISON: ${item.customername}` : `TABLE ${item.tablenumber}`}
              subtitle={item.items?.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')}
              status={item.status === 'en_attente' ? 'pending' : item.status === 'pret' ? 'completed' : 'in_progress'}
              time={new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              action={
                activeTab === 'A_PREPARER' ? (
                  <Button
                    variant={item.status === 'en_preparation' ? 'success' : 'primary'}
                    size="sm"
                    label={item.status === 'en_preparation' ? 'PRÊT' : 'COMMENCER'}
                    onPress={() => updateStatus(item.id, item.status === 'en_preparation' ? 'pret' : 'en_preparation')}
                  />
                ) : activeTab === 'PRET' ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    label="SERVI"
                    onPress={() => updateStatus(item.id, 'livre')}
                  />
                ) : null
              }
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Aucune commande dans cette catégorie</Text>
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
  tabBarContainer: {
    paddingVertical: 12,
  },
  tabBarScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: BrandColors.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: BrandColors.borderLight,
    gap: 10,
    minWidth: 150,
  },
  activeTab: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primary,
  },
  tabText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: BrandColors.textSecondary,
  },
  activeTabText: {
    color: 'white',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  activeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: BrandColors.primary,
  },
  activeBadgeText: {
    color: 'white',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: BrandColors.textSecondary,
  },
})
