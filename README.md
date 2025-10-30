# Mind Pause - جدا از ذهن

یک اپلیکیشن React Native برای ایجاد «فضای مکث» در مواجهه با عادت‌های مضر. این اپ نه نصیحت می‌کند، نه قضاوت؛ فقط کمک می‌کند کاربر لحظه‌ای تأخیر بیندازد بین هوس و عمل.

## 🎯 فلسفه اپلیکیشن

**هدف**: قطع چرخه عادت با ایجاد «مکث آگاهانه»

**چرخه عادت**: محرک → هوس ذهنی → عمل → پاداش

**اصل کلیدی**: ذهن در لحظه‌ی هوس فعال می‌شه و زر زر می‌کنه؛ مذاکره با ذهن = باخت

## ✨ ویژگی‌ها

- � **ثبت تصمیم اولیه**: کاربر تصمیمش رو می‌نویسه
- ⏰ **تایمر 60 ثانیه**: مکث آگاهانه با پیام‌های هدایت‌گر  
- � **بدون قضاوت**: اپ هیچ قضاوتی نمی‌کنه
- 📊 **ثبت پیروزی‌ها**: هر مقاومت موفق ثبت می‌شه
- 📅 **آمار روزانه**: نمایش پیشرفت
- 🌍 **پشتیبانی کامل فارسی**: طراحی RTL و متن‌های فارسی

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mind-pause
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# For Android
npm run android

# For iOS
npm run ios

# For web
npm run web
```

## Project Structure

```
mind-pause/
├── app/                    # App screens and navigation
│   ├── _layout.tsx        # Root layout with navigation
│   ├── index.tsx          # Home screen
│   ├── habits.tsx         # Habits management screen
│   └── progress.tsx       # Progress tracking screen
├── assets/                # Images, icons, and other assets
├── components/            # Reusable components (to be added)
├── utils/                 # Utility functions (to be added)
└── types/                 # TypeScript type definitions (to be added)
```

## Technology Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **Expo Router**: File-based routing system
- **TypeScript**: Type safety and better development experience
- **AsyncStorage**: Local data persistence
- **React Native Vector Icons**: Icon library

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team.

---

Made with ❤️ for helping people break harmful habits