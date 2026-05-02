import { ScrollView, View, StyleSheet, TextInput, FlatList, TouchableOpacity, Text } from 'react-native'
import { Utensils, Plus, Trash2, Search } from 'lucide-react-native'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'
import { ScreenHeader } from '../components/ScreenHeader'
import { Card } from '../components/Card'
import { Button } from '../components/Button'

const menuItems = [
  { id: 1, name: 'Salade Chef', price: '5,500 F', category: 'Entrées' },
  { id: 2, name: 'Burger Premium', price: '8,000 F', category: 'Plats' },
  { id: 3, name: 'Pâtes Carbonara', price: '7,500 F', category: 'Plats' },
  { id: 4, name: 'Tiramisu', price: '3,500 F', category: 'Desserts' },
  { id: 5, name: 'Couscous Merguez', price: '6,500 F', category: 'Plats' },
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
            placeholder="Rechercher..."
            placeholderTextColor={BrandColors.textSecondary}
            style={styles.input}
          />
        </View>
        <Button
          variant="primary"
          size="sm"
          label=""
          icon={<Plus size={16} color="#FFFFFF" />}
          onPress={() => console.log('Add item')}
        />
      </View>

      <FlatList
        data={menuItems}
        scrollEnabled={false}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card variant="elevated" padding={16}>
            <View style={styles.itemHeader}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
              </View>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editText}>Éditer</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Trash2 size={18} color={BrandColors.danger} />
              </TouchableOpacity>
            </View>
          </Card>
        )}
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
    gap: 8,
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
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: BrandColors.textSecondary,
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: BrandColors.primary,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    borderRadius: RADIUS.md,
  },
  editText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: BrandColors.primary,
  },
})
           </View>
           <Button bg={BrandColors.primary} br={16} h={50} w={50} p={0}>
              <Plus size={24} color="white" />
           </Button>
        </XStack>

        <YStack gap="$4">
           {[
             { name: 'Thieboudienne Poisson', price: '12,500 F', cat: 'Plats' },
             { name: 'Yassa Poulet', price: '9,500 F', cat: 'Plats' },
             { name: 'Bissap Rouge', price: '2,500 F', cat: 'Boissons' },
             { name: 'Dibi Agneau', price: '15,000 F', cat: 'Grillades' }
           ].map((item, i) => (
              <Card key={i} p="$4" bg={BrandColors.card} br={24} bw={1} bc="rgba(255,255,255,0.03)">
                 <XStack gap="$4" ai="center">
                    <View width={65} height={65} br={18} bg="rgba(255,255,255,0.05)" ai="center" jc="center">
                       <Utensils size={26} color={BrandColors.primary} />
                    </View>
                    <YStack f={1}>
                       <Text color="white" fow="800" fsz={15}>{item.name}</Text>
                       <Text color={BrandColors.textSecondary} fsz={11} fow="700" textTransform="uppercase">{item.cat}</Text>
                       <Text color={BrandColors.success} fow="900" mt="$1">{item.price}</Text>
                    </YStack>
                    <Button circular size="$3" bg="rgba(239, 68, 68, 0.1)">
                       <Trash2 size={16} color={BrandColors.danger} />
                    </Button>
                 </XStack>
              </Card>
           ))}
        </YStack>
      </ScrollView>
    </View>
  )
}
