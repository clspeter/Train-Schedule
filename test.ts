import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';

const travelTimeCaulate = (time1: string, time2: string) => {
  dayjs.extend(customParseFormat);
  dayjs.extend(duration);
  const time2obj = dayjs(time2, 'HH:mm');
  const time1obj = dayjs(time1, 'HH:mm');
  let traveltime = dayjs.duration(time2obj.diff(time1obj));
  if (time1 > time2) {
    traveltime = traveltime.add(1, 'days');
  }
  const hoursStr = traveltime.hours() > 0 ? traveltime.hours() + '時' : '';
  const minuatesStr = traveltime.minutes() > 0 ? traveltime.minutes() + '分' : '';
  return { hoursStr, minuatesStr };
};

console.log(travelTimeCaulate('23:11', '00:01'));
