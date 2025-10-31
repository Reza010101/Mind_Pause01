import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>تنظیمات</Text>
        <Text style={styles.subtitle}>شخصی‌سازی اپلیکیشن</Text>
      </View>
      
      <View style={styles.content}>
        {/* اطلاعات اپ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 اطلاعات اپلیکیشن</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>نسخه:</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>کل تلاش‌ها:</Text>
            <Text style={styles.infoValue}>{appState.pauseRecords.length}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>تصمیم فعلی:</Text>
            <Text style={styles.infoValue}>
              {appState.hasSetDecision ? '✅ ثبت شده' : '❌ ثبت نشده'}
            </Text>
          </View>
        </View>

        {/* ویرایش */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✏️ ویرایش</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleOpenEditModal}>
            <Text style={styles.actionButtonText}>ویرایش تصمیم</Text>
            <Text style={styles.actionButtonDesc}>تصمیم جدیدی ثبت کنید</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.dangerButton]} 
            onPress={handleClearData}
          >
            <Text style={[styles.actionButtonText, styles.dangerText]}>حذف تصمیم و تاریخچه</Text>
            <Text style={styles.actionButtonDesc}>تصمیم و تمام تاریخچه حذف خواهد شد</Text>
          </TouchableOpacity>
        </View>

        {/* حریم خصوصی */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔒 حریم خصوصی</Text>
          <Text style={styles.privacyText}>
            تمام اطلاعات شما فقط روی گوشی ذخیره می‌شود و هیچ‌گاه به سرور ارسال نمی‌گردد.
          </Text>
        </View>
      </View>

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
                <Text style={styles.closeButtonText}>✕</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#607D8B',
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'right',
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
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  actionButton: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
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