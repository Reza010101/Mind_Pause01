import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#666',
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            height: 60,
            paddingBottom: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'خانه',
            tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: 'پیشرفت',
            tabBarIcon: ({ color }) => <TabIcon name="chart" color={color} />,
          }}
        />
        <Tabs.Screen
          name="help"
          options={{
            title: 'راهنما',
            tabBarIcon: ({ color }) => <TabIcon name="help" color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'تنظیمات',
            tabBarIcon: ({ color }) => <TabIcon name="settings" color={color} />,
          }}
        />
        <Tabs.Screen
          name="timer"
          options={{
            href: null, // این صفحه در تب نمایش داده نمی‌شود
            tabBarStyle: { display: 'none' }, // مخفی کردن tab bar
          }}
        />
      </Tabs>
    </>
  );
}

// کامپوننت Material Icons برای تب‌ها
function TabIcon({ name, color }: { name: string; color: string }) {
  const iconNames: { [key: string]: keyof typeof MaterialIcons.glyphMap } = {
    home: 'home',
    chart: 'trending-up',
    help: 'help-outline',
    settings: 'settings',
  };
  
  return (
    <MaterialIcons 
      name={iconNames[name] || 'circle'} 
      size={24} 
      color={color} 
    />
  );
}