import { format, addDays, startOfWeek, parseISO } from 'date-fns';

export const getWeekDays = (weekStartISO: string) => {
  const monday = parseISO(weekStartISO);
  const days = [];

  for (let i = 0; i < 7; i++) {
    const date = addDays(monday, i);
    days.push({
      date: format(date, 'yyyy-MM-dd'),
      dayName: format(date, 'EEE').toUpperCase(),
      dayNumber: format(date, 'd'),
      isToday: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
    });
  }

  return days;
};

export const getWeekRange = (weekStartISO: string) => {
  const monday = parseISO(weekStartISO);
  const sunday = addDays(monday, 6);

  const startMonth = format(monday, 'MMM');
  const endMonth = format(sunday, 'MMM');
  const startDay = format(monday, 'd');
  const endDay = format(sunday, 'd');
  const year = format(monday, 'yyyy');

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
};

export const getPreviousWeek = (weekStartISO: string) => {
  const monday = parseISO(weekStartISO);
  const prevMonday = addDays(monday, -7);
  return format(prevMonday, 'yyyy-MM-dd');
};

export const getNextWeek = (weekStartISO: string) => {
  const monday = parseISO(weekStartISO);
  const nextMonday = addDays(monday, 7);
  return format(nextMonday, 'yyyy-MM-dd');
};

export const getCurrentWeekStart = () => {
  const today = new Date();
  const monday = startOfWeek(today, { weekStartsOn: 1 });
  return format(monday, 'yyyy-MM-dd');
};
