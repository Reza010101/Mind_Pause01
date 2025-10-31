import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useAppState } from '../src/context/AppStateContext';
import { MOTIVATIONAL_MESSAGES, TIMER_DURATION } from '../src/types';

export default function TimerScreen() {
  const router = useRouter();
  const { recordId } = useLocalSearchParams();
  const { appState, completePause } = useAppState();
  
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [currentMessage, setCurrentMessage] = useState(MOTIVATIONAL_MESSAGES[0]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  
  // انیمیشن نفس‌کشی
  const breathingScale1 = React.useRef(new Animated.Value(1)).current;
  const breathingScale2 = React.useRef(new Animated.Value(0.85)).current;
  const breathingScale3 = React.useRef(new Animated.Value(0.7)).current;

  // ریست کردن state ها با هر recordId جدید
  useEffect(() => {
    setTimeLeft(TIMER_DURATION);
    setCurrentMessage(MOTIVATIONAL_MESSAGES[0]);
    setIsCompleted(false);
  }, [recordId]);

  // انیمیشن نفس‌کشی ساده و روان
  useEffect(() => {
    if (isCompleted) return;

    const startBreathingAnimation = () => {
      // سیکل کامل تنفس با مکث‌های طبیعی
      Animated.sequence([
        // دم - بزرگ شدن
        Animated.parallel([
          Animated.timing(breathingScale1, {
            toValue: 1.15,
            duration: 3500,
            useNativeDriver: true,
          }),
          Animated.timing(breathingScale2, {
            toValue: 1.0,
            duration: 3500,
            useNativeDriver: true,
          }),
          Animated.timing(breathingScale3, {
            toValue: 0.85,
            duration: 3500,
            useNativeDriver: true,
          })
        ]),
        // مکث در انتهای دم - نگه داشتن
        Animated.delay(1200),
        // بازدم - کوچک شدن
        Animated.parallel([
          Animated.timing(breathingScale1, {
            toValue: 0.9,
            duration: 3500,
            useNativeDriver: true,
          }),
          Animated.timing(breathingScale2, {
            toValue: 0.75,
            duration: 3500,
            useNativeDriver: true,
          }),
          Animated.timing(breathingScale3, {
            toValue: 0.6,
            duration: 3500,
            useNativeDriver: true,
          })
        ]),
        // مکث قبل از دم بعدی
        Animated.delay(1000)
      ]).start(() => {
        if (!isCompleted) {
          startBreathingAnimation();
        }
      });
    };

    startBreathingAnimation();
    
    return () => {
      breathingScale1.stopAnimation();
      breathingScale2.stopAnimation();
      breathingScale3.stopAnimation();
    };
  }, [isCompleted]);

  const handleTimerComplete = async () => {
    if (isCompleted) return; // جلوگیری از اجرای مکرر
    
    setIsCompleted(true);
    // ثبت موفقیت
    await completePause(recordId as string, true, false);
    
    // نمایش modal تبریک زیبا
    setShowCongrats(true);
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
        const newMessage = MOTIVATIONAL_MESSAGES.find(msg => {
          if (currentSeconds < msg.showAt) return false;
          const nextMessage = MOTIVATIONAL_MESSAGES.find(next => next.showAt > msg.showAt);
          return !nextMessage || currentSeconds < nextMessage.showAt;
        });
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
        <MaterialIcons name="close" size={24} color="white" />
      </TouchableOpacity>

      {/* نمایش تصمیم */}
      <View style={styles.decisionContainer}>
        <Text style={styles.decisionLabel}>تصمیم من:</Text>
        <Text style={styles.decisionText}>{currentDecision}</Text>
      </View>

      {/* تایمر با انیمیشن نفس‌کشی */}
      <View style={styles.timerContainer}>
        {/* دایره‌های پس‌زمینه برای جلوه نفس‌کشی */}
        <Animated.View 
          style={[
            styles.breathingCircle, 
            styles.breathingCircle1,
            {
              transform: [{ scale: breathingScale1 }],
              opacity: 0.3,
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.breathingCircle, 
            styles.breathingCircle2,
            {
              transform: [{ scale: breathingScale2 }],
              opacity: 0.2,
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.breathingCircle, 
            styles.breathingCircle3,
            {
              transform: [{ scale: breathingScale3 }],
              opacity: 0.1,
            }
          ]} 
        />
        
        {/* دایره اصلی تایمر */}
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

      {/* Modal تبریک زیبا */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showCongrats}
        onRequestClose={() => {
          setShowCongrats(false);
          router.back();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.congratsContainer}>
            <View style={styles.congratsIconContainer}>
              <AntDesign name="check-circle" size={60} color="#4CAF50" />
            </View>
            <Text style={styles.congratsTitle}>تبریک!</Text>
            <Text style={styles.congratsMessage}>
              شما موفق شدید تا انتهای مکث صبر کنید.
            </Text>
            <View style={styles.congratsSubContainer}>
              <MaterialIcons name="star" size={20} color="#FFD700" />
              <Text style={styles.congratsSubMessage}>
                این یک پیروزی بزرگ است!
              </Text>
              <MaterialIcons name="star" size={20} color="#FFD700" />
            </View>
            
            <TouchableOpacity 
              style={styles.congratsButton}
              onPress={() => {
                setShowCongrats(false);
                router.back();
              }}
            >
              <View style={styles.congratsButtonContent}>
                <MaterialIcons name="thumb-up" size={20} color="white" />
                <Text style={styles.congratsButtonText}>متشکرم</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    zIndex: 10,
  },
  timerText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },

  breathingCircle: {
    position: 'absolute',
    borderRadius: 200,
    borderWidth: 2,
  },
  breathingCircle1: {
    width: 320,
    height: 320,
    borderColor: 'rgba(76, 175, 80, 0.3)',
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  breathingCircle2: {
    width: 280,
    height: 280,
    borderColor: 'rgba(76, 175, 80, 0.4)',
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
  },
  breathingCircle3: {
    width: 240,
    height: 240,
    borderColor: 'rgba(76, 175, 80, 0.5)',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
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
  
  // استایل‌های Modal تبریک
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  congratsContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  congratsIconContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 50,
  },
  congratsTitle: {
    color: '#4CAF50',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  congratsMessage: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 26,
  },
  congratsSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    justifyContent: 'center',
  },
  congratsSubMessage: {
    color: '#4CAF50',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    marginHorizontal: 8,
  },
  congratsButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  congratsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  congratsButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 8,
  },

});