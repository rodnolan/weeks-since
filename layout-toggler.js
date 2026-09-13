  const wholeWeekLayout = document.querySelector('.main-layout.whole-week');
  const partialWeekLayout = document.querySelector('.main-layout.partial-week');


/**
 * Layout Visibility Toggle
 * Toggles your main container between 'whole-week' and 'partial-week' layouts
 * Alternates visibility between .whole-week and .partial-week containers
 */
function toggleLayout(preferredLayout) {

  if (!wholeWeekLayout || !partialWeekLayout) {
    console.error("The DOM is missing one or both layout containers.");
    return;
  }

  if (preferredLayout === 'whole') {
    displayWholeWeekLayout();
  } else if (preferredLayout === 'partial') {
    displayPartialWeekLayout();
  } else {
    // Check which layout is currently hidden and flip them
    if (wholeWeekLayout.classList.contains('hidden')) {
      displayWholeWeekLayout();
    } else {
      displayPartialWeekLayout();
    }
  }
}

function displayWholeWeekLayout() {
  wholeWeekLayout.classList.remove('hidden');
  partialWeekLayout.classList.add('hidden');
  console.log("🔄 Displaying: WHOLE WEEK (Partial Week Hidden)");
}

function displayPartialWeekLayout() {
  wholeWeekLayout.classList.add('hidden');
  partialWeekLayout.classList.remove('hidden');
  console.log("🔄 Displaying: PARTIAL WEEK (Whole Week Hidden)");
}

// Bind to the 'L' key for browser/emulator testing
document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'l') {
    toggleLayout();
  }
});


// Variables to store the starting coordinates of a touch event
let touchStartX = 0;
let touchStartY = 0;

// Listen for the moment the user places a finger on the screen
document.addEventListener('touchstart', (event) => {
  console.log("✋ Touch Start detected");
  touchStartX = event.changedTouches[0].screenX;
  touchStartY = event.changedTouches[0].screenY;
}, { passive: true }); // passive: true improves scrolling performance on iOS

// Listen for the moment the user lifts their finger off the screen
document.addEventListener('touchend', (event) => {
  console.log("🖐️ Touch End detected");
  const touchEndX = event.changedTouches[0].screenX;
  const touchEndY = event.changedTouches[0].screenY;

  handleSwipeGesture(touchStartX, touchStartY, touchEndX, touchEndY);
}, { passive: true });

/**
 * Calculates the direction of a touch swipe and triggers the layout toggle
 */
function handleSwipeGesture(startX, startY, endX, endY) {
  const diffX = endX - startX;
  const diffY = endY - startY;

  const minSwipeDistance = 60; // minimum pixels required to count as a deliberate swipe

  // Ensure the swipe was primarily horizontal, not vertical scrolling
  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        console.log("👉 Swipe Right detected");
        toggleLayout('partial');
      } else {
        console.log("👈 Swipe Left detected");
        toggleLayout('whole');
      }
    }
  }
}
