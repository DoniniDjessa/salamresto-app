import { useState, useEffect } from 'react'
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert, FlatList } from 'react-native'
import { Truck, MapPin, User, CheckCircle, Package, ArrowRight, Clock, Phone, Plus } from 'lucide-react-native'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'
import { ScreenHeader } from '../components/ScreenHeader'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { supabase } from '../lib/supabase'

export default function LivraisonScreen() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
    const channel = supabase.channel('livraison-updates')
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
      .in('status', ['pret', 'en_livraison', 'livre'])
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

  const DeliveryCard = ({ order }: { order: any }) => (
    <Card variant="elevated" padding={16} style={[styles.deliveryCard, { borderLeftWidth: 4, borderLeftColor: order.status === 'pret' ? BrandColors.primary : order.status === 'en_livraison' ? BrandColors.warning : BrandColors.success }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>#{order.id.slice(0, 4).toUpperCase()}</Text>
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
        {order.status === 'livre' && (
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
        title="Livraison"
        subtitle="Logistique & Expéditions"
        action={
          <TouchableOpacity style={styles.headerAction} onPress={() => Alert.alert("Nouveau", "Créer une livraison manuelle")}>
            <Plus size={20} color="white" />
          </TouchableOpacity>
        }
      />

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>{orders.filter(o => o.status === 'pret').length}</Text>
          <Text style={styles.statLabel}>À PRÉPARER</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color: BrandColors.warning }]}>{orders.filter(o => o.status === 'en_livraison').length}</Text>
          <Text style={styles.statLabel}>EN ROUTE</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color: BrandColors.success }]}>{orders.filter(o => o.status === 'livre').length}</Text>
          <Text style={styles.statLabel}>LIVRÉS (H24)</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={BrandColors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <DeliveryCard order={item} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Truck size={48} color={BrandColors.textMuted} />
              <Text style={styles.emptyText}>Aucune livraison en cours</Text>
            </View>
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BrandColors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: BrandColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: BrandColors.card,
    borderRadius: RADIUS.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BrandColors.borderLight,
  },
  statVal: { fontSize: 20, fontFamily: FONTS.bold, color: BrandColors.textPrimary },
  statLabel: { fontSize: 9, fontFamily: FONTS.bold, color: BrandColors.textMuted, marginTop: 2 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  deliveryCard: { marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  orderId: { fontSize: 16, fontFamily: FONTS.bold, color: BrandColors.textPrimary },
  paymentBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm },
  paymentText: { fontSize: 10, fontFamily: FONTS.bold },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  infoText: { fontSize: 13, fontFamily: FONTS.medium, color: BrandColors.textSecondary, flex: 1 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: BrandColors.borderLight },
  totalAmount: { fontSize: 18, fontFamily: FONTS.bold, color: BrandColors.textPrimary },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: BrandColors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: RADIUS.md },
  actionBtnText: { color: 'white', fontSize: 13, fontFamily: FONTS.bold },
  completedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full },
  completedText: { color: BrandColors.success, fontSize: 12, fontFamily: FONTS.bold },
  empty: { paddingVertical: 80, alignItems: 'center', gap: 16 },
  emptyText: { color: BrandColors.textMuted, fontFamily: FONTS.medium },
})
