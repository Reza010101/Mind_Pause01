export interface PauseRecord {
  id: string;
  decision: string;
  startTime: Date;
  endTime?: Date;
  completed: boolean; // true اگر تا آخر صبر کرد
  exitedEarly: boolean; // true اگر ضربدر زد و زودتر خارج شد
  // تاریخ معادل شمسی برای فیلتر و نمایش سریع
  jalaliDate?: { year: number; month: number; day: number };
}

export interface AppState {
  currentDecision: string | null;
  hasSetDecision: boolean;
  pauseRecords: PauseRecord[];
  todayAttempts: number;
}

export interface MotivationalMessage {
  id: number;
  text: string;
  showAt: number; // نمایش در چندمین ثانیه
}

export const MOTIVATIONAL_MESSAGES: MotivationalMessage[] = [
  { id: 1, text: 'توجهت رو بیار به نفست', showAt: 0 },
  { id: 2, text: 'در این زمان ذهن کمکی نمی‌کنه', showAt: 20 },
  { id: 3, text: 'تصمیمتو قبلاً گرفتی', showAt: 40 }
];

export const TIMER_DURATION = 60; // ثانیه