# راهنمای ساخت APK برای Mind Pause

## روش‌های ساخت APK

### 1. استفاده از EAS Build (پیشنهادی)

#### مزایا:
- سریع و آسان
- ابری و قدرتمند
- پشتیبانی کامل از Expo

#### مراحل:
1. نصب EAS CLI:
```bash
npm install -g @expo/eas-cli
```

2. لاگین به حساب Expo:
```bash
eas login
```

3. راه‌اندازی پروژه:
```bash
eas build:configure
```

4. ساخت APK:
```bash
eas build --platform android --profile preview
```

### 2. Build محلی (Local Build)

#### پیش‌نیازها:
- Android Studio نصب شده
- Android SDK
- Java Development Kit (JDK)
- واریابل‌های محیطی تنظیم شده

#### مراحل:
1. اجرای prebuild:
```bash
npx expo prebuild --platform android
```

2. باز کردن پروژه در Android Studio:
```bash
# پوشه android/ ساخته می‌شود
```

3. ساخت از طریق Android Studio یا command line

### 3. Expo Development Build

#### برای تست و توسعه:
```bash
eas build --profile development --platform android
```

## تنظیمات اضافی

### app.json برای build:
```json
{
  "expo": {
    "name": "Mind Pause",
    "slug": "mind-pause",
    "version": "1.0.0",
    "orientation": "portrait",
    "platforms": ["ios", "android"],
    "android": {
      "package": "com.bakhshali.mindpause",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      }
    }
  }
}
```

## توجه‌ها

1. برای build اولین بار، ممکن است نیاز به تایید هویت باشد
2. فایل APK تولید شده در پنل Expo در دسترس خواهد بود
3. برای انتشار در Google Play، نیاز به AAB format است

## لینک‌های مفید

- [مستندات EAS Build](https://docs.expo.dev/build/introduction/)
- [راهنمای Android Build](https://docs.expo.dev/build-reference/android-builds/)
- [تنظیمات Build Profile](https://docs.expo.dev/build/eas-json/)