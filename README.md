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

