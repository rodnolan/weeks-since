
// CONFIGURATION: UTC string and target timezone
const birthTime = "2001-11-16T18:45:00Z"; // 2001-11-16T13:45 in Mississauga
const lastKnownAliveTime = "2025-12-20T03:14:00Z"; // 2025-12-19T22:14 in Brampton
const timeZone = "America/New_York";


// Converts a Date object into a pure midnight UTC Date representing the local calendar day in the target timezone
function getTZMidnightUTC(date, tz) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const [{ value: m }, , { value: d }, , { value: y }] = formatter.formatToParts(date);
  return new Date(Date.UTC(parseInt(y), parseInt(m) - 1, parseInt(d)));
}

// Gets the localized day index (0=Sun, 1=Mon, ..., 6=Sat)
function getTZWeekday(date, tz) {
  const formatter = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short' });
  const dayName = formatter.format(date);
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(dayName);
}

// Formats an instant using the event's timezone.
function formatInstant(instant, tz = timeZone) {

  // const orientationType = screen.orientation.type;
  // console.log(orientationType);

  return new Intl.DateTimeFormat(
    undefined,
    {
      timeZone: tz,
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      // hour: "numeric",
      // minute: "2-digit",
      // timeZoneName: "short"
    }
  ).format(instant).split(',').join('<br />').split(' at ').join('<br />');
}

// Gets the number of days and weeks elapsed between two ISO date strings, ignoring time-of-day.
function getElapsedDaysAndWeeks(dateStr1, dateStr2) {
  // Parse the ISO strings into Date objects
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);

  // Calculate the absolute difference in milliseconds
  const diffInMs = Math.abs(d2 - d1);

  // Convert milliseconds into full days (1 day = 24h * 60m * 60s * 1000ms)
  const daysElapsed = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Convert days into full weeks
  const weeksElapsed = Math.floor(daysElapsed / 7);

  return { daysElapsed, weeksElapsed };
}

// function addDays(date, days) {
//   const result = new Date(date);
//   result.setDate(result.getDate() + days);
//   return result;
// }

function renderWholeWeekDay(elapsedCalendarDays, daysAndWeeksElapsed, now) {
  // today is the same day of the week as the targetDay: exact whole calendar weeks elapsed
  const weeksElapsed = Math.floor(elapsedCalendarDays / 7);

  injectHTMLIntoElements('birth-date', formatInstant(new Date(birthTime)));
  injectPlainTextIntoElements('life-weeks', daysAndWeeksElapsed.weeksElapsed);
  injectHTMLIntoElements('death-date', formatInstant(new Date(lastKnownAliveTime)));
  injectPlainHTMLIntoElements('post-life-weeks', weeksElapsed);
  injectHTMLIntoElements('today-date', formatInstant(now));
}

function renderPartialWeekDays(elapsedCalendarDays, daysAndWeeksElapsed, now, currentDay, targetDay) {
  // Calculate calendar day offsets to previous and next occurrence of the target weekday
  const daysSinceLast = (currentDay - targetDay + 7) % 7;
  const daysToNext = (targetDay - currentDay + 7) % 7;

  // Calendar days elapsed as of previous and next occurrence of target weekday
  const prevFridayDaysElapsed = elapsedCalendarDays - daysSinceLast;
  const prevFridayWeeksElapsed = Math.round(prevFridayDaysElapsed / 7);
  // const previousFridayDate = addDays(targetDate, prevFridayDaysElapsed);

  const nextFridayDaysElapsed = elapsedCalendarDays + daysToNext;
  const nextFridayWeeksElapsed = Math.round(nextFridayDaysElapsed / 7);
  // const nextFridayDate = addDays(targetDate, nextFridayDaysElapsed);

  injectHTMLIntoElements('birth-date', formatInstant(new Date(birthTime)));
  injectPlainTextIntoElements('life-weeks', daysAndWeeksElapsed.weeksElapsed);
  injectHTMLIntoElements('death-date', formatInstant(new Date(lastKnownAliveTime)));
  injectPlainTextIntoElements('lastWholeWeeksElapsed', prevFridayWeeksElapsed);
  injectHTMLIntoElements('today-date', formatInstant(now));
  injectPlainTextIntoElements('nextWholeWeeksElapsed', nextFridayWeeksElapsed);
}

function render() {
  const deathDate = new Date(lastKnownAliveTime);
  const now = new Date();

  // Strip time-of-day: get pure calendar midnight dates in the target timezone
  const deathDayMidnight = getTZMidnightUTC(deathDate, timeZone);
  const todayMidnight = getTZMidnightUTC(now, timeZone);

  // Calculate total elapsed calendar days between midnight boundaries
  // first for birthday to deathday
  const daysAndWeeksLifetime = getElapsedDaysAndWeeks(birthTime, lastKnownAliveTime);
  // then for deathday to today
  const daysSinceDeath = Math.round((todayMidnight - deathDayMidnight) / (1000 * 60 * 60 * 24));
  
  // Get day of week (0-6) in the target time zone
  const deathDayIndex = getTZWeekday(deathDate, timeZone);
  const todayIndex = getTZWeekday(now, timeZone);
  //console.log(`daysAndWeeksLifetime between ${birthTime} and ${lastKnownAliveTime}: `, daysAndWeeksLifetime);
  //console.log(`todayIndex: ${todayIndex}, deathDayIndex: ${deathDayIndex}, deathDate: ${deathDate}`);

  if (todayIndex === deathDayIndex) {
    renderWholeWeekDay(daysSinceDeath, daysAndWeeksLifetime, now);
    toggleLayout('whole');
  } else {
    renderPartialWeekDays(daysSinceDeath, daysAndWeeksLifetime, now, todayIndex, deathDayIndex);
    toggleLayout('partial');
  }

}

render();

function injectPlainTextIntoElements(identifier, value) {
  const elements = document.querySelectorAll(`[data-id="${identifier}"]`);
  // console.log(elements);
  elements?.forEach(element => {
    element.textContent = value;
  });
};

function injectHTMLIntoElements(identifier, value) {
  const elements = document.querySelectorAll(`[data-id="${identifier}"]`);
  // console.log(elements);
  elements?.forEach(element => {
    element.innerHTML = value;
  });
}