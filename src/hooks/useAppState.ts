import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, PauseRecord } from '../types';

const STORAGE_KEY = 'mindPause_appState';

export const useAppState = () => {
  const [appState, setAppState] = useState<AppState>({
    currentDecision: null,
    hasSetDecision: false,
    pauseRecords: [],
    todayAttempts: 0
  });

  const [loading, setLoading] = useState(true);

  // بارگذاری داده‌ها از AsyncStorage
  useEffect(() => {
    loadAppState();
  }, []);

  const loadAppState = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedState = JSON.parse(stored);
        // تبدیل string های تاریخ به Date objects
        parsedState.pauseRecords = parsedState.pauseRecords.map((record: any) => ({
          ...record,
          startTime: new Date(record.startTime),
          endTime: record.endTime ? new Date(record.endTime) : undefined
        }));
        
        // محاسبه مجدد تلاش‌های امروز (در صورت تغییر روز)
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
        
        const actualTodayAttempts = parsedState.pauseRecords.filter((record: any) => {
          const recordDate = new Date(record.startTime);
          return recordDate >= todayStart && recordDate < todayEnd;
        }).length;
        
        parsedState.todayAttempts = actualTodayAttempts;
        setAppState(parsedState);
      }
    } catch (error) {
      console.error('Error loading app state:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAppState = async (newState: AppState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      setAppState(newState);
    } catch (error) {
      console.error('Error saving app state:', error);
    }
  };

  // محاسبه تعداد تلاش‌های امروز بر اساس رکوردهای واقعی
  const getTodayAttempts = (): number => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    return appState.pauseRecords.filter(record => {
      const recordDate = new Date(record.startTime);
      return recordDate >= todayStart && recordDate < todayEnd;
    }).length;
  };

  const setDecision = (decision: string) => {
    const newState = {
      ...appState,
      currentDecision: decision,
      hasSetDecision: true
    };
    saveAppState(newState);
  };

  const startPause = (): string => {
    const newRecord: PauseRecord = {
      id: Date.now().toString(),
      decision: appState.currentDecision || '',
      startTime: new Date(),
      completed: false,
      exitedEarly: false
    };

    const updatedRecords = [...appState.pauseRecords, newRecord];
    
    // محاسبه تعداد واقعی تلاش‌های امروز
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const todayAttemptsCount = updatedRecords.filter(record => {
      const recordDate = new Date(record.startTime);
      return recordDate >= todayStart && recordDate < todayEnd;
    }).length;

    const newState = {
      ...appState,
      pauseRecords: updatedRecords,
      todayAttempts: todayAttemptsCount
    };
    
    saveAppState(newState);
    return newRecord.id;
  };

  const completePause = (recordId: string, completed: boolean, exitedEarly: boolean) => {
    const updatedRecords = appState.pauseRecords.map(record => 
      record.id === recordId 
        ? { 
            ...record, 
            endTime: new Date(), 
            completed, 
            exitedEarly 
          }
        : record
    );

    const newState = {
      ...appState,
      pauseRecords: updatedRecords
    };

    saveAppState(newState);
  };

  return {
    appState,
    loading,
    setDecision,
    startPause,
    completePause
  };
};