import { useState, useEffect } from 'react'
import { ScrollView, View, StyleSheet, TextInput, FlatList, TouchableOpacity, Text, ActivityIndicator, Image, Modal, Alert } from 'react-native'
import { Utensils, Plus, Trash2, Search, Edit2, X, Camera } from 'lucide-react-native'
import * as ImagePicker from 'expo-image-picker'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'
import { ScreenHeader } from '../components/ScreenHeader'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { FeedbackModal } from '../components/FeedbackModal'
import { supabase } from '../lib/supabase'

export default function MenuScreen() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [form, setForm] = useState({ name: '', price: '', category: '', image: '' })
  const [uploading, setUploading] = useState(false)

  // Feedback states
  const [feedback, setFeedback] = useState<{ visible: boolean, type: 'success' | 'error' | 'info', title: string, message: string }>({
    visible: false,
    type: 'info',
    title: '',
    message: ''
  })

  useEffect(() => {
    fetchProducts()
    const channel = supabase.channel('menu-mgmt-updates')
      .on('postgres_changes', { event: '*', table: 'resto-products', schema: 'public' }, () => {
        fetchProducts()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchProducts() {
    const { data } = await supabase
      .from('resto-products')
      .select('*')
      .order('name', { ascending: true })
    
    if (data) setProducts(data)
    setLoading(false)
  }

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setEditingItem(item)
      setForm({ name: item.name, price: item.price.toString(), category: item.category || '', image: item.image || '' })
    } else {
      setEditingItem(null)
      setForm({ name: '', price: '', category: '', image: '' })
    }
    setShowModal(true)
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled) {
      setForm({ ...form, image: result.assets[0].uri })
    }
  }

  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri)
      const blob = await response.blob()
      const arrayBuffer = await new Response(blob).arrayBuffer()
      
      const fileExt = uri.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from('resto-bucket')
        .upload(filePath, arrayBuffer, {
          contentType: `image/${fileExt}`
        })

      if (uploadError) throw uploadError

      const { data: publicData } = supabase.storage.from('resto-bucket').getPublicUrl(filePath)
      return publicData.publicUrl
    } catch (error: any) {
      console.error("Upload error:", error.message)
      return uri
    }
  }

  const handleSave = async () => {
    if (!form.name || !form.price) {
      return setFeedback({
        visible: true,
        type: 'error',
        title: 'Champs Manquants',
        message: 'Oups ! Veuillez renseigner au moins le nom et le prix du plat pour continuer.'
      })
    }

    setUploading(true)
    let imageUrl = form.image

    if (imageUrl && (imageUrl.startsWith('file://') || imageUrl.startsWith('content://'))) {
      const remoteUrl = await uploadImage(imageUrl)
      if (remoteUrl) imageUrl = remoteUrl
    }

    const productData = {
      name: form.name,
      price: parseFloat(form.price),
      category: form.category,
      image: imageUrl
    }

    let error
    if (editingItem) {
      const { error: err } = await supabase.from('resto-products').update(productData).eq('id', editingItem.id)
      error = err
    } else {
      const { error: err } = await supabase.from('resto-products').insert([productData])
      error = err
    }

    setUploading(false)
    if (!error) {
      setShowModal(false)
      fetchProducts()
      setFeedback({
        visible: true,
        type: 'success',
        title: 'Succès !',
        message: editingItem ? 'Le plat a été mis à jour avec succès.' : 'Le nouveau plat a été ajouté au menu.'
      })
    } else {
      setFeedback({
        visible: true,
        type: 'error',
        title: 'Erreur',
        message: error.message
      })
    }
  }

  const handleDelete = (id: string) => {
    Alert.alert("Supprimer", "Voulez-vous supprimer ce plat ?", [
      { text: "Annuler", style: "cancel" },
      { 
        text: "Supprimer", 
        style: "destructive", 
        onPress: async () => {
          const { error } = await supabase.from('resto-products').delete().eq('id', id)
          if (!error) fetchProducts()
        } 
      }
    ])
  }

  const [selectedCategory, setSelectedCategory] = useState<string>('TOUS')

  const categories = ['TOUS', 'PLAT PRINCIPAL', 'BOISSONS', 'DESSERT', 'COLLATION', 'AUTRES']

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    
    if (selectedCategory === 'TOUS') return matchesSearch
    
    const productCat = p.category?.toUpperCase() || 'AUTRES'
    return matchesSearch && productCat === selectedCategory
  })

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Catalogue Menu"
        subtitle="Gérez vos plats en temps réel"
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrap}>
          <Search size={18} color={BrandColors.textSecondary} />
          <TextInput
            placeholder="Rechercher un plat..."
            placeholderTextColor={BrandColors.textSecondary}
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal()}>
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tabsScroll}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryTab, selectedCategory === cat && styles.activeCategoryTab]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryTabText, selectedCategory === cat && styles.activeCategoryTabText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={BrandColors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          contentContainerStyle={styles.listContainer}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card variant="elevated" padding={16} style={styles.menuCard}>
              <View style={styles.itemHeader}>
                <View style={styles.iconContainer}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.productImage} />
                  ) : (
                    <Utensils size={22} color={BrandColors.primary} />
                  )}
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemCategory}>{item.category || 'Menu Principal'}</Text>
                </View>
                <Text style={styles.itemPrice}>{item.price?.toLocaleString()} F</Text>
              </View>
              
              <View style={styles.itemActions}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleOpenModal(item)}>
                  <Edit2 size={16} color={BrandColors.primary} />
                  <Text style={styles.editText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                  <Trash2 size={18} color={BrandColors.danger} />
                </TouchableOpacity>
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun plat trouvé</Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: 120 }} />}
        />
      )}


      {/* Add/Edit Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingItem ? 'Modifier le Plat' : 'Nouveau Plat'}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X size={24} color={BrandColors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.form}>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.8}>
                {form.image ? (
                  <Image source={{ uri: form.image }} style={styles.pickedImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Camera size={32} color={BrandColors.textMuted} />
                    <Text style={styles.imagePlaceholderText}>Ajouter une photo</Text>
                  </View>
                )}
                <View style={styles.editImageBtn}>
                   <Plus size={16} color="white" />
                </View>
              </TouchableOpacity>

              <Text style={styles.label}>NOM DU PLAT</Text>
              <TextInput 
                style={styles.formInput} 
                value={form.name} 
                onChangeText={t => setForm({...form, name: t})}
                placeholder="Ex: Thieboudienne Poisson"
                placeholderTextColor={BrandColors.textMuted}
              />

              <Text style={styles.label}>PRIX (F)</Text>
              <TextInput 
                style={styles.formInput} 
                keyboardType="numeric"
                value={form.price} 
                onChangeText={t => setForm({...form, price: t})}
                placeholder="0"
                placeholderTextColor={BrandColors.textMuted}
              />

              <Text style={styles.label}>CATÉGORIE</Text>
              <View style={styles.formCategories}>
                {['PLAT PRINCIPAL', 'BOISSONS', 'DESSERT', 'COLLATION', 'AUTRES'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.formCatBtn, form.category?.toUpperCase() === cat && styles.formCatBtnActive]}
                    onPress={() => setForm({...form, category: cat})}
                  >
                    <Text style={[styles.formCatBtnText, form.category?.toUpperCase() === cat && styles.formCatBtnTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Button 
                variant="primary" 
                label={uploading ? "PATIENTEZ..." : (editingItem ? "METTRE À JOUR" : "ENREGISTRER")} 
                onPress={handleSave}
                disabled={uploading}
                style={{ marginTop: 20, height: 56 }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 12, alignItems: 'center' },
  searchInputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: BrandColors.card, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: BrandColors.borderLight, gap: 8 },
  input: { flex: 1, color: BrandColors.textPrimary, fontSize: 15, fontFamily: FONTS.regular },
  addButton: { width: 48, height: 48, borderRadius: RADIUS.lg, backgroundColor: BrandColors.primary, justifyContent: 'center', alignItems: 'center' },
  listContainer: { paddingHorizontal: 16, gap: 16 },
  tabsWrapper: { marginBottom: 16 },
  tabsScroll: { paddingHorizontal: 16, gap: 10 },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.lg,
    backgroundColor: BrandColors.card,
    borderWidth: 1,
    borderColor: BrandColors.borderLight,
  },
  activeCategoryTab: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primary,
  },
  categoryTabText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: BrandColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeCategoryTabText: {
    color: 'white',
  },
  menuCard: { marginBottom: 4 },
  itemHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  iconContainer: { width: 54, height: 54, borderRadius: RADIUS.md, backgroundColor: 'rgba(168, 85, 247, 0.1)', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  productImage: { width: '100%', height: '100%' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontFamily: FONTS.bold, color: BrandColors.textPrimary, marginBottom: 2 },
  itemCategory: { fontSize: 12, fontFamily: FONTS.medium, color: BrandColors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  itemPrice: { fontSize: 15, fontFamily: FONTS.bold, color: BrandColors.success },
  itemActions: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end', paddingTop: 12, borderTopWidth: 1, borderTopColor: BrandColors.borderLight },
  editButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'rgba(168, 85, 247, 0.1)', borderRadius: RADIUS.md },
  editText: { fontSize: 13, fontFamily: FONTS.semiBold, color: BrandColors.primary },
  deleteButton: { padding: 8, backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: RADIUS.md },
  emptyContainer: { paddingVertical: 60, alignItems: 'center' },
  emptyText: { color: BrandColors.textMuted, fontFamily: FONTS.medium },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: BrandColors.card, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: 24, height: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontFamily: FONTS.bold, color: BrandColors.textPrimary },
  form: { flex: 1 },
  imagePicker: { width: '100%', height: 160, backgroundColor: BrandColors.bg, borderRadius: RADIUS.lg, justifyContent: 'center', alignItems: 'center', marginBottom: 24, overflow: 'hidden', borderWidth: 1, borderColor: BrandColors.borderLight },
  pickedImage: { width: '100%', height: '100%' },
  imagePlaceholder: { alignItems: 'center', gap: 8 },
  imagePlaceholderText: { fontSize: 12, fontFamily: FONTS.medium, color: BrandColors.textMuted },
  editImageBtn: { position: 'absolute', bottom: 12, right: 12, width: 32, height: 32, borderRadius: 10, backgroundColor: BrandColors.primary, justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 11, fontFamily: FONTS.bold, color: BrandColors.textMuted, marginBottom: 8 },
  formInput: { backgroundColor: BrandColors.bg, borderRadius: RADIUS.md, padding: 16, color: BrandColors.textPrimary, fontFamily: FONTS.medium, marginBottom: 20, borderWidth: 1, borderColor: BrandColors.borderLight },
  formCategories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  formCatBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS.md, backgroundColor: BrandColors.bg, borderWidth: 1, borderColor: BrandColors.borderLight },
  formCatBtnActive: { backgroundColor: BrandColors.primary, borderColor: BrandColors.primary },
  formCatBtnText: { fontSize: 11, fontFamily: FONTS.bold, color: BrandColors.textSecondary, textTransform: 'uppercase' },
  formCatBtnTextActive: { color: 'white' },
})
