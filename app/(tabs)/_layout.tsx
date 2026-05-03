import { Tabs } from 'expo-router'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { LayoutDashboard, Utensils, Truck, ChefHat } from 'lucide-react-native'
import { BrandColors, FONTS, RADIUS } from '../../constants/theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'

const TAB_META: Record<string, { icon: any; label: string }> = {
  index: { icon: LayoutDashboard, label: 'Accueil' },
  orders: { icon: Utensils, label: 'Commandes' },
  kitchen: { icon: ChefHat, label: 'Cuisine' },
  delivery: { icon: Truck, label: 'Livraisons' },
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets()
  
  // Gradient using salamresto violet
  const GRADIENT = [BrandColors.primary, BrandColors.secondary]

  return (
    <View 
      style={[
        styles.barWrapper, 
        { paddingBottom: Math.max(insets.bottom, 16) + 10 }
      ]} 
      pointerEvents="box-none"
    >
      <View style={[styles.bar, { overflow: 'hidden' }]}>
        <LinearGradient
          colors={GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        {state.routes.map((route: any, index: number) => {
          const meta = TAB_META[route.name]
          if (!meta) return null
          
          const isFocused = state.index === index
          const Icon = meta.icon

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true })
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          return (
            <TouchableOpacity 
              key={route.key} 
              style={styles.tab} 
              onPress={onPress} 
              activeOpacity={0.7}
            >
              <View style={styles.iconWrap}>
                <Icon
                  color={isFocused ? 'white' : 'rgba(255,255,255,0.5)'}
                  size={20}
                  strokeWidth={isFocused ? 2.5 : 1.8}
                />
              </View>
              <Text style={[
                styles.tabLabel, 
                { color: isFocused ? 'white' : 'rgba(255,255,255,0.5)' },
                isFocused && { fontFamily: FONTS.bold }
              ]}>
                {meta.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: BrandColors.bg }
      }}
    >
      <Tabs.Screen 
        name="index"
        options={{
          title: 'Accueil',
        }}
      />
      <Tabs.Screen 
        name="orders"
        options={{
          title: 'Commandes',
        }}
      />
      <Tabs.Screen 
        name="kitchen"
        options={{
          title: 'Cuisine',
        }}
      />
      <Tabs.Screen 
        name="delivery"
        options={{
          title: 'Livraisons',
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  barWrapper: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 100,
  },
  bar: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: RADIUS.xxl,
    height: 68,
    alignItems: 'center',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowRadius: 16,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconWrap: {
    width: 40,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  tabLabel: {
    fontFamily: FONTS.medium,
    fontSize: 9,
    letterSpacing: 0.1,
  },
})
