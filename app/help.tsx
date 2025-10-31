import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HelpScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>راهنما</Text>
        <Text style={styles.subtitle}>نحوه استفاده از اپلیکیشن</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 فلسفه اپ</Text>
          <Text style={styles.text}>
            هدف این اپ ایجاد «فضای مکث» در مواجهه با عادت‌های مضر است.
            {'\n\n'}
            چرخه عادت: محرک → هوس ذهنی → عمل → پاداش
            {'\n\n'}
            ما این چرخه را با ایجاد مکث آگاهانه قطع می‌کنیم.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 مرحله 1: ثبت تصمیم</Text>
          <Text style={styles.text}>
            ابتدا تصمیم خود را به صورت مثبت بنویسید.
            {'\n'}
            مثال: "تصمیم گرفتم سیگار نکشم"
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏰ مرحله 2: مکث 60 ثانیه</Text>
          <Text style={styles.text}>
            وقتی هوس به سراغتان آمد، دکمه "ذهنم می‌گه انجامش بده" را بزنید.
            {'\n\n'}
            60 ثانیه صبر کنید و پیام‌های هدایت‌گر را بخوانید.
            {'\n\n'}
            در این مدت با ذهن مذاکره نکنید، فقط صبر کنید.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 پیگیری پیشرفت</Text>
          <Text style={styles.text}>
            هر بار که موفق به مقاومت شوید، در آمار ثبت می‌شود.
            {'\n\n'}
            پیشرفت خود را در تب "پیشرفت" مشاهده کنید.
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
  },
  header: {
    backgroundColor: '#2196F3',
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
    marginBottom: 12,
    textAlign: 'right',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    textAlign: 'right',
  },
});