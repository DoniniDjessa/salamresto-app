import { ScrollView, View, StyleSheet, TextInput, TouchableOpacity, Text, FlatList } from 'react-native'
import { CreditCard, Plus, Trash2, Calendar } from 'lucide-react-native'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'
import { ScreenHeader } from '../components/ScreenHeader'
import { Card } from '../components/Card'
import { Button } from '../components/Button'

const expenses = [
  { id: 1, reason: 'Achat Matière première', amount: '250,000 F', date: '2025-05-02', category: 'Fournitures' },
  { id: 2, reason: 'Loyer Mensuel', amount: '300,000 F', date: '2025-05-01', category: 'Loyer' },
  { id: 3, reason: 'Service Nettoyage', amount: '50,000 F', date: '2025-04-30', category: 'Services' },
  { id: 4, reason: 'Salaire Employés', amount: '800,000 F', date: '2025-04-29', category: 'Salaires' },
  { id: 5, reason: 'Électricité', amount: '120,000 F', date: '2025-04-28', category: 'Utilitaires' },
]

export default function ExpensesScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Sorties de Caisse"
        subtitle="Enregistrez vos dépenses opérationnelles"
      />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* New Expense Card */}
        <Card variant="elevated" padding={20} style={styles.addCard}>
          <Text style={styles.addTitle}>Nouvelle Dépense</Text>
          <TextInput
            placeholder="Motif de la dépense"
            placeholderTextColor={BrandColors.textSecondary}
            style={styles.input}
          />
          <TextInput
            placeholder="Montant (F)"
            placeholderTextColor={BrandColors.textSecondary}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button
            variant="primary"
            size="md"
            label="Enregistrer"
            icon={<Plus size={16} color="#FFFFFF" />}
            fullWidth
            onPress={() => console.log('Add expense')}
          />
        </Card>

        {/* Expenses List */}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Dépenses Récentes</Text>
          <FlatList
            data={expenses}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card variant="elevated" padding={16}>
                <View style={styles.expenseHeader}>
                  <View style={styles.expenseInfo}>
                    <Text style={styles.expenseReason}>{item.reason}</Text>
                    <View style={styles.expenseMetadata}>
                      <Calendar size={12} color={BrandColors.textSecondary} />
                      <Text style={styles.expenseDate}>{item.date}</Text>
                      <Text style={styles.expenseCategory}>{item.category}</Text>
                    </View>
                  </View>
                  <Text style={styles.expenseAmount}>{item.amount}</Text>
                </View>
                <View style={styles.expenseActions}>
                  <TouchableOpacity>
                    <Trash2 size={18} color={BrandColors.danger} />
                  </TouchableOpacity>
                </View>
              </Card>
            )}
          />
        </View>
      </ScrollView>
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
  addCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    gap: 12,
  },
  addTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: BrandColors.bgSecondary,
    borderWidth: 1,
    borderColor: BrandColors.borderLight,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: BrandColors.textPrimary,
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  listTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseReason: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
    marginBottom: 8,
  },
  expenseMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expenseDate: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: BrandColors.textSecondary,
    marginRight: 8,
  },
  expenseCategory: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: BrandColors.primary,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.md,
  },
  expenseAmount: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: BrandColors.danger,
  },
  expenseActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BrandColors.borderLight,
  },
})
                 <Text color="white" fow="900">VALIDER LA DÉPENSE</Text>
              </Button>
           </YStack>
        </Card>

        <YStack gap="$5">
           <XStack jc="space-between" ai="center">
              <Text color="white" fsz={18} fow="900">Derniers Achats</Text>
              <Calendar size={20} color={BrandColors.textSecondary} />
           </XStack>

           {[
             { title: 'Marché - Légumes', amount: '25,000 F', date: 'Aujourd\'hui' },
             { title: 'Facture CIE', amount: '145,000 F', date: 'Hier' },
             { title: 'Maintenance Gaz', amount: '12,000 F', date: '01 Mai' }
           ].map((expense, i) => (
              <XStack key={i} jc="space-between" ai="center" p="$4" bg={BrandColors.card} br={22} bw={1} bc="rgba(255,255,255,0.03)">
                 <XStack gap="$3" ai="center">
                    <View bg="rgba(239, 68, 68, 0.1)" p="$3" br={14}>
                       <ShoppingCart size={20} color={BrandColors.danger} />
                    </View>
                    <YStack>
                       <Text color="white" fow="800" fsz={15}>{expense.title}</Text>
                       <Text color={BrandColors.textSecondary} fsz={11}>{expense.date}</Text>
                    </YStack>
                 </XStack>
                 <Text color={BrandColors.danger} fow="900" fsz={15}>-{expense.amount}</Text>
              </XStack>
           ))}
        </YStack>
      </ScrollView>
    </View>
  )
}
