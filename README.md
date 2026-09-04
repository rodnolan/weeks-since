# Weeks Since December 19, 2025

A dependency-free JavaScript app for GitHub Pages.

- On the day of the week that matches the start date, display the whole number of weeks elapsed since `start`.
- On every other day, display the whole-week count as of the most recent Friday and the whole-week count that will have elapsed on the next Friday.
- Uses the browser's local date.
- The starting date is a `const` near the top of the script for easy testing/modification.
- Time constants are named rather than repeating millisecond literals.

## GitHub Pages

1. Create a GitHub repository.
2. Add `index.html` to the repository root.
3. Push the file.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select your default branch and `/ (root)`.
7. Save.


## TODOs

1. Add the dates around the big numbers;
2. Add the lifetime line that shows the dates and the days and weeks;


## updating the version number

There is a pre-commit githook that automates this. All you have to do is include `major:` or `minor:` in the commit message. If these keywords are not present, the commit will be interpreted as a `patch`. The semver version is defined as part of the CACHE_NAME variable in sw.js. The githook increments that number and also displays it in the `<span id="app-version">` tag in `index.html`. These files are modified and staged so that they are included in the commit automatically.

PATCH (0.0.X) — Bug Fixes & Small Refactors 
    When you fixed a typo, optimized a CSS style, patched a JavaScript error, or tweaked an algorithm.
    Impact: It fixes things silently without adding new layout constraints or functionality. 
MINOR (0.X.0) — New Features & Enhancements
    When you added a whole new view, built a new setting, integrated a new API, or added dark mode.
    Impact: The application has new capabilities but everything the user did previously remains fully operational. 
MAJOR (X.0.0) — Structural Changes or App Resets
    When you changed your data persistence schema, revamped the navigation entirely, or rewrote the app from scratch.
    Impact: Older cached states might fail if they collide with the new code; updating resets baseline layouts or forces user re-authentication.

