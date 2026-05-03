import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Drawer } from 'expo-router/drawer'
import { SplashScreen } from 'expo-router'
import { 
  useFonts, 
  Outfit_400Regular, 
  Outfit_500Medium, 
  Outfit_600SemiBold, 
  Outfit_700Bold 
} from '@expo-google-fonts/outfit'
import { Provider } from '../components/Provider'
import { 
  LayoutDashboard, 
  Utensils, 
  Users, 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  PieChart,
  LogOut,
  User,
  Settings,
  Monitor,
  Truck
} from 'lucide-react-native'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

SplashScreen.preventAutoHideAsync()

function CustomDrawerContent(props: any) {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  return (
    <View style={{ flex: 1, backgroundColor: BrandColors.bg }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: insets.top }}>
        {/* Header with Avatar */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <User color={BrandColors.primary} size={32} />
          </View>
          <View>
            <Text style={styles.userName}>Salamresto</Text>
            <Text style={styles.userRole}>Direction</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <DrawerItemList {...props} />

      </DrawerContentScrollView>

      {/* Footer with Logout */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={() => router.replace('/(auth)/login')}
        >
          <LogOut color={BrandColors.danger} size={20} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  })

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider>
        <Drawer
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerShown: false,
            drawerType: 'front',
            defaultStatus: 'closed',
            drawerActiveTintColor: BrandColors.primary,
            drawerInactiveTintColor: BrandColors.textSecondary,
            drawerStyle: {
              backgroundColor: BrandColors.bg,
              width: '75%',
            },
            drawerActiveBackgroundColor: `rgba(168, 85, 247, 0.1)`,
            drawerLabelStyle: {
              fontFamily: FONTS.semiBold,
              fontSize: 14,
              marginLeft: -10,
            },
            drawerItemStyle: {
              borderRadius: RADIUS.lg,
              marginHorizontal: 12,
              paddingHorizontal: 8,
            },
            sceneContainerStyle: { backgroundColor: BrandColors.bg },
          }}
        >
          <Drawer.Screen 
            name="(tabs)" 
            options={{ 
              drawerLabel: 'Tableau de Bord',
              drawerIcon: ({ color }) => <LayoutDashboard size={20} color={color} />,
            }} 
          />
          <Drawer.Screen 
            name="enregistrements" 
            options={{ 
              drawerLabel: 'Enregistrements',
              drawerIcon: ({ color }) => <Monitor size={20} color={color} />,
            }} 
          />
          <Drawer.Screen 
            name="kitchen" 
            options={{ 
              drawerLabel: 'Écran Cuisine',
              drawerIcon: ({ color }) => <Utensils size={20} color={color} />,
            }} 
          />
          <Drawer.Screen 
            name="tables" 
            options={{ 
              drawerLabel: 'Gestion Tables',
              drawerIcon: ({ color }) => <LayoutDashboard size={20} color={color} />,
            }} 
          />
          <Drawer.Screen 
            name="menu" 
            options={{ 
              drawerLabel: 'Menu',
              drawerIcon: ({ color }) => <Utensils size={20} color={color} />,
            }} 
          />
          <Drawer.Screen 
            name="profiles" 
            options={{ 
              drawerLabel: 'Équipe',
              drawerIcon: ({ color }) => <Users size={20} color={color} />,
            }} 
          />
          <Drawer.Screen 
            name="accounting" 
            options={{ 
              drawerLabel: 'Comptabilité',
              drawerIcon: ({ color }) => <Wallet size={20} color={color} />,
            }} 
          />
          <Drawer.Screen 
            name="expenses" 
            options={{ 
              drawerLabel: 'Dépenses',
              drawerIcon: ({ color }) => <CreditCard size={20} color={color} />,
            }} 
          />
          <Drawer.Screen 
            name="revenues" 
            options={{ 
              drawerLabel: 'Revenus',
              drawerIcon: ({ color }) => <TrendingUp size={20} color={color} />,
            }} 
          />
          <Drawer.Screen 
            name="analytics" 
            options={{ 
              drawerLabel: 'Analyses',
              drawerIcon: ({ color }) => <PieChart size={20} color={color} />,
            }} 
          />
          <Drawer.Screen 
            name="settings" 
            options={{ 
              drawerLabel: 'Paramètres',
              drawerIcon: ({ color }) => <Settings size={20} color={color} />,
            }} 
          />
        </Drawer>
      </Provider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  header: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 10,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.2)',
  },
  userName: {
    color: BrandColors.textPrimary,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  userRole: {
    color: BrandColors.primary,
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 12,
    marginBottom: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutText: {
    color: BrandColors.danger,
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
})
