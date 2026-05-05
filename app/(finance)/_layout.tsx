import { Tabs } from 'expo-router'
import { BrandColors, FONTS } from '../../constants/theme'
import { TrendingUp, CreditCard } from 'lucide-react-native'

export default function FinanceLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: BrandColors.primary,
        tabBarInactiveTintColor: BrandColors.textSecondary,
        tabBarStyle: {
          backgroundColor: BrandColors.bg,
          borderTopColor: BrandColors.borderLight,
          height: 60,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.semiBold,
          fontSize: 12,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Revenus',
          tabBarIcon: ({ color, size }) => <TrendingUp size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Dépenses',
          tabBarIcon: ({ color, size }) => <CreditCard size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
