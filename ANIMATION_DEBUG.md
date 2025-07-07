# 🎬 Animation Debugger

## Overview

The Animation Debugger provides real-time information about the current animation state, making it easier to understand and modify the complex scene transitions.

**⚠️ Development Only**: The debugger is automatically excluded from production builds to keep the bundle size minimal.

## How to Use

### 1. Toggle the Debugger

- **Keyboard Shortcut**: Press `Ctrl + D` (Windows/Linux) or `Cmd + D` (Mac)
- The debugger overlay will appear in the top-right corner of the screen
- **Note**: Only available in development mode (`yarn dev`)

### 2. What the Debugger Shows

#### ⏱️ Time Information

- **Current Time**: Current scroll position in milliseconds
- **Total Duration**: Total animation duration (8200ms)
- **Progress Bar**: Visual representation of overall progress

#### 🎭 Current Scene

- **Scene Name**: Which narrative phase is currently active
- **Scene Progress**: How far through the current scene you are
- **Scene Emojis**: Visual indicators for each scene type

#### 🎯 Active Animations

- **Element List**: All CSS selectors currently being animated
- **Count**: Total number of active animations
- **Truncated Display**: Shows first 8 elements to avoid overflow

#### 📅 Scene Timeline

- **All Scenes**: Complete timeline with start/end times
- **Status Indicators**:
  - ▶️ Currently active scene
  - ✅ Completed scenes
  - ⏳ Upcoming scenes

## Scene Breakdown

| Scene          | Time Range  | Description                  | Emoji |
| -------------- | ----------- | ---------------------------- | ----- |
| **DESK**       | 10-800ms    | Drawing workspace elements   | 🖥️    |
| **FREELANCE**  | 800-1200ms  | Transition to freelance work | 🏠    |
| **COMPANY**    | 1200-1600ms | Corporate work phase         | 🏢    |
| **FOUNDER**    | 1600-1800ms | Starting own company         | 🚀    |
| **FRAME**      | 1800-2500ms | Landscape and environment    | 🖼️    |
| **LIGHTS OFF** | 4300-6300ms | Dramatic lighting effects    | 🌙    |
| **CONTACTS**   | 6100-8400ms | Terminal interfaces          | 💻    |

## Making Changes

### 1. Understanding Current State

- Use the debugger to see which scene is active
- Check which elements are currently animating
- Note the current time position

### 2. Modifying Timing

- Scene timing is defined in `SCENE_TIMING` object in `transitions.js`
- Individual animation timing can be found in the respective generator functions
- Look for DEBUG comments in the code for timing details

### 3. Adding New Animations

- Create new animation functions following the existing patterns
- Add them to the main `createTransitions()` function
- Use the debugger to verify they appear at the right time

### 4. Debugging Issues

- If an animation isn't working, check if its selector appears in Active Animations
- Use browser DevTools Console for additional logging
- The debugger tracks all style applications in real-time

## Performance Notes

- The debugger updates every 100ms to avoid performance issues
- It only tracks elements that have active style changes
- Toggle off when not needed to reduce overhead
- **Automatically excluded from production builds** for optimal performance

## Code Integration

The debugger is conditionally integrated with:

- `transitions.js` - Dynamic import and initialization (development only)
- `tickFunction.js` - Conditional debugger updates (development only)
- `animationDebugger.js` - Full implementation with production stub

## Tips for Development

1. **Start with Overview**: Use the timeline to understand the scene flow
2. **Focus on Active Elements**: Look at which selectors are currently animating
3. **Time-based Changes**: Use current time to understand when things happen
4. **Scene-based Grouping**: Animations are logically grouped by narrative scene
5. **Console Logging**: Additional debug info is available in browser console

Happy debugging! 🎉
