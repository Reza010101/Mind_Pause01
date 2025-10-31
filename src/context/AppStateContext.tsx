import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, PauseRecord } from '../types';

const STORAGE_KEY = 'mindPause_appState';

// تعریف نوع Context
interface AppStateContextType {
  appState: AppState;
  loading: boolean;
  setDecision: (decision: string) => Promise<void>;
  startPause: () => Promise<string>;
  completePause: (recordId: string, completed: boolean, exitedEarly: boolean) => Promise<void>;
  clearAllData: () => Promise<void>;
  resetDecision: () => Promise<void>;
  updateDecision: (newDecision: string) => Promise<void>;
}

// ایجاد Context
const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// Provider Component
export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appState, setAppState] = useState<AppState>({
    currentDecision: null,
    hasSetDecision: false,
    pauseRecords: [],
    todayAttempts: 0
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
    if (isSaving) {
      return;
    }
    
    try {
      setIsSaving(true);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      setAppState(newState);
    } catch (error) {
      console.error('Error saving app state:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // تمام توابع state management
  const setDecision = async (decision: string) => {
    const newState = {
      ...appState,
      currentDecision: decision,
      hasSetDecision: true
    };
    await saveAppState(newState);
  };

  const startPause = async (): Promise<string> => {
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
    
    await saveAppState(newState);
    return newRecord.id;
  };

  const completePause = async (recordId: string, completed: boolean, exitedEarly: boolean) => {
    // بارگذاری مجدد state جاری از AsyncStorage
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    let currentState = appState;
    
    if (stored) {
      const parsedState = JSON.parse(stored);
      parsedState.pauseRecords = parsedState.pauseRecords.map((record: any) => ({
        ...record,
        startTime: new Date(record.startTime),
        endTime: record.endTime ? new Date(record.endTime) : undefined
      }));
      currentState = parsedState;
    }
    
    const updatedRecords = currentState.pauseRecords.map(record => 
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
      ...currentState,
      pauseRecords: updatedRecords
    };

    await saveAppState(newState);
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      const initialState: AppState = {
        currentDecision: null,
        hasSetDecision: false,
        pauseRecords: [],
        todayAttempts: 0
      };
      setAppState(initialState);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const resetDecision = async () => {
    const newState = {
      ...appState,
      currentDecision: '',
      hasSetDecision: false
    };
    await saveAppState(newState);
  };

  const updateDecision = async (newDecision: string) => {
    const newState = {
      ...appState,
      currentDecision: newDecision,
      hasSetDecision: true
    };
    await saveAppState(newState);
  };

  const contextValue: AppStateContextType = {
    appState,
    loading,
    setDecision,
    startPause,
    completePause,
    clearAllData,
    resetDecision,
    updateDecision
  };

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
};

// Hook برای استفاده از Context
export const useAppState = (): AppStateContextType => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};