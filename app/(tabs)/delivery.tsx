import { ScrollView, View, StyleSheet } from 'react-native'
import { ScreenHeader } from '../../components/ScreenHeader'
import { SectionHeader } from '../../components/SectionHeader'
import { TaskCard } from '../../components/TaskCard'
import { Button } from '../../components/Button'
import { BrandColors } from '../../constants/theme'
import { MapPin } from 'lucide-react-native'

export default function DeliveryScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title="Livraisons"
        subtitle="Gestion des courses"
      />

      <SectionHeader title="À faire" />
      <View style={styles.tasksContainer}>
        <TaskCard
          title="Livraison 5 Rue de la Paix"
          description="Commande Ahmed - 45€"
          status="pending"
          time="Départ : 15h30"
          action={
            <Button
              variant="primary"
              size="sm"
              label="Partir"
              icon={<MapPin size={16} color="#FFFFFF" />}
              onPress={() => console.log('Start delivery')}
            />
          }
        />
        <TaskCard
          title="Livraison 12 Avenue Central"
          description="Commande Fatima - 60€"
          status="pending"
          time="Départ : 16h00"
          action={
            <Button
              variant="primary"
              size="sm"
              label="Partir"
              icon={<MapPin size={16} color="#FFFFFF" />}
              onPress={() => console.log('Start delivery')}
            />
          }
        />
      </View>

      <SectionHeader title="En cours" />
      <View style={styles.tasksContainer}>
        <TaskCard
          title="Livraison 8 Boulevard Nord"
          description="Commande Jean - 35€"
          status="pending"
          time="Départ : 15h05"
          action={
            <Button
              variant="primary"
              size="sm"
              label="Livrée"
              onPress={() => console.log('Mark delivered')}
            />
          }
        />
      </View>

      <SectionHeader title="Complétées aujourd'hui" />
      <View style={styles.tasksContainer}>
        <TaskCard
          title="Livraison 3 Rue de l'Église"
          description="Commande Marie - 50€"
          status="completed"
          time="15h20"
        />
        <TaskCard
          title="Livraison 22 Boulevard Sud"
          description="Commande Ali - 40€"
          status="completed"
          time="14h45"
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.bg,
  },
  tasksContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
})
