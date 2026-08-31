
// CONFIGURATION: UTC string and target timezone
const birthTime = "2001-11-16T13:45:00Z";
const lastKnownAliveTime = "2025-12-19T22:14:00Z";
const timeZone = "America/New_York";
let tapCount = 0;
let tapTimeout;

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
function formatInstant(instant) {
  return new Intl.DateTimeFormat(
    undefined,
    {
      timeZone: timeZone,
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      // hour: "numeric",
      // minute: "2-digit",
      // timeZoneName: "short"
    }
  ).format(instant);
}

function getElapsedDuration(dateStr1, dateStr2) {
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

function render() {
  const targetDate = new Date(lastKnownAliveTime);
  const now = new Date();

  // Strip time-of-day: get pure calendar midnight dates in the target timezone
  const targetMidnight = getTZMidnightUTC(targetDate, timeZone);
  const todayMidnight = getTZMidnightUTC(now, timeZone);

  // Get day of week (0-6) in the target time zone
  const targetDay = getTZWeekday(targetDate, timeZone);
  const currentDay = getTZWeekday(now, timeZone);

  // Calculate total elapsed calendar days between midnight boundaries
  const elapsedCalendarDays = Math.round((todayMidnight - targetMidnight) / (1000 * 60 * 60 * 24));

  const outputEl = document.getElementById('result');

  const daysAndWeeksElapsed = getElapsedDuration(birthTime, lastKnownAliveTime);

  console.log(`daysAndWeeksElapsed between ${birthTime} and ${lastKnownAliveTime}: `, daysAndWeeksElapsed);
  console.log(`currentDay: ${currentDay} targetDay: ${targetDay} targetDate: ${targetDate}`);
  
  if (currentDay === targetDay) {

    // today is the same day of the week as the targetDay: exact whole calendar weeks elapsed
    const weeksElapsed = Math.floor(elapsedCalendarDays / 7);
    outputEl.innerHTML = `
      <div class="result-card">
          <div class="primary-number">
              ${weeksElapsed}
          </div>
      </div>`;

  } else {

    // Calculate calendar day offsets to previous and next occurrence of the target weekday
    const daysSinceLast = (currentDay - targetDay + 7) % 7;
    const daysToNext = (targetDay - currentDay + 7) % 7;

    // Calendar days elapsed as of previous and next occurrence of target weekday
    const prevOccurrenceDays = elapsedCalendarDays - daysSinceLast;
    const nextOccurrenceDays = elapsedCalendarDays + daysToNext;
    const prevOccurrenceWeeks = Math.round(prevOccurrenceDays / 7);
    const nextOccurrenceWeeks = Math.round(nextOccurrenceDays / 7);

    outputEl.innerHTML = `
      <div class="container">
          <div class="result-card">
              <div class="result-card-child secondary-number">
                  ${prevOccurrenceWeeks}
              </div>
          </div>
          <div class="result-card">
              <div class="result-card-child secondary-label">
                  ${formatInstant(now)}
              </div>
          </div>
          <div class="result-card">
              <div class="result-card-child secondary-number">
                  ${nextOccurrenceWeeks}
              </div>
          </div>
      </div>`;
  }
}

render();


// listen for taps anywhere on the screen
document.addEventListener('touchend', (event) => {
  tapCount++;

  // Clear the timer every time a new tap happens
  clearTimeout(tapTimeout);

  if (tapCount === 3) {
    // triple tap successfully completed!
    tapCount = 0; // Reset counter
    handleHardRefresh();
  } else {
    // if the user stops tapping for more than 400ms, reset the counter
    tapTimeout = setTimeout(() => {
      tapCount = 0;
    }, 400);
  }
});

async function handleHardRefresh() {
  // if device is offline, stop immediately so the app doesn't wipe its cache and crash
  if (!navigator.onLine) {
    alert("You are offline. Cache cannot be cleared right now.");
    return;
  }

  // show the loading overlay
  const overlay = document.getElementById('refresh-overlay');
  if (overlay) {
    overlay.classList.add('active-overlay');
  }

  try {
    // purge the cache; unregister service workers and clear cache storage
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
      }
    }

    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
  } catch (error) {
    console.error("Error clearing app cache:", error);
  }

  // force the page to request everything fresh from the server
  window.location.reload();
}
