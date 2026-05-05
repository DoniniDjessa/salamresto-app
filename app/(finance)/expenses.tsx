import { useState, useEffect } from 'react'
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { ShoppingCart, Calendar, Plus, Trash2 } from 'lucide-react-native'
import { BrandColors, FONTS, RADIUS } from '../../constants/theme'
import { ScreenHeader } from '../../components/ScreenHeader'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { supabase } from '../../lib/supabase'

export default function ExpensesScreen() {
  const [loading, setLoading] = useState(true)
  const [expenses, setExpenses] = useState<any[]>([])

  useEffect(() => {
    fetchExpenses()
  }, [])

  async function fetchExpenses() {
    const { data } = await supabase
      .from('resto-expenses')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setExpenses(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={BrandColors.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Dépenses & Achats"
        subtitle="Suivez vos sorties de caisse"
        showBack={false}
      />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.actionContainer}>
          <Button
            variant="primary"
            label="Ajouter une dépense"
            icon={<Plus size={20} color="#FFFFFF" />}
            fullWidth
            onPress={() => console.log('Add expense')}
          />
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Derniers Achats</Text>
            <Calendar size={20} color={BrandColors.textSecondary} />
          </View>

          <View style={styles.expenseList}>
            {expenses.map((expense) => (
              <Card key={expense.id} variant="elevated" padding={16} style={styles.expenseCard}>
                <View style={styles.expenseHeader}>
                  <View style={styles.iconContainer}>
                    <ShoppingCart size={20} color={BrandColors.danger} />
                  </View>
                  <View style={styles.expenseInfo}>
                    <Text style={styles.expenseTitle}>{expense.title}</Text>
                    <View style={styles.metaRow}>
                      <Text style={styles.expenseDate}>{new Date(expense.created_at).toLocaleDateString()}</Text>
                      <View style={styles.dot} />
                      <Text style={styles.expenseCategory}>{expense.category}</Text>
                    </View>
                  </View>
                  <Text style={styles.expenseAmount}>-{expense.amount?.toLocaleString()} F</Text>
                </View>

                <View style={styles.expenseActions}>
                  <TouchableOpacity style={styles.deleteButton}>
                    <Trash2 size={18} color={BrandColors.textMuted} />
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
            {expenses.length === 0 && <Text style={styles.emptyText}>Aucune dépense enregistrée</Text>}
          </View>
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  actionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionContainer: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
  },
  expenseList: {
    gap: 12,
  },
  expenseCard: {
    marginBottom: 4,
  },
  expenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  expenseDate: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: BrandColors.textSecondary,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: BrandColors.textMuted,
  },
  expenseCategory: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: BrandColors.primary,
    textTransform: 'uppercase',
  },
  expenseAmount: {
    fontSize: 15,
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
  deleteButton: {
    padding: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: BrandColors.textMuted,
    fontFamily: FONTS.medium,
    marginTop: 20,
  }
})
