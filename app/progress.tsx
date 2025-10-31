import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppState } from '../src/hooks/useAppState';

export default function ProgressScreen() {
  const { appState } = useAppState();

  // محاسبه نرخ موفقیت
  const getSuccessRate = () => {
    if (appState.pauseRecords.length === 0) return 0;
    const completedRecords = appState.pauseRecords.filter(record => record.endTime);
    return Math.round((completedRecords.length / appState.pauseRecords.length) * 100);
  };

  // محاسبه میانگین روزانه
  const getDailyAverage = () => {
    if (appState.pauseRecords.length === 0) return 0;
    
    const firstRecord = appState.pauseRecords[0];
    if (!firstRecord) return 0;
    
    const daysDiff = Math.ceil(
      (new Date().getTime() - firstRecord.startTime.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return Math.round((appState.pauseRecords.length / Math.max(daysDiff, 1)) * 10) / 10;
  };

  // محاسبه بهترین سری پیاپی
  const getBestStreak = () => {
    // این یک پیاده‌سازی ساده است - می‌توان پیچیده‌تر کرد
    return Math.min(appState.pauseRecords.length, 7); // فعلاً حداکثر 7
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>پیشرفت</Text>
        <Text style={styles.subtitle}>تحلیل عملکرد شما</Text>
      </View>
      
      <View style={styles.content}>
        {/* کارت‌های آماری */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{getSuccessRate()}%</Text>
            <Text style={styles.statLabel}>نرخ موفقیت</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{getDailyAverage()}</Text>
            <Text style={styles.statLabel}>میانگین روزانه</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{getBestStreak()}</Text>
            <Text style={styles.statLabel}>بهترین سری</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{appState.pauseRecords.length}</Text>
            <Text style={styles.statLabel}>کل تلاش‌ها</Text>
          </View>
        </View>

        {/* پیام‌های انگیزشی */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 انگیزه</Text>
          {appState.pauseRecords.length === 0 ? (
            <Text style={styles.motivationText}>
              شروع کردن مهم‌ترین قدم است. شما آماده‌اید! 💪
            </Text>
          ) : appState.pauseRecords.length < 5 ? (
            <Text style={styles.motivationText}>
              عالی! شما شروع کرده‌اید. هر تلاش یک پیروزی است! 🌟
            </Text>
          ) : appState.pauseRecords.length < 20 ? (
            <Text style={styles.motivationText}>
              فوق‌العاده! شما در مسیر درستی هستید. ادامه دهید! 🚀
            </Text>
          ) : (
            <Text style={styles.motivationText}>
              واو! شما یک قهرمان واقعی هستید. الگویی برای دیگران! 🏆
            </Text>
          )}
        </View>

        {/* نکات بهبود */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 نکات بهبود</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipTitle}>• ثبات مهم است</Text>
            <Text style={styles.tipText}>هر روز حداقل یک بار از اپ استفاده کنید</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipTitle}>• صبر کلید موفقیت است</Text>
            <Text style={styles.tipText}>در طول 60 ثانیه با ذهن مذاکره نکنید</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipTitle}>• تصمیم خود را یادآوری کنید</Text>
            <Text style={styles.tipText}>دلایل تصمیم‌تان را همیشه در ذهن داشته باشید</Text>
          </View>
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
  header: {
    backgroundColor: '#FF9800',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
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
  motivationText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FF9800',
    textAlign: 'center',
    fontWeight: '500',
  },
  tipItem: {
    marginBottom: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'right',
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'right',
  },
});