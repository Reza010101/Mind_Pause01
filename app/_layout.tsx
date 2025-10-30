import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'جدا از ذهن',
            headerTitleAlign: 'center'
          }} 
        />
        <Stack.Screen 
          name="timer" 
          options={{ 
            title: 'مکث آگاهانه',
            headerShown: false // صفحه تایمر نیاز به header نداره
          }} 
        />
        <Stack.Screen 
          name="habits" 
          options={{ 
            title: 'عادت‌های من',
            headerTitleAlign: 'center'
          }} 
        />
        <Stack.Screen 
          name="progress" 
          options={{ 
            title: 'پیشرفت من',
            headerTitleAlign: 'center'
          }} 
        />
      </Stack>
    </>
  );
}