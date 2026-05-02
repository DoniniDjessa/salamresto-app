import { ScrollView, View, StyleSheet } from 'react-native'
import { Wallet, TrendingUp, TrendingDown, PieChart, ArrowUpRight } from 'lucide-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'
import { ScreenHeader } from '../components/ScreenHeader'
import { Card } from '../components/Card'
import { StatCard } from '../components/StatCard'
import { Text } from 'react-native'

export default function AccountingScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Comptabilité"
        subtitle="Rapports financiers consolidés"
      />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Total Profit Card */}
        <View style={styles.heroCard}>
          <LinearGradient
            colors={[BrandColors.primary, BrandColors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroText}>
                <Text style={styles.heroLabel}>PROFIT NET TOTAL</Text>
                <Text style={styles.heroValue}>2.4M F</Text>
              </View>
              <View style={styles.heroIcon}>
                <ArrowUpRight size={24} color="white" />
              </View>
            </View>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>+18.5% VS MOIS DERNIER</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <StatCard
            icon={<TrendingUp size={24} color={BrandColors.success} />}
            label="Revenus"
            value="4.2M F"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            icon={<TrendingDown size={24} color={BrandColors.danger} />}
            label="Dépenses"
            value="1.8M F"
            trend={{ value: -5, isPositive: false }}
          />
        </View>

        {/* Cost Breakdown */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Répartition des Coûts</Text>
          <Card variant="elevated" padding={20}>
            <View style={styles.costItems}>
              <CostItem label="Matière première" value="45%" percentage={45} />
              <CostItem label="Salaires" value="35%" percentage={35} />
              <CostItem label="Loyer" value="12%" percentage={12} />
              <CostItem label="Autres" value="8%" percentage={8} />
            </View>
          </Card>
        </View>

        {/* Recent Transactions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Transactions Récentes</Text>
          <Card variant="elevated" padding={16}>
            <TransactionItem label="Paiement Fournisseur" amount="-250,000 F" isExpense />
            <TransactionItem label="Vente Diner" amount="+180,000 F" isExpense={false} />
            <TransactionItem label="Loyer Mensuel" amount="-300,000 F" isExpense />
            <TransactionItem label="Vente Déjeuner" amount="+420,000 F" isExpense={false} />
          </Card>
        </View>
      </ScrollView>
    </View>
  )
}

function CostItem({ label, value, percentage }: any) {
  return (
    <View style={styles.costItem}>
      <View style={styles.costLabel}>
        <Text style={styles.costLabelText}>{label}</Text>
        <Text style={styles.costValue}>{value}</Text>
      </View>
      <View style={styles.costBar}>
        <View
          style={[
            styles.costBarFill,
            { width: `${percentage}%`, backgroundColor: BrandColors.primary },
          ]}
        />
      </View>
    </View>
  )
}

function TransactionItem({ label, amount, isExpense }: any) {
  const amountColor = isExpense ? BrandColors.danger : BrandColors.success
  return (
    <View style={styles.transactionRow}>
      <View style={styles.transactionLabel}>
        <View style={[styles.transactionIcon, { backgroundColor: isExpense ? '#FEE2E2' : '#D1FAE5' }]}>
          <Wallet size={16} color={amountColor} />
        </View>
        <Text style={styles.transactionText}>{label}</Text>
      </View>
      <Text style={[styles.transactionAmount, { color: amountColor }]}>{amount}</Text>
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
  heroCard: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  heroGradient: {
    padding: 24,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroText: {
    flex: 1,
  },
  heroLabel: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroValue: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
  },
  heroIcon: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  heroBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
  },
  metricsGrid: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
    marginBottom: 12,
  },
  costItems: {
    gap: 16,
  },
  costItem: {
    gap: 8,
  },
  costLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  costLabelText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: BrandColors.textSecondary,
  },
  costValue: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
  },
  costBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  costBarFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
  },
  transactionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: BrandColors.textPrimary,
  },
  transactionAmount: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
})
