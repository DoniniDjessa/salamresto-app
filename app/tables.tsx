import { useState, useEffect } from 'react'
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, FlatList, Alert } from 'react-native'
import { LayoutDashboard as TableIcon, Plus, User, Trash2 } from 'lucide-react-native'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'
import { ScreenHeader } from '../components/ScreenHeader'
import { Card } from '../components/Card'
import { supabase } from '../lib/supabase'
import { useRouter } from 'expo-router'

export default function TablesScreen() {
  const router = useRouter()
  const [localTables] = useState<{id: number}[]>([
    { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }
  ])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const channel = supabase.channel('tables-updates-mobile')
      .on('postgres_changes', { event: '*', table: 'resto-orders', schema: 'public' }, () => {
        fetchData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchData() {
    const { data } = await supabase
      .from('resto-orders')
      .select('*')
      .neq('status', 'paye')
    
    if (data) setOrders(data)
    setLoading(false)
  }

  const handleEmptyTable = (tableId: number, orderId: string) => {
    Alert.alert(
      'Vider la table',
      `Voulez-vous libérer la Table ${tableId} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Confirmer', 
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('resto-orders')
              .update({ status: 'paye' })
              .eq('id', orderId)
            
            if (!error) fetchData()
          }
        }
      ]
    )
  }

  const handleTablePress = (tableId: number) => {
    router.push({
      pathname: '/enregistrements',
      params: { table: tableId.toString() }
    })
  }

  const renderTable = ({ item: table }: { item: any }) => {
    const activeOrder = orders.find(o => o.tablenumber === table.id)
    const isOccupied = !!activeOrder

    return (
      <TouchableOpacity 
        style={styles.tableCardWrapper} 
        activeOpacity={0.9} 
        onPress={() => handleTablePress(table.id)}
      >
        <Card variant="elevated" padding={16} style={[styles.tableCard, { borderTopColor: isOccupied ? BrandColors.warning : BrandColors.success, borderTopWidth: 4 }]}>
          <View style={styles.tableHeader}>
            <View style={styles.iconContainer}>
              <TableIcon size={18} color={isOccupied ? BrandColors.warning : BrandColors.success} />
            </View>
            <Text style={styles.tableName}>Table {table.id}</Text>
            <View style={[styles.statusBadge, { backgroundColor: isOccupied ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)' }]}>
              <Text style={[styles.statusText, { color: isOccupied ? BrandColors.warning : BrandColors.success }]}>
                {isOccupied ? 'OCCUPÉE' : 'LIBRE'}
              </Text>
            </View>
          </View>

          {isOccupied ? (
            <View style={styles.orderInfo}>
              <View style={styles.customerRow}>
                 <User size={12} color={BrandColors.textSecondary} />
                 <Text style={styles.customerName} numberOfLines={1}>{activeOrder.customername || 'Invité'}</Text>
              </View>
              <View style={styles.itemsPreview}>
                 {activeOrder.items?.slice(0, 3).map((item: any, idx: number) => (
                   <Text key={idx} style={styles.itemText} numberOfLines={1}>
                      {item.quantity}x {item.name}
                   </Text>
                 ))}
              </View>
              <View style={styles.footer}>
                 <View>
                   <Text style={styles.totalLabel}>Total</Text>
                   <Text style={styles.totalAmount}>{activeOrder.total?.toLocaleString()} F</Text>
                 </View>
                 <TouchableOpacity 
                   style={styles.emptyButton} 
                   onPress={() => handleEmptyTable(table.id, activeOrder.id)}
                 >
                    <Trash2 size={16} color={BrandColors.danger} />
                 </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.emptyContent}>
              <Text style={styles.emptyText}>Disponible</Text>
              <View style={styles.openButton}>
                 <Plus size={14} color={BrandColors.primary} />
                 <Text style={styles.openText}>OUVRIR</Text>
              </View>
            </View>
          )}
        </Card>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Gestion Tables"
        subtitle="Occupation de la salle"
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={BrandColors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={localTables}
          renderItem={renderTable}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 12,
  },
  tableCardWrapper: {
    flex: 1,
    marginBottom: 12,
  },
  tableCard: {
    flex: 1,
    minHeight: 200,
  },
  tableHeader: {
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableName: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  statusText: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    letterSpacing: 0.5,
  },
  orderInfo: {
    flex: 1,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  customerName: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: BrandColors.textPrimary,
  },
  itemsPreview: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: RADIUS.sm,
    padding: 8,
    marginBottom: 12,
    minHeight: 50,
  },
  itemText: {
    fontSize: 10,
    fontFamily: FONTS.regular,
    color: BrandColors.textSecondary,
    marginBottom: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 'auto',
  },
  totalLabel: {
    fontSize: 9,
    fontFamily: FONTS.medium,
    color: BrandColors.textMuted,
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
  },
  emptyButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: BrandColors.textMuted,
  },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: BrandColors.border,
  },
  openText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
  },
})
