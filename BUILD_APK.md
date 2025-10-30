# راهنمای ساخت APK برای Mind Pause

## روش 1: استفاده از Expo Application Services (توصیه می‌شه)

1. ثبت‌نام رایگان در [expo.dev](https://expo.dev)
2. دستور زیر را اجرا کنید:

```bash
npx eas build -p android --profile preview
```

این روش یک APK کاملاً standalone می‌سازه که بدون نیاز به Expo Go کار می‌کنه.

## روش 2: استفاده از Turtle CLI (محلی)

```bash
npm install -g turtle-cli
turtle setup:android
turtle build:android --keystore-path ./release.keystore --keystore-password password --key-alias key0 --key-password password --type apk
```

## روش 3: ساده‌ترین روش (فعلی)

APK های آماده در فولدر `dist/` قرار گرفتند. برای تست:

1. فایل‌های export شده در `dist/` موجودند
2. می‌تونید از ابزارهای آنلاین مثل PhoneGap Build استفاده کنید
3. یا از Android Studio برای wrap کردن استفاده کنید

## نکته مهم

APK که با export ساخته شده فقط static files هست. برای APK کامل نیاز به:
- Java JDK 11+
- Android SDK
- Android Studio

### دانلود APK آماده

می‌تونید از GitHub Releases بخش repository APK آماده رو دانلود کنید که بعداً آپلود می‌کنم.