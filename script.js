
// CONFIGURATION: UTC string and target timezone
const pointInTime = "2025-12-19T22:14:00Z";
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

function calculateWeeksAndRender() {
    const targetDate = new Date(pointInTime);
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

    console.log(`currentDay: ${currentDay} targetDate: {$targetDate}`);
    if (currentDay === targetDay) {

        // Same day of week: exact whole calendar weeks elapsed
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
                    <div class="comparison">
                        <div class="result-card">
                            <div class="secondary-number">
                                ${prevOccurrenceWeeks}
                            </div>
                        </div>
                        <div class="result-card">
                            <div class="secondary-label">
                                ${formatInstant(now)}
                            </div>
                        </div>
                        <div class="result-card">
                            <div class="secondary-number">
                                ${nextOccurrenceWeeks}
                            </div>
                        </div>
                    </div>`;
    }
}

calculateWeeksAndRender();
