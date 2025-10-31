import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppState } from '../src/hooks/useAppState';
import { MOTIVATIONAL_MESSAGES, TIMER_DURATION } from '../src/types';

export default function TimerScreen() {
  const router = useRouter();
  const { recordId } = useLocalSearchParams();
  const { appState, completePause } = useAppState();
  
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [currentMessage, setCurrentMessage] = useState(MOTIVATIONAL_MESSAGES[0]);
  const [isCompleted, setIsCompleted] = useState(false);

  // ریست کردن state ها با هر recordId جدید
  useEffect(() => {
    setTimeLeft(TIMER_DURATION);
    setCurrentMessage(MOTIVATIONAL_MESSAGES[0]);
    setIsCompleted(false);
  }, [recordId]);

  const handleTimerComplete = async () => {
    if (isCompleted) return; // جلوگیری از اجرای مکرر
    
    setIsCompleted(true);
    // ثبت موفقیت
    await completePause(recordId as string, true, false);
    
    Alert.alert(
      'تبریک! 🎉',
      'شما موفق شدید تا انتهای مکث صبر کنید. این یک پیروزی بزرگ است!',
      [{ text: 'متشکرم', onPress: () => router.back() }]
    );
  };

  useEffect(() => {
    if (isCompleted) return; // اگر تکمیل شده، timer را متوقف کن
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // تایمر تمام شد - موفقیت!
          handleTimerComplete();
          return 0;
        }
        
        // بررسی نیاز به تغییر پیام
        const newTime = prev - 1;
        const currentSeconds = TIMER_DURATION - newTime;
        const newMessage = MOTIVATIONAL_MESSAGES.find(msg => 
          currentSeconds >= msg.showAt && 
          (MOTIVATIONAL_MESSAGES.find(next => next.showAt > msg.showAt)?.showAt > currentSeconds || !MOTIVATIONAL_MESSAGES.find(next => next.showAt > msg.showAt))
        );
        if (newMessage && newMessage.id !== currentMessage.id) {
          setCurrentMessage(newMessage);
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentMessage, isCompleted]);

  const handleExit = async () => {
    // متوقف کردن تایمر
    setIsCompleted(true);
    // ثبت خروج زودهنگام
    await completePause(recordId as string, false, true);
    router.back();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentDecision = appState.currentDecision || '';

  return (
    <View style={styles.container}>
      {/* دکمه خروج */}
      <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
        <Text style={styles.exitButtonText}>✕</Text>
      </TouchableOpacity>

      {/* نمایش تصمیم */}
      <View style={styles.decisionContainer}>
        <Text style={styles.decisionLabel}>تصمیم من:</Text>
        <Text style={styles.decisionText}>{currentDecision}</Text>
      </View>

      {/* تایمر */}
      <View style={styles.timerContainer}>
        <View style={styles.timerCircle}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      {/* پیام انگیزشی */}
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{currentMessage.text}</Text>
      </View>

      {/* راهنمایی */}
      <View style={styles.guidanceContainer}>
        <Text style={styles.guidanceText}>
          در این لحظات، فقط نفس بکشید و صبر کنید
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  exitButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  exitButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  decisionContainer: {
    marginTop: 80,
    marginBottom: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 16,
  },
  decisionLabel: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  decisionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  timerText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  messageContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
  },
  messageText: {
    color: '#4CAF50',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  guidanceContainer: {
    marginBottom: 40,
  },
  guidanceText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});