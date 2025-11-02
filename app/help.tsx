import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons, Feather, AntDesign, Ionicons } from '@expo/vector-icons';

export default function HelpScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>راهنما</Text>
        <Text style={styles.subtitle}>نحوه استفاده از اپلیکیشن</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="psychology" size={24} color="#2196F3" />
            <Text style={styles.sectionTitle}>فلسفه اپ</Text>
          </View>
          <Text style={styles.text}>
            هدف این اپ ایجاد «فضای مکث» در مواجهه با عادت‌های مضر است.
            {'\n\n'}
            چرخه عادت: محرک ← هوس ذهنی ← عمل ← پاداش
            {'\n\n'}
            شما این چرخه را با ایجاد مکث آگاهانه قطع می‌کنید.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="edit-3" size={24} color="#4CAF50" />
            <Text style={styles.sectionTitle}>مرحله 1: ثبت تصمیم</Text>
          </View>
          <Text style={styles.text}>
            ابتدا تصمیم خود را به صورت مثبت بنویسید.
            {'\n'}
            مثال: "تصمیم گرفتم سیگار نکشم"
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="timer" size={24} color="#FF9800" />
            <Text style={styles.sectionTitle}>مرحله 2: مکث 60 ثانیه</Text>
          </View>
          <Text style={styles.text}>
            وقتی هوس به سراغتان آمد، دکمه "ذهنم می‌گه انجامش بده" را بزنید.
            {'\n\n'}
            60 ثانیه صبر کنید و پیام‌های هدایت‌گر را بخوانید.
            {'\n\n'}
            در این مدت با ذهن مذاکره نکنید، فقط صبر کنید.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="trending-up" size={24} color="#9C27B0" />
            <Text style={styles.sectionTitle}>پیگیری پیشرفت</Text>
          </View>
          <Text style={styles.text}>
            هر بار که موفق به مقاومت شوید، در آمار ثبت می‌شود.
            {'\n\n'}
            پیشرفت خود را در تب "پیشرفت" مشاهده کنید.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
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
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    textAlign: 'right',
  },
});