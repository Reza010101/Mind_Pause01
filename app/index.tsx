import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppState } from '../src/hooks/useAppState';

export default function HomeScreen() {
  const router = useRouter();
  const { appState, loading, setDecision, startPause } = useAppState();
  const [tempDecision, setTempDecision] = useState('');

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>در حال بارگذاری...</Text>
      </View>
    );
  }

  const handleSaveDecision = () => {
    if (tempDecision.trim()) {
      setDecision(tempDecision.trim());
      setTempDecision('');
    } else {
      Alert.alert('توجه', 'لطفاً تصمیم خود را بنویسید');
    }
  };

  const handleStartPause = () => {
    const recordId = startPause();
    router.push(`/timer?recordId=${recordId}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>جدا از ذهن</Text>
        <Text style={styles.subtitle}>فضای مکث برای تصمیم‌های آگاهانه</Text>
      </View>

      <View style={styles.content}>
        {!appState.hasSetDecision ? (
          // بخش ثبت تصمیم
          <View style={styles.decisionSection}>
            <Text style={styles.sectionTitle}>تصمیم من:</Text>
            <TextInput
              style={styles.decisionInput}
              placeholder="مثال: تصمیم گرفتم سیگار نکشم"
              value={tempDecision}
              onChangeText={setTempDecision}
              multiline
              textAlign="right"
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveDecision}>
              <Text style={styles.saveButtonText}>ثبت تصمیم</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // نمایش تصمیم ثبت شده + دکمه اصلی
          <View style={styles.decisionDisplay}>
            <Text style={styles.sectionTitle}>تصمیم من:</Text>
            <View style={styles.decisionCard}>
              <Text style={styles.decisionText}>{appState.currentDecision}</Text>
            </View>
            
            <TouchableOpacity style={styles.mainButton} onPress={handleStartPause}>
              <Text style={styles.mainButtonText}>ذهنم می‌گه انجامش بده</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* آمار سریع */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>امروز</Text>
          <Text style={styles.statsText}>{appState.todayAttempts} بار تلاش</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
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
  decisionSection: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  decisionDisplay: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  decisionInput: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 80,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  decisionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  decisionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'right',
  },
  mainButton: {
    backgroundColor: '#FF5722',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    boxShadow: '0 4px 12px rgba(255, 87, 34, 0.3)',
  },
  mainButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  statsTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});