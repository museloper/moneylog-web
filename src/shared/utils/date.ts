const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export const formatDateValue = (d: Date): string => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const todayString = (): string => formatDateValue(new Date())

export const yesterdayString = (): string => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return formatDateValue(d)
}

/** "M월 D일 (요일)" */
export const formatMonthDay = (d: Date): string =>
  `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS[d.getDay()]})`

/**
 * 날짜 문자열(YYYY-MM-DD)을 사람 친화적 라벨로 변환.
 * 오늘이면 "오늘", 어제면 "어제", 그 외엔 "M월 D일 (요일)"
 */
export const formatDateLabel = (dateStr: string): string => {
  if (dateStr === todayString()) return '오늘'
  if (dateStr === yesterdayString()) return '어제'
  return formatMonthDay(new Date(dateStr))
}

/**
 * "오늘 · 5월 7일 (수)" 같은 상세 라벨 (거래 내역 일자별 그룹 헤더용)
 */
export const formatDateLabelLong = (dateStr: string): string => {
  const d = new Date(dateStr)
  const long = formatMonthDay(d)
  if (dateStr === todayString()) return `오늘 · ${long}`
  if (dateStr === yesterdayString()) return `어제 · ${long}`
  return long
}
