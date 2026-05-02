import { ScrollView, View, StyleSheet } from 'react-native'
import { ScreenHeader } from '../../components/ScreenHeader'
import { SectionHeader } from '../../components/SectionHeader'
import { TaskCard } from '../../components/TaskCard'
import { Button } from '../../components/Button'
import { BrandColors } from '../../constants/theme'
import { Plus } from 'lucide-react-native'

export default function OrdersScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title="Commandes"
        action={
          <Button
            variant="primary"
            size="sm"
            label="Nouvelle"
            icon={<Plus size={16} color="#FFFFFF" />}
            onPress={() => console.log('New order')}
          />
        }
      />

      <SectionHeader title="En cours" />
      <View style={styles.tasksContainer}>
        <TaskCard
          title="3x Salade Chef"
          description="Table 3 - Sans oignons"
          tableId="3"
          status="pending"
          time="5 min"
          action={
            <Button
              variant="primary"
              size="sm"
              label="Envoyer cuisine"
              onPress={() => console.log('Send to kitchen')}
            />
          }
        />
        <TaskCard
          title="2x Burger + Frites"
          description="Table 5"
          tableId="5"
          status="pending"
          time="3 min"
          action={
            <Button
              variant="primary"
              size="sm"
              label="Envoyer cuisine"
              onPress={() => console.log('Send to kitchen')}
            />
          }
        />
        <TaskCard
          title="1x Pâtes Carbonara"
          description="Table 7 - Bien cuit"
          tableId="7"
          status="urgent"
          time="8 min"
          action={
            <Button
              variant="danger"
              size="sm"
              label="Urgent !"
              onPress={() => console.log('Mark urgent')}
            />
          }
        />
      </View>

      <SectionHeader title="Complétées" />
      <View style={styles.tasksContainer}>
        <TaskCard
          title="4x Couscous Merguez"
          description="Table 1"
          tableId="1"
          status="completed"
          time="Il y a 15 min"
          action={
            <Button
              variant="secondary"
              size="sm"
              label="Servir"
              onPress={() => console.log('Serve')}
            />
          }
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
