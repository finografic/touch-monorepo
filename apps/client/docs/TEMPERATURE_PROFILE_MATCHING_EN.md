# Temperature Profile Matching System

📅 Jul 13, 2025

## Overview

This document explains how the temperature profile matching system works in the beverage service application. It is intended for both developers and non-technical stakeholders (such as clients) who may need to understand or justify the system's behavior.

---

## The Problem

- Users can select any initial and final temperature (in 0.5°C increments) for their beverage.
- The backend database only contains a **limited set of temperature profiles** for each order (e.g., 4–12 per order), not every possible temperature value.
- We need to provide the user with the most appropriate temperature profile, even if there is no exact match for their selection.

---

## The Solution: Client-Side Closest Match

### 1. **Fetch All Profiles for the Order**

- When the user configures a beverage, the frontend fetches **all available temperature profiles** for the selected order from the backend.
- The backend only filters by `orderId` and returns all profiles for that order.

### 2. **Client-Side Matching Algorithm**

- When the user selects a temperature, the frontend uses a simple algorithm to find the **closest available profile**:
  - It compares the user's selected initial temperature to each available profile's temperature.
  - The profile with the smallest difference is chosen as the "closest match."
- This ensures that, even if the user picks a temperature not present in the database, the system always provides the best available option.

### 3. **User Feedback**

- The UI displays the closest available profile and all available profile temperatures for transparency.
- If the user's selection does not exactly match a profile, the UI clearly shows which profile is being used.

---

## Why This Approach?

- **Flexibility:** The frontend can easily change the matching logic, add thresholds, or interpolate between profiles without backend changes.
- **Performance:** Only one backend request is needed per order, and the logic is fast and cache-friendly.
- **User Experience:** The user always gets a reasonable result, and the UI never "breaks" or leaves them without options.
- **Maintainability:** The system is easy to debug, extend, and explain to stakeholders.

---

## Example

Suppose the available profiles for an order are at 0°C, 10°C, 20°C, and 30°C. If the user selects 9°C, the system will match them to the 10°C profile (the closest available).

---

## Limitations

- If the available profiles are sparse or clustered at one end of the temperature range, the "closest" match may still be far from the user's selection. This is a natural consequence of having limited data.
- The system can be extended in the future to use more advanced matching or interpolation if needed.

---

## Summary

- The system always provides the best available temperature profile for the user's selection.
- All logic is handled client-side for maximum flexibility and transparency.
- This approach is robust, maintainable, and user-friendly.
