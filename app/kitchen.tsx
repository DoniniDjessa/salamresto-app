import { useState, useEffect } from 'react'
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { ChefHat, Clock, CheckCircle2, Play } from 'lucide-react-native'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'
import { ScreenHeader } from '../components/ScreenHeader'
import { Card } from '../components/Card'
import { supabase } from '../lib/supabase'

const statusColors = {
  en_attente: BrandColors.danger,
  en_preparation: BrandColors.warning,
  pret: BrandColors.success,
}

export default function KitchenScreen() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
    const channel = supabase.channel('resto-orders-kds-mobile')
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
      .in('status', ['en_attente', 'en_preparation', 'pret'])
      .order('created_at', { ascending: true })
    
    if (data) setOrders(data)
    setLoading(false)
  }

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('resto-orders')
      .update({ status: newStatus })
      .eq('id', orderId)
    
    if (!error) fetchOrders()
  }

  const pending = orders.filter(o => o.status === 'en_attente')
  const prepping = orders.filter(o => o.status === 'en_preparation')
  const ready = orders.filter(o => o.status === 'pret')

  const TicketCard = ({ order }: { order: any }) => (
    <Card variant="elevated" padding={16} style={[styles.ticketCard, { borderLeftColor: statusColors[order.status as keyof typeof statusColors], borderLeftWidth: 6 }]}>
      <View style={styles.ticketHeader}>
        <View>
          <Text style={styles.ticketId}>#{order.id.slice(0, 4).toUpperCase()}</Text>
          <View style={styles.timeRow}>
            <Clock size={12} color={BrandColors.textSecondary} />
            <Text style={styles.timeText}>
              {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>
            {order.type === 'salle' ? `TABLE ${order.tablenumber}` : 'LIVRAISON'}
          </Text>
        </View>
      </View>
      
      {order.customername && (
        <Text style={styles.customerName}>Client: {order.customername}</Text>
      )}

      <View style={styles.itemsContainer}>
        {order.items?.map((item: any, i: number) => (
          <View key={i} style={styles.itemRow}>
            <Text style={styles.itemText}>{item.quantity}x {item.name}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.actions}>
        {order.status === 'en_attente' && (
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: BrandColors.primary }]} onPress={() => updateStatus(order.id, 'en_preparation')}>
            <Play size={16} color="white" />
            <Text style={styles.actionText}>COMMENCER</Text>
          </TouchableOpacity>
        )}
        {order.status === 'en_preparation' && (
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: BrandColors.success }]} onPress={() => updateStatus(order.id, 'pret')}>
            <CheckCircle2 size={16} color="white" />
            <Text style={styles.actionText}>TERMINER</Text>
          </TouchableOpacity>
        )}
        {order.status === 'pret' && (
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: BrandColors.textPrimary }]} onPress={() => updateStatus(order.id, 'livre')}>
            <Text style={[styles.actionText, { color: BrandColors.bg }]}>SERVIR / EXPÉDIER</Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  )

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Écran Cuisine"
        subtitle="KDS - Gestion des commandes"
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={BrandColors.primary} size="large" />
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Summary Headers */}
          <View style={styles.summaryGrid}>
             <View style={[styles.summaryCard, { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }]}>
                <Text style={[styles.summaryValue, { color: BrandColors.danger }]}>{pending.length}</Text>
                <Text style={styles.summaryLabel}>EN ATTENTE</Text>
             </View>
             <View style={[styles.summaryCard, { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Text style={[styles.summaryValue, { color: BrandColors.success }]}>{ready.length}</Text>
                <Text style={styles.summaryLabel}>PRÊT / PASSE</Text>
             </View>
          </View>

          <View style={styles.section}>
            {pending.length > 0 && (
              <View style={styles.columnSection}>
                <Text style={[styles.columnTitle, { color: BrandColors.danger }]}>EN ATTENTE ({pending.length})</Text>
                {pending.map(o => <TicketCard key={o.id} order={o} />)}
              </View>
            )}

            {prepping.length > 0 && (
              <View style={styles.columnSection}>
                <Text style={[styles.columnTitle, { color: BrandColors.warning }]}>EN PRÉPARATION ({prepping.length})</Text>
                {prepping.map(o => <TicketCard key={o.id} order={o} />)}
              </View>
            )}

            {ready.length > 0 && (
              <View style={styles.columnSection}>
                <Text style={[styles.columnTitle, { color: BrandColors.success }]}>PRÊT / AU PASSE ({ready.length})</Text>
                {ready.map(o => <TicketCard key={o.id} order={o} />)}
              </View>
            )}

            {orders.length === 0 && (
               <View style={styles.emptyContainer}>
                  <ChefHat size={48} color={BrandColors.textMuted} />
                  <Text style={styles.emptyText}>Aucune commande en cours</Text>
               </View>
            )}
          </View>
        </ScrollView>
      )}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    borderRadius: RADIUS.lg,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontFamily: FONTS.bold,
  },
  summaryLabel: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  section: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  columnSection: {
    marginBottom: 24,
  },
  columnTitle: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
    marginBottom: 16,
  },
  ticketCard: {
    marginBottom: 16,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketId: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
  },
  customerName: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: BrandColors.textSecondary,
    marginBottom: 12,
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
  typeBadge: {
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
  },
  typeText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: BrandColors.primary,
  },
  itemsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 16,
  },
  itemRow: {
    marginBottom: 4,
  },
  itemText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
  },
  actionText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: 'white',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: BrandColors.textMuted,
  },
})
