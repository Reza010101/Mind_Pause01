import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';

interface Habit {
  id: string;
  name: string;
  daysWithout: number;
  startDate: string;
}

export default function HabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'سیگار کشیدن',
      daysWithout: 0,
      startDate: new Date().toLocaleDateString('fa-IR'),
    }
  ]);
  const [newHabitName, setNewHabitName] = useState('');

  const addHabit = () => {
    if (newHabitName.trim()) {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: newHabitName.trim(),
        daysWithout: 0,
        startDate: new Date().toLocaleDateString('fa-IR'),
      };
      setHabits([...habits, newHabit]);
      setNewHabitName('');
    }
  };

  const resetHabit = (id: string) => {
    Alert.alert(
      'بازنشانی عادت',
      'آیا مطمئن هستید که می‌خواهید این عادت را بازنشانی کنید؟',
      [
        { text: 'خیر', style: 'cancel' },
        {
          text: 'بله',
          onPress: () => {
            setHabits(habits.map(habit => 
              habit.id === id ? { ...habit, daysWithout: 0, startDate: new Date().toLocaleDateString('fa-IR') } : habit
            ));
          }
        }
      ]
    );
  };

  const incrementDay = (id: string) => {
    setHabits(habits.map(habit =>
      habit.id === id ? { ...habit, daysWithout: habit.daysWithout + 1 } : habit
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.addHabitSection}>
        <Text style={styles.sectionTitle}>افزودن عادت جدید</Text>
        <TextInput
          style={styles.input}
          placeholder="نام عادت (مثل: سیگار کشیدن، خوردن شیرینی)"
          value={newHabitName}
          onChangeText={setNewHabitName}
          textAlign="right"
        />
        <TouchableOpacity style={styles.addButton} onPress={addHabit}>
          <Text style={styles.addButtonText}>افزودن</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.habitsSection}>
        <Text style={styles.sectionTitle}>عادت‌های شما</Text>
        {habits.map((habit) => (
          <View key={habit.id} style={styles.habitCard}>
            <Text style={styles.habitName}>{habit.name}</Text>
            <Text style={styles.habitDays}>{habit.daysWithout} روز بدون این عادت</Text>
            <Text style={styles.habitStartDate}>شروع: {habit.startDate}</Text>
            
            <View style={styles.habitActions}>
              <TouchableOpacity 
                style={styles.incrementButton} 
                onPress={() => incrementDay(habit.id)}
              >
                <Text style={styles.buttonText}>یک روز گذشت ✅</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.resetButton} 
                onPress={() => resetHabit(habit.id)}
              >
                <Text style={styles.buttonText}>بازنشانی 🔄</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  addHabitSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  habitsSection: {
    flex: 1,
  },
  habitCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: 15,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  habitDays: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 5,
  },
  habitStartDate: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  habitActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  incrementButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 5,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});