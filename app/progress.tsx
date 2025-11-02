import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAppState } from '../src/context/AppStateContext';
import { toJalaali, toGregorian } from 'jalaali-js';
import Svg, { Circle } from 'react-native-svg';

const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

type ViewMode = 'daily' | 'monthly' | 'yearly';

function generateJalaliMonth(year: number, month: number) {
  const gFirst = toGregorian(year, month, 1);
  const firstDate = new Date(gFirst.gy, gFirst.gm - 1, gFirst.gd);
  const firstJsDay = firstDate.getDay(); // 0=Sun..6=Sat
  // column 0 = Saturday -> map JS day to column where 0=Sat
  const firstCol = (firstJsDay + 1) % 7;

  const gNext = (month === 12) ? toGregorian(year + 1, 1, 1) : toGregorian(year, month + 1, 1);
  const nextDate = new Date(gNext.gy, gNext.gm - 1, gNext.gd);
  const daysInMonth = Math.round((+nextDate - +firstDate) / (1000 * 60 * 60 * 24));

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstCol; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return { cells, daysInMonth, firstCol };
}

export default function ProgressScreen() {
  const { appState } = useAppState();
  const today = new Date();
  const todayJ = toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());

  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [year, setYear] = useState<number>(todayJ.jy);
  const [month, setMonth] = useState<number>(todayJ.jm);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // generate month cells
  const { cells } = useMemo(() => generateJalaliMonth(year, month), [year, month]);

  const recordsForDay = (d: number) => appState.pauseRecords.filter(r => (
    r.jalaliDate && r.jalaliDate.year === year && r.jalaliDate.month === month && r.jalaliDate.day === d
  ));

  // stats depending on viewMode
  const stats = useMemo(() => {
    let filtered = appState.pauseRecords;
    if (viewMode === 'daily' && selectedDay) {
      filtered = filtered.filter(r => r.jalaliDate && r.jalaliDate.year === year && r.jalaliDate.month === month && r.jalaliDate.day === selectedDay);
    } else if (viewMode === 'monthly') {
      filtered = filtered.filter(r => r.jalaliDate && r.jalaliDate.year === year && r.jalaliDate.month === month);
    } else if (viewMode === 'yearly') {
      filtered = filtered.filter(r => r.jalaliDate && r.jalaliDate.year === year);
    }
    // determine success/failure using both endTime presence and exitedEarly flag
    const success = filtered.filter(r => r.endTime && !r.exitedEarly).length;
    const failed = filtered.filter(r => !(r.endTime && !r.exitedEarly)).length;
    return { total: filtered.length, success, failed };
  }, [appState.pauseRecords, viewMode, year, month, selectedDay]);

  // simple circular chart params (made larger)
  const radius = 96; // doubled from 48
  const stroke = 16;
  const circumference = 2 * Math.PI * radius;
  const successPercent = stats.total === 0 ? 0 : stats.success / stats.total;
  const failedPercent = stats.total === 0 ? 0 : stats.failed / stats.total;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>پیشرفت</Text>
        <Text style={styles.subtitle}>آمار و گزارش عملکرد</Text>
      </View>

      {/* view mode toggles */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.segmentRow}>
        {(['daily','monthly','yearly'] as ViewMode[]).map(mode => (
          <TouchableOpacity key={mode} style={[styles.segmentButton, viewMode===mode && styles.segmentActive]} onPress={() => setViewMode(mode)}>
            <Text style={[styles.segmentText, viewMode===mode && styles.segmentTextActive]}>{mode === 'daily' ? 'روزانه' : mode === 'monthly' ? 'ماهانه' : 'سالانه'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* month/year picker */}
      <View style={styles.pickerRow}>
        <TouchableOpacity onPress={() => { if (month === 1) { setYear(y => y - 1); setMonth(12); } else setMonth(m => m - 1); }} style={styles.arrowBtn}><Text>‹</Text></TouchableOpacity>
        <Text style={styles.monthLabel}>{`${persianMonths[month - 1]} ${year}`}</Text>
        <TouchableOpacity onPress={() => { if (month === 12) { setYear(y => y + 1); setMonth(1); } else setMonth(m => m + 1); }} style={styles.arrowBtn}><Text>›</Text></TouchableOpacity>
      </View>

      {/* calendar grid */}
        <View style={styles.calendarContainer}>
        {['ش','ی','د','س','چ','پ','ج'].map(w => (
          <Text key={w} style={styles.weekDay}>{w}</Text>
        ))}
        {cells.map((c, idx) => (
          <TouchableOpacity key={idx} style={styles.cell} disabled={c == null} onPress={() => c && setSelectedDay(c)}>
            <Text style={[styles.cellText, c==null && styles.emptyText]}>{c ?? ''}</Text>
            {c != null && recordsForDay(c).length > 0 && <View style={styles.dot} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* stats + circular chart (chart larger and stats moved below) */}
        <View style={styles.chartArea}>
        <View style={styles.chartWrap}>
          <Svg width={radius * 2 + stroke} height={radius * 2 + stroke}>
            {/* base: red circle representing failures (or gray when no data) */}
            <Circle
              cx={(radius + stroke/2)}
              cy={(radius + stroke/2)}
              r={radius}
              stroke={stats.total === 0 ? '#eee' : '#f44336'}
              strokeWidth={stroke}
              strokeLinecap="butt"
              fill="none"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={0}
            />
            {/* overlay: green arc for successes */}
            {stats.total > 0 && (
              <Circle
                cx={(radius + stroke/2)}
                cy={(radius + stroke/2)}
                r={radius}
                stroke="#4caf50"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={`${circumference * (1 - successPercent)}`}
                fill="none"
                rotation={-90}
                origin={`${radius + stroke/2}, ${radius + stroke/2}`}
              />
            )}
          </Svg>
          <View style={styles.chartCenter}>
            <Text style={styles.chartTotal}>{stats.total}</Text>
            <Text style={styles.chartLabel}>کل</Text>
          </View>
        </View>

        {/* stats under the chart (side-by-side) */}
        <View style={styles.statsUnderChart}>
          <View style={styles.statBox}>
            <View style={[styles.legendDot, {backgroundColor:'#4caf50'}]} />
            <Text style={styles.statLabelBox}>موفق</Text>
            <Text style={styles.statNumberBox}>{stats.success}</Text>
          </View>
          <View style={styles.statBox}>
            <View style={[styles.legendDot, {backgroundColor:'#f44336'}]} />
            <Text style={styles.statLabelBox}>ناموفق</Text>
            <Text style={styles.statNumberBox}>{stats.failed}</Text>
          </View>
        </View>
        </View>
        {/* Note: clicking a day now sets selectedDay (no modal/navigation). Chart updates based on viewMode/year/month/selectedDay */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#f5f5f5' },
  header: { backgroundColor:'#FF9800', paddingTop:40, paddingBottom:12, alignItems:'center' },
  title: { fontSize:22, fontWeight:'bold', color:'white' },
  subtitle: { fontSize:14, color:'white', opacity:0.95 },
  segmentRow: { flexDirection:'row', justifyContent:'center', padding:12, backgroundColor:'#fff' },
  segmentButton: { paddingVertical:8, paddingHorizontal:14, marginHorizontal:6, borderRadius:8, backgroundColor:'#fafafa' },
  segmentActive: { backgroundColor:'#FF9800' },
  segmentText: { color:'#333', fontWeight:'600' },
  segmentTextActive: { color:'white' },
  pickerRow: { flexDirection:'row', justifyContent:'center', alignItems:'center', padding:10 },
  arrowBtn: { paddingHorizontal:12, paddingVertical:6, backgroundColor:'#fff', borderRadius:6, marginHorizontal:8 },
  monthLabel: { fontSize:16, fontWeight:'600' },
  calendarContainer: { backgroundColor:'#fff', margin:12, padding:8, borderRadius:10, flexDirection:'row', flexWrap:'wrap' },
  weekDay: { width:`${100/7}%`, textAlign:'center', fontWeight:'700', paddingVertical:6 },
  cell: { width:`${100/7}%`, height:56, justifyContent:'center', alignItems:'center', borderWidth:0.5, borderColor:'#f0f0f0' },
  cellText: { fontSize:15 },
  emptyText: { color:'#eee' },
  dot: { width:6, height:6, borderRadius:3, backgroundColor:'#2196F3', position:'absolute', bottom:6 },
  statsRow: { flexDirection:'row', padding:12, alignItems:'center', justifyContent:'space-between' },
  chartWrap: { width: 208, height: 208, justifyContent:'center', alignItems:'center', alignSelf: 'center' },
  chartArea: { backgroundColor: '#fff', margin: 12, padding: 12, borderRadius: 10, alignItems: 'center' },
  scrollContent: { paddingBottom: 100 },
  chartCenter: { position:'absolute', justifyContent:'center', alignItems:'center' },
  chartPercent: { fontSize:18, fontWeight:'700' },
  chartTotal: { fontSize:20, fontWeight:'800' },
  chartLabel: { fontSize:12, color:'#666' },
  statsList: { flex:1, paddingLeft:12 },
  statRow: { flexDirection:'row', alignItems:'center', marginBottom:8 },
  statRowUnderChart: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:6 },
  statsUnderChart: { width: '100%', paddingHorizontal: 16, paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statTextUnderChart: { fontSize:14, flex:1, color:'#333' },
  statNumber: { fontSize:14, fontWeight:'700', marginLeft:8 },
  statBox: { flexDirection:'row', alignItems:'center', justifyContent:'center', width: '48%' },
  statLabelBox: { fontSize:15, color:'#333', marginLeft:8 },
  statNumberBox: { fontSize:15, fontWeight:'700', marginLeft:8 },
  legendDot: { width:12, height:12, borderRadius:6, marginRight:8 },
  statText: { fontSize:16 },
  modal: { flex:1, padding:16 },
  modalTitle: { fontSize:18, fontWeight:'700', marginBottom:12 },
  recordRow: { padding:12, borderBottomWidth:1, borderColor:'#eee', flexDirection:'row', justifyContent:'space-between' },
  closeBtn: { backgroundColor:'#FF9800', padding:12, alignItems:'center', marginTop:12, borderRadius:8 }
});