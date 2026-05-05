import { useState, useEffect } from 'react'
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Bell, Clock, Info, CheckCircle, AlertTriangle, Trash2, ChevronLeft } from 'lucide-react-native'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'
import { ScreenHeader } from '../components/ScreenHeader'
import { Card } from '../components/Card'
import { supabase } from '../lib/supabase'
import { router } from 'expo-router'

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
    // Subscribe to new orders or status changes to simulate real-time notifications
    const channel = supabase.channel('notif-center')
      .on('postgres_changes', { event: 'INSERT', table: 'resto-orders', schema: 'public' }, (payload) => {
        addNotification('Nouvelle Commande', `Une nouvelle commande #${payload.new.id.slice(0,4)} vient d'être reçue.`, 'info')
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchNotifications = () => {
    // In a real app, we might have a 'resto-notifications' table
    // For now, let's derive some from 'resto-orders' to show something meaningful
    setLoading(true)
    supabase.from('resto-orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) {
          const derived = data.map(o => ({
            id: o.id,
            title: o.type === 'external' ? 'Livraison' : 'Nouvelle Table',
            message: o.type === 'external' ? `Commande client: ${o.customername}` : `Commande pour la Table ${o.tablenumber}`,
            time: new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date(o.created_at).toLocaleDateString(),
            type: o.status === 'en_attente' ? 'info' : (o.status === 'livre' ? 'success' : 'warning'),
            read: false
          }))
          setNotifications(derived)
        }
        setLoading(false)
      })
  }

  const addNotification = (title: string, message: string, type: string) => {
     const newNotif = {
        id: Math.random().toString(),
        title,
        message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString(),
        type,
        read: false
     }
     setNotifications(prev => [newNotif, ...prev])
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const NotificationItem = ({ item }: { item: any }) => (
    <Card variant="elevated" padding={16} style={[styles.notifCard, !item.read && styles.unreadCard]}>
      <View style={styles.notifHeader}>
        <View style={[styles.iconContainer, { backgroundColor: item.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : item.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(99, 102, 241, 0.1)' }]}>
          {item.type === 'success' ? <CheckCircle size={18} color={BrandColors.success} /> : 
           item.type === 'warning' ? <AlertTriangle size={18} color={BrandColors.warning} /> : 
           <Info size={18} color={BrandColors.primary} />}
        </View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.notifTitle}>{item.title}</Text>
            <Text style={styles.notifTime}>{item.time}</Text>
          </View>
          <Text style={styles.notifMessage}>{item.message}</Text>
        </View>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </Card>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={BrandColors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>{notifications.filter(n => !n.read).length} nouveaux messages</Text>
        </View>
        <TouchableOpacity style={styles.clearBtn} onPress={clearAll}>
           <Trash2 size={20} color={BrandColors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.actionText}>Tout marquer comme lu</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={BrandColors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <NotificationItem item={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBg}>
                <Bell size={40} color={BrandColors.textMuted} />
              </View>
              <Text style={styles.emptyText}>Aucune notification pour le moment</Text>
              <Text style={styles.emptySub}>Vos alertes importantes apparaîtront ici</Text>
            </View>
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: BrandColors.card,
    gap: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: BrandColors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BrandColors.borderLight,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: BrandColors.textSecondary,
  },
  clearBtn: {
    marginLeft: 'auto',
    padding: 8,
  },
  actionRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  actionText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: BrandColors.primary,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  notifCard: {
    marginBottom: 12,
    opacity: 0.8,
  },
  unreadCard: {
    opacity: 1,
    borderLeftWidth: 3,
    borderLeftColor: BrandColors.primary,
  },
  notifHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
  },
  notifTime: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: BrandColors.textMuted,
  },
  notifMessage: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: BrandColors.textSecondary,
    lineHeight: 18,
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BrandColors.primary,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: BrandColors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: BrandColors.textSecondary,
    textAlign: 'center',
  },
})
