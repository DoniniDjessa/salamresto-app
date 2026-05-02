import { ScrollView, View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Users, UserPlus, ShieldCheck, Mail, Phone, MoreVertical } from 'lucide-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'
import { ScreenHeader } from '../components/ScreenHeader'
import { Button } from '../components/Button'
import { Card } from '../components/Card'

export default function ProfilesScreen() {
  const teamMembers = [
    { name: 'Issa Diop', role: 'Administrateur', avatar: '👔' },
    { name: 'Awa Ndiaye', role: 'Serveuse', avatar: '🥘' },
    { name: 'Moussa Faye', role: 'Livreur', avatar: '🛵' },
  ]

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Gestion d'Équipe"
        subtitle="Rôles et accès du personnel"
      />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.addButton}>
          <Button
            variant="primary"
            size="lg"
            label="Ajouter un membre"
            icon={<UserPlus size={20} color="#FFFFFF" />}
            fullWidth
            onPress={() => console.log('Add member')}
          />
        </View>

        <View style={styles.membersContainer}>
          {teamMembers.map((member, index) => (
            <Card key={index} variant="elevated" padding={16}>
              <View style={styles.memberHeader}>
                <View style={styles.avatarSection}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarEmoji}>{member.avatar}</Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <View style={styles.roleRow}>
                      <ShieldCheck size={12} color={BrandColors.primary} />
                      <Text style={styles.memberRole}>{member.role}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity>
                  <MoreVertical size={20} color={BrandColors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.actionButtons}>
                <Button
                  variant="secondary"
                  size="sm"
                  label="Appeler"
                  icon={<Phone size={14} color={BrandColors.textPrimary} />}
                  onPress={() => console.log('Call')}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  label="Message"
                  icon={<Mail size={14} color={BrandColors.textPrimary} />}
                  onPress={() => console.log('Message')}
                />
              </View>
            </Card>
          ))}
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
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  membersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 16,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
    marginBottom: 4,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberRole: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: BrandColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
})
