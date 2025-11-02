import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { useAppState } from '../src/context/AppStateContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { appState, clearAllData, resetDecision, updateDecision } = useAppState();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingDecision, setEditingDecision] = useState('');

  const handleClearData = () => {
    Alert.alert(
      'حذف تصمیم و تاریخچه',
      'آیا مطمئن هستید که می‌خواهید تصمیم فعلی و تمام تاریخچه را حذف کنید؟ این عمل قابل بازگشت نیست.',
      [
        { text: 'لغو', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            // ابتدا داده‌ها را حذف کن
            await clearAllData();
            
            // سپس مستقیماً به صفحه اصلی برو (بدون Alert اضافی)
            router.navigate('/');
          }
        }
      ]
    );
  };

  const handleOpenEditModal = () => {
    setEditingDecision(appState.currentDecision || '');
    setIsEditModalVisible(true);
  };

  const handleSaveDecision = async () => {
    if (editingDecision.trim()) {
      // ابتدا تصمیم را به‌روزرسانی کن
      await updateDecision(editingDecision.trim());
      setIsEditModalVisible(false);
      
      // سپس به صفحه اصلی برو (بدون Alert اضافی)
      router.navigate('/');
    } else {
      Alert.alert('خطا', 'لطفاً متن تصمیم را وارد کنید.');
    }
  };

  const handleCloseModal = () => {
    setIsEditModalVisible(false);
    setEditingDecision('');
  };



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>تنظیمات</Text>
        <Text style={styles.subtitle}>شخصی‌سازی اپلیکیشن</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* اطلاعات اپ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="info" size={24} color="#2196F3" />
            <Text style={styles.sectionTitle}>اطلاعات اپلیکیشن</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>{Constants.expoConfig?.version ?? Constants.manifest?.version ?? '1.0.0'}</Text>
            <Text style={styles.infoLabel}>نسخه:</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>{appState.pauseRecords.length}</Text>
            <Text style={styles.infoLabel}>کل تلاش‌ها:</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>
              {appState.hasSetDecision ? 
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" /> : 
                <MaterialIcons name="cancel" size={16} color="#F44336" />
              }
              <Text style={{ marginLeft: 4 }}>
                {appState.hasSetDecision ? 'ثبت شده' : 'ثبت نشده'}
              </Text>
            </Text>
            <Text style={styles.infoLabel}>تصمیم فعلی:</Text>
          </View>
        </View>

        {/* ویرایش */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="edit-3" size={24} color="#4CAF50" />
            <Text style={styles.sectionTitle}>ویرایش</Text>
          </View>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleOpenEditModal}>
            <View style={styles.actionButtonContent}>
              <Feather name="edit" size={20} color="#4CAF50" />
              <View style={styles.actionButtonTextContainer}>
                <Text style={styles.actionButtonText}>ویرایش تصمیم</Text>
                <Text style={styles.actionButtonDesc}>تصمیم جدیدی ثبت کنید</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.dangerButton]} 
            onPress={handleClearData}
          >
            <View style={styles.actionButtonContent}>
              <MaterialIcons name="delete-forever" size={20} color="#F44336" />
              <View style={styles.actionButtonTextContainer}>
                <Text style={[styles.actionButtonText, styles.dangerText]}>حذف تصمیم و تاریخچه</Text>
                <Text style={styles.actionButtonDesc}>تصمیم و تمام تاریخچه حذف خواهد شد</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* حریم خصوصی */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="security" size={24} color="#9C27B0" />
            <Text style={styles.sectionTitle}>حریم خصوصی</Text>
          </View>
          <Text style={styles.privacyText}>
            تمام اطلاعات شما فقط روی گوشی ذخیره می‌شود و هیچ‌گاه به سرور ارسال نمی‌گردد.
          </Text>
        </View>
  </ScrollView>

  {/* Modal ویرایش تصمیم */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>ویرایش تصمیم</Text>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.modalTextInput}
              value={editingDecision}
              onChangeText={setEditingDecision}
              placeholder="تصمیم خود را وارد کنید"
              multiline
              textAlign="right"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={handleCloseModal}
              >
                <Text style={styles.cancelButtonText}>لغو</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleSaveDecision}
              >
                <Text style={styles.saveButtonText}>ذخیره</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#607D8B',
    paddingTop: 24,
    paddingBottom: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    opacity: 0.95,
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
    marginRight: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    textAlign: 'right',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'right',
  },
  actionButton: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  actionButtonContent: { flexDirection: 'row', alignItems: 'center' },
  actionButtonTextContainer: { flex: 1, alignItems: 'flex-end' },
  dangerButton: {
    borderColor: '#dc3545',
    backgroundColor: '#f8d7da',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'right',
  },
  dangerText: {
    color: '#dc3545',
  },
  actionButtonDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },

  privacyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    textAlign: 'right',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  modalTextInput: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});