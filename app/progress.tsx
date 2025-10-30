import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  // Mock data - این داده‌ها بعداً از AsyncStorage یا یک state manager می‌آیند
  const progressData = {
    totalDays: 15,
    longestStreak: 30,
    totalSaved: 450000, // تومان
    healthImprovements: [
      { title: 'بهبود تنفس', achieved: true },
      { title: 'کاهش بوی دهان', achieved: true },
      { title: 'افزایش انرژی', achieved: false },
      { title: 'بهبود طعم غذا', achieved: false },
    ]
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{progressData.totalDays}</Text>
          <Text style={styles.statLabel}>روز بدون سیگار</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{progressData.longestStreak}</Text>
          <Text style={styles.statLabel}>بهترین رکورد</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>پول صرفه‌جویی شده</Text>
        <Text style={styles.moneyAmount}>
          {progressData.totalSaved.toLocaleString('fa-IR')} تومان
        </Text>
        <Text style={styles.moneyDescription}>
          در {progressData.totalDays} روز گذشته
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>بهبودهای سلامتی</Text>
        {progressData.healthImprovements.map((improvement, index) => (
          <View key={index} style={styles.improvementItem}>
            <Text style={styles.improvementIcon}>
              {improvement.achieved ? '✅' : '⏳'}
            </Text>
            <Text style={[
              styles.improvementText,
              improvement.achieved ? styles.achievedText : styles.pendingText
            ]}>
              {improvement.title}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>نکات انگیزشی</Text>
        <View style={styles.motivationItem}>
          <Text style={styles.motivationText}>
            💪 شما در راه درستی قدم برمی‌دارید!
          </Text>
        </View>
        <View style={styles.motivationItem}>
          <Text style={styles.motivationText}>
            🌟 هر روز بدون سیگار، یک پیروزی کوچک است.
          </Text>
        </View>
        <View style={styles.motivationItem}>
          <Text style={styles.motivationText}>
            💰 پول صرفه‌جویی شده را روی چیز مفیدی خرج کنید.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginHorizontal: 7.5,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  moneyAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 5,
  },
  moneyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  improvementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  improvementIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  improvementText: {
    fontSize: 16,
    flex: 1,
  },
  achievedText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  pendingText: {
    color: '#666',
  },
  motivationItem: {
    backgroundColor: '#E8F5E8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  motivationText: {
    fontSize: 14,
    color: '#2E7D32',
    textAlign: 'right',
    lineHeight: 20,
  },
});