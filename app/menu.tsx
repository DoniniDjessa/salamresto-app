import { ScrollView, View, StyleSheet, TextInput, FlatList, TouchableOpacity, Text } from 'react-native'
import { Utensils, Plus, Trash2, Search } from 'lucide-react-native'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'
import { ScreenHeader } from '../components/ScreenHeader'
import { Card } from '../components/Card'
import { Button } from '../components/Button'

// Authentic Salam Resto Menu Data
const menuItems = [
  { id: 1, name: 'Thieboudienne Poisson', price: '12,500 F', category: 'Plats Signature' },
  { id: 2, name: 'Yassa Poulet', price: '9,500 F', category: 'Plats' },
  { id: 3, name: 'Dibi Agneau (Grillades)', price: '15,000 F', category: 'Grillades' },
  { id: 4, name: 'Bissap Rouge Maison', price: '2,500 F', category: 'Boissons' },
  { id: 5, name: 'Pastels Viande (x6)', price: '4,500 F', category: 'Entrées' },
  { id: 6, name: 'Salade Chef Salam', price: '5,500 F', category: 'Entrées' },
]

export default function MenuScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Catalogue Menu"
        subtitle="Gérez vos plats et catégories"
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <Search size={18} color={BrandColors.textSecondary} />
          <TextInput
            placeholder="Rechercher un plat..."
            placeholderTextColor={BrandColors.textSecondary}
            style={styles.input}
          />
        </View>
        <Button
          variant="primary"
          size="md"
          label=""
          icon={<Plus size={20} color="#FFFFFF" />}
          style={styles.addButton}
          onPress={() => console.log('Add item')}
        />
      </View>

      <FlatList
        data={menuItems}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card variant="elevated" padding={16} style={styles.menuCard}>
            <View style={styles.itemHeader}>
              <View style={styles.iconContainer}>
                <Utensils size={22} color={BrandColors.primary} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
              </View>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
            
            <View style={styles.itemActions}>
              <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
                <Text style={styles.editText}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} activeOpacity={0.7}>
                <Trash2 size={18} color={BrandColors.danger} />
              </TouchableOpacity>
            </View>
          </Card>
        )}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.bg,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: BrandColors.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: BrandColors.borderLight,
    gap: 8,
  },
  input: {
    flex: 1,
    color: BrandColors.textPrimary,
    fontSize: 15,
    fontFamily: FONTS.regular,
  },
  addButton: {
    width: 48,
    height: 48,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: RADIUS.lg,
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  menuCard: {
    marginBottom: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: BrandColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemPrice: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: BrandColors.success,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BrandColors.borderLight,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    borderRadius: RADIUS.md,
  },
  editText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: BrandColors.primary,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderRadius: RADIUS.md,
  }
})
