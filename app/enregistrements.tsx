import { useState, useEffect } from 'react'
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, FlatList, TextInput, Alert, Modal } from 'react-native'
import { Monitor, ShoppingBag, Send, Trash2, Plus, Search, ChevronUp, ChevronDown, X } from 'lucide-react-native'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'
import { ScreenHeader } from '../components/ScreenHeader'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { FeedbackModal } from '../components/FeedbackModal'
import { supabase } from '../lib/supabase'
import { useLocalSearchParams } from 'expo-router'

export default function EnregistrementsScreen() {
  const params = useLocalSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTable, setSelectedTable] = useState<number | null>(null)
  const [cart, setCart] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isCartExpanded, setIsCartExpanded] = useState(false)
  const [feedback, setFeedback] = useState<{ visible: boolean, type: 'success' | 'error' | 'info', title: string, message: string }>({
    visible: false,
    type: 'info',
    title: '',
    message: ''
  })

  useEffect(() => {
    fetchProducts()
    if (params.table) {
      setSelectedTable(parseInt(params.table as string))
    }
  }, [params.table])

  async function fetchProducts() {
    const { data } = await supabase.from('resto-products').select('*')
    if (data) setProducts(data)
    setLoading(false)
  }

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter(item => item.id !== id))
  }

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  const dispatchOrder = async () => {
    if (!selectedTable) {
      return setFeedback({
        visible: true,
        type: 'error',
        title: 'Table Requise',
        message: 'Veuillez sélectionner une table dans la barre latérale gauche avant d\'envoyer la commande.'
      })
    }
    if (cart.length === 0) {
      return setFeedback({
        visible: true,
        type: 'error',
        title: 'Panier Vide',
        message: 'Sélectionnez au moins un plat pour créer une commande.'
      })
    }

    setLoading(true)
    
    // Check for existing active order for this table
    const { data: existingOrders } = await supabase
      .from('resto-orders')
      .select('*')
      .eq('tablenumber', selectedTable)
      .neq('status', 'paye')
      .order('created_at', { ascending: false })
      .limit(1)

    const existingOrder = existingOrders && existingOrders.length > 0 ? existingOrders[0] : null

    let error
    if (existingOrder) {
      // Merge items
      const mergedItems = [...existingOrder.items]
      cart.forEach(cartItem => {
        const index = mergedItems.findIndex(item => item.id === cartItem.id)
        if (index > -1) {
          mergedItems[index].quantity += cartItem.quantity
        } else {
          mergedItems.push(cartItem)
        }
      })

      const newTotal = existingOrder.total + total

      const { error: err } = await supabase
        .from('resto-orders')
        .update({ 
          items: mergedItems, 
          total: newTotal,
          status: 'en_attente' // Re-set to pending for kitchen to see updates if needed
        })
        .eq('id', existingOrder.id)
      error = err
    } else {
      // Create new order
      const { error: err } = await supabase.from('resto-orders').insert([{
        type: 'salle',
        tablenumber: selectedTable,
        items: cart,
        status: 'en_attente',
        total: total,
        created_at: new Date().toISOString()
      }])
      error = err
    }

    setLoading(false)

    if (!error) {
      setFeedback({
        visible: true,
        type: 'success',
        title: 'Envoyé !',
        message: existingOrder 
          ? `La commande de la Table ${selectedTable} a été mise à jour.` 
          : `La commande pour la Table ${selectedTable} a été envoyée en cuisine.`
      })
      setCart([])
      setSelectedTable(null)
      setIsCartExpanded(false)
    } else {
      setFeedback({
        visible: true,
        type: 'error',
        title: 'Erreur',
        message: error.message
      })
    }
  }

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Enregistrements"
        subtitle="Prise de commande salle"
      />

      <View style={styles.layout}>
        {/* Table Selector */}
        <View style={styles.tableSidebar}>
          <Text style={styles.sidebarLabel}>TABLES</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <TouchableOpacity
                key={num}
                style={[styles.tableBtn, selectedTable === num && styles.tableBtnActive]}
                onPress={() => setSelectedTable(num)}
              >
                <Text style={[styles.tableBtnText, selectedTable === num && styles.tableBtnTextActive]}>{num}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product List */}
        <View style={styles.mainContent}>
          <View style={styles.searchBar}>
            <Search size={18} color={BrandColors.textSecondary} />
            <TextInput
              placeholder="Rechercher..."
              placeholderTextColor={BrandColors.textSecondary}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {loading && products.length === 0 ? (
            <ActivityIndicator color={BrandColors.primary} style={{ marginTop: 40 }} />
          ) : (
            <FlatList
              data={filteredProducts}
              numColumns={2}
              keyExtractor={item => item.id.toString()}
              columnWrapperStyle={{ gap: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.productCard} onPress={() => addToCart(item)}>
                  <View style={styles.productIcon}>
                    <Text style={{ fontSize: 24 }}>🥘</Text>
                  </View>
                  <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.productPrice}>{item.price.toLocaleString()} F</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>

      {/* Cart Drawer */}
      {cart.length > 0 && (
        <View style={[styles.cartDrawer, isCartExpanded && styles.cartDrawerExpanded]}>
          <TouchableOpacity 
            style={styles.cartHeader} 
            activeOpacity={0.8}
            onPress={() => setIsCartExpanded(!isCartExpanded)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={styles.cartIconBadge}>
                <ShoppingBag size={18} color="white" />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cart.reduce((a, b) => a + b.quantity, 0)}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.cartTitle}>Votre Panier</Text>
                <Text style={styles.cartSubtitle}>Table {selectedTable || '?'}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={styles.cartTotal}>{total.toLocaleString()} F</Text>
              {isCartExpanded ? <ChevronDown size={20} color={BrandColors.textMuted} /> : <ChevronUp size={20} color={BrandColors.textMuted} />}
            </View>
          </TouchableOpacity>

          {isCartExpanded && (
            <View style={styles.expandedContent}>
              <ScrollView style={styles.cartItemsList} showsVerticalScrollIndicator={false}>
                {cart.map(item => (
                  <View key={item.id} style={styles.cartItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cartItemName}>{item.name}</Text>
                      <Text style={styles.cartItemPrice}>{item.price.toLocaleString()} F x {item.quantity}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                       <Text style={styles.cartItemSubtotal}>{(item.price * item.quantity).toLocaleString()} F</Text>
                       <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                         <Trash2 size={18} color={BrandColors.danger} />
                       </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
              
              <View style={styles.cartActions}>
                <Button
                  variant="primary"
                  label="ENVOYER EN CUISINE"
                  onPress={dispatchOrder}
                  style={{ flex: 1, height: 72, marginBottom: 30 }}
                  icon={<Send size={28} color="white" />}
                />
              </View>
            </View>
          )}
        </View>
      )}

      <FeedbackModal 
        visible={feedback.visible}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onClose={() => setFeedback({ ...feedback, visible: false })}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BrandColors.bg },
  layout: { flex: 1, flexDirection: 'row' },
  tableSidebar: {
    width: 70,
    backgroundColor: BrandColors.card,
    borderRightWidth: 1,
    borderRightColor: BrandColors.borderLight,
    paddingVertical: 12,
    alignItems: 'center',
  },
  sidebarLabel: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    color: BrandColors.textMuted,
    marginBottom: 12,
  },
  tableBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: BrandColors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: BrandColors.borderLight,
  },
  tableBtnActive: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primary,
  },
  tableBtnText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
  },
  tableBtnTextActive: {
    color: 'white',
  },
  mainContent: { flex: 1, padding: 12 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrandColors.card,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: { flex: 1, color: BrandColors.textPrimary, fontFamily: FONTS.regular },
  productCard: {
    flex: 1,
    backgroundColor: BrandColors.card,
    borderRadius: RADIUS.lg,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BrandColors.borderLight,
  },
  productIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: { fontSize: 13, fontFamily: FONTS.bold, color: BrandColors.textPrimary, marginBottom: 4 },
  productPrice: { fontSize: 14, fontFamily: FONTS.bold, color: BrandColors.primary },
  cartDrawer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: BrandColors.card,
    borderRadius: RADIUS.xl,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.2)',
  },
  cartDrawerExpanded: {
    height: '70%',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 20,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: BrandColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: BrandColors.danger,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: BrandColors.card,
  },
  badgeText: { color: 'white', fontSize: 10, fontFamily: FONTS.bold },
  cartTitle: { fontSize: 15, fontFamily: FONTS.bold, color: BrandColors.textPrimary },
  cartSubtitle: { fontSize: 12, fontFamily: FONTS.medium, color: BrandColors.textSecondary },
  cartTotal: { fontSize: 18, fontFamily: FONTS.bold, color: BrandColors.primary },
  expandedContent: { flex: 1, marginTop: 20 },
  cartItemsList: { flex: 1 },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
  },
  cartItemName: { fontSize: 14, fontFamily: FONTS.bold, color: BrandColors.textPrimary },
  cartItemPrice: { fontSize: 12, fontFamily: FONTS.medium, color: BrandColors.textSecondary },
  cartItemSubtotal: { fontSize: 14, fontFamily: FONTS.bold, color: BrandColors.textPrimary },
  cartActions: { marginTop: 20, alignItems: 'center' },
})
