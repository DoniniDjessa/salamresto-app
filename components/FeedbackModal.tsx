import React from 'react'
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react-native'
import { BrandColors, FONTS, RADIUS } from '../constants/theme'
import { Button } from './Button'

interface FeedbackModalProps {
  visible: boolean
  type: 'success' | 'error' | 'info'
  title: string
  message: string
  onClose: () => void
  actionLabel?: string
  onAction?: () => void
}

export const FeedbackModal = ({ 
  visible, 
  type, 
  title, 
  message, 
  onClose, 
  actionLabel, 
  onAction 
}: FeedbackModalProps) => {
  const color = type === 'success' ? BrandColors.success : type === 'error' ? BrandColors.danger : BrandColors.primary
  const Icon = type === 'success' ? CheckCircle2 : type === 'error' ? AlertCircle : Info

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={[styles.iconBadge, { backgroundColor: `${color}20` }]}>
            <Icon size={40} color={color} />
          </View>
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <View style={styles.footer}>
            {actionLabel ? (
              <Button 
                variant="primary" 
                label={actionLabel} 
                onPress={onAction || onClose} 
                style={{ flex: 1, backgroundColor: color }} 
              />
            ) : (
              <TouchableOpacity style={[styles.closeBtn, { borderColor: color }]} onPress={onClose}>
                <Text style={[styles.closeBtnText, { color }]}>D'ACCORD</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    backgroundColor: BrandColors.card,
    borderRadius: RADIUS.xl,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BrandColors.borderLight,
  },
  iconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: BrandColors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
  },
  closeBtn: {
    flex: 1,
    height: 56,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  }
})
