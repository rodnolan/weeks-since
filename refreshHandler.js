let tapCount = 0;
let tapTimeout;

console.log('adding event listener for triple tap to trigger hard refresh');
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
    alert("You are offline. App cannot be reloaded right now.");
    return;
  } else {
    console.log("Device is online. Proceeding with hard refresh.");
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
    console.error("Error clearing app cache: ", error);
  }

  // force the page to request everything fresh from the server
  window.location.reload();
}
