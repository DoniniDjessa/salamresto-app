import { View, Text, StyleSheet } from 'react-native'
import { BrandColors, FONTS } from '../constants/theme'
import { ScreenHeader } from '../components/ScreenHeader'

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Paramètres" subtitle="Configuration de l'application" />
      <View style={styles.content}>
        <Text style={styles.text}>Paramètres bientôt disponibles</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BrandColors.bg },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { color: BrandColors.textSecondary, fontFamily: FONTS.medium }
})
