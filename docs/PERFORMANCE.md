# Performance w/ Chrome DevTools

A Pi-targeted React app where bundle size and runtime responsiveness matter — here are the specific panels and metrics:

## Performance tab → Record a page load:

- **Total Blocking Time (TBT)** — time the main thread was blocked by long tasks. This is your primary metric for "snappiness." On the Pi, long tasks that feel fine on M1 will cause visible jank.
- **Largest Contentful Paint (LCP)** — when the main visible content finishes rendering. Your dashboard panels, data displays.
- **First Contentful Paint (FCP)** — when anything first appears on screen.
- **Long Tasks** — yellow/red bars in the flame chart. Any task over 50ms blocks the UI. On Pi, tasks that take 20ms on M1 might hit 80-100ms. Look for these during your server data update cycles.

## Performance tab → flame chart specifics:

- Look for `Recalculate Style` blocks — these show how long the browser spends processing CSS. As you remove Radix Themes CSS and PrimeReact theme CSS, these should shrink. This is where your "2% more snappy" feeling becomes a measurable number.
- Look for `Layout` (reflow) blocks — expensive when many DOM elements change at once, which happens during your server-driven UI updates.

## Network tab:

- Sort by size, filter by JS and CSS. Compare total transferred size before and after each migration step (Radix removal, PrimeReact → TanStack, etc.).
- **Coverage** (bottom drawer, three-dot menu → "Coverage") — this is your tree-shaking validator. It shows exactly how much of each CSS and JS file is actually used on the current page. Red = unused bytes shipped to the browser. Run this before and after migrations to quantify the improvement.

## Lighthouse tab:

- Run in "Performance" mode. But critically: throttle it. Use "Simulated Throttling" or better yet, set a custom throttle profile that approximates Pi hardware. Under the gear icon, set CPU slowdown to **6x** — this roughly simulates the gap between your M1 and a Pi 4. The scores and timings you see at 6x throttle are closer to what your Pi users experience.

## Memory tab:

- Take heap snapshots before and after your context/server update cycles. If your app has many contexts and constant server calls updating UI, you want to watch for retained objects that should have been garbage collected. Not your immediate concern, but worth a baseline.

**The practical workflow for your migration:**

Before each migration step (remove Radix, remove PrimeReact, etc.), take three measurements: a Lighthouse run at 6x CPU throttle, a Coverage report, and a Performance recording of a typical interaction (page load → data updates). After the migration, repeat. You'll have concrete before/after numbers for TBT, CSS size, unused bytes, and style recalculation time.

The Coverage panel is probably your single highest-value tool right now. It'll show you exactly how many KB of PrimeReact CSS and Radix Themes CSS are loaded but unused — making the case for removal very concrete.
