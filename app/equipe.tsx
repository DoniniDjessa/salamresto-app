import { useState, useEffect } from 'react'
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, FlatList, Image } from 'react-native'
import { Users, Phone, Mail, ChevronRight, UserCircle } from 'lucide-react-native'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'
import { ScreenHeader } from '../components/ScreenHeader'
import { Card } from '../components/Card'
import { supabase } from '../lib/supabase'

export default function EquipeScreen() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
    const channel = supabase.channel('equipe-sync')
      .on('postgres_changes', { event: '*', table: 'resto-users', schema: 'public' }, () => {
        fetchUsers()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchUsers() {
    const { data } = await supabase
      .from('resto-users')
      .select('*')
      .order('name', { ascending: true })
    
    if (data) setUsers(data)
    setLoading(false)
  }

  const renderUser = ({ item }: { item: any }) => (
    <Card variant="elevated" padding={16} style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.avatarContainer}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.placeholderAvatar}>
              <Text style={styles.placeholderText}>{item.name?.[0]?.toUpperCase()}</Text>
            </View>
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <View style={styles.roleBadge}>
             <Text style={styles.roleText}>{item.role?.toUpperCase()}</Text>
          </View>
        </View>
        <ChevronRight size={20} color={BrandColors.textMuted} />
      </View>

      <View style={styles.userStats}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>SALAIRE BASE</Text>
          <Text style={styles.statValue}>{item.baseSalary?.toLocaleString() || 0} F</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>ANCIENNETÉ</Text>
          <Text style={styles.statValue}>{new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.contactRow}>
         <View style={styles.contactItem}>
            <Phone size={14} color={BrandColors.primary} />
            <Text style={styles.contactText}>{item.phone || 'Non renseigné'}</Text>
         </View>
         <View style={styles.contactItem}>
            <Mail size={14} color={BrandColors.primary} />
            <Text style={styles.contactText} numberOfLines={1}>{item.email || 'Pas d\'email'}</Text>
         </View>
      </View>
    </Card>
  )

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Gestion Équipe"
        subtitle="Membres du personnel Salam Resto"
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={BrandColors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={users}
          contentContainerStyle={styles.listContainer}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUser}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Users size={48} color={BrandColors.textMuted} style={{ marginBottom: 12 }} />
              <Text style={styles.emptyText}>Aucun membre trouvé</Text>
            </View>
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BrandColors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: 16, gap: 16 },
  userCard: { marginBottom: 4 },
  userHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  avatarContainer: { width: 56, height: 56, borderRadius: 28, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)' },
  avatar: { width: '100%', height: '100%' },
  placeholderAvatar: { flex: 1, backgroundColor: BrandColors.primary, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 22, fontFamily: FONTS.bold, color: 'white' },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontFamily: FONTS.bold, color: BrandColors.textPrimary, marginBottom: 4 },
  roleBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, backgroundColor: 'rgba(168, 85, 247, 0.1)', borderRadius: RADIUS.sm },
  roleText: { fontSize: 9, fontFamily: FONTS.bold, color: BrandColors.primary, letterSpacing: 1 },
  userStats: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: RADIUS.md, padding: 12, marginBottom: 16 },
  statBox: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 9, fontFamily: FONTS.medium, color: BrandColors.textMuted, marginBottom: 4 },
  statValue: { fontSize: 13, fontFamily: FONTS.bold, color: BrandColors.textPrimary },
  statDivider: { width: 1, backgroundColor: BrandColors.borderLight, marginHorizontal: 12 },
  contactRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  contactItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  contactText: { fontSize: 11, fontFamily: FONTS.medium, color: BrandColors.textSecondary },
  emptyContainer: { paddingVertical: 80, alignItems: 'center' },
  emptyText: { color: BrandColors.textMuted, fontFamily: FONTS.medium }
})
