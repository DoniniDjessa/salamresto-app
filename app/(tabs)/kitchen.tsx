import { ScrollView, View, StyleSheet } from 'react-native'
import { ScreenHeader } from '../../components/ScreenHeader'
import { SectionHeader } from '../../components/SectionHeader'
import { TaskCard } from '../../components/TaskCard'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { BrandColors } from '../../constants/theme'
import { Clock } from 'lucide-react-native'

export default function KitchenScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title="Écran Cuisine"
        subtitle="KDS - Kitchen Display System"
      />

      <SectionHeader title="À préparer" />
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
              label="Prêt"
              onPress={() => console.log('Ready')}
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
              label="Prêt"
              onPress={() => console.log('Ready')}
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
              label="URGENT"
              onPress={() => console.log('Ready')}
            />
          }
        />
      </View>

      <SectionHeader title="Prêtes à servir" />
      <View style={styles.tasksContainer}>
        <TaskCard
          title="4x Couscous Merguez"
          description="Table 1"
          tableId="1"
          status="completed"
          time="Il y a 2 min"
          action={
            <Button
              variant="secondary"
              size="sm"
              label="Servi"
              onPress={() => console.log('Served')}
            />
          }
        />
        <TaskCard
          title="2x Pizza Margherita"
          description="Table 4"
          tableId="4"
          status="completed"
          time="Il y a 1 min"
          action={
            <Button
              variant="secondary"
              size="sm"
              label="Servi"
              onPress={() => console.log('Served')}
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
