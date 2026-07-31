const koreanDateFormatter = new Intl.DateTimeFormat('ko-KR', {
  dateStyle: 'long',
  timeZone: 'UTC',
});

export const formatKoreanDate = (date: Date) => koreanDateFormatter.format(date);
