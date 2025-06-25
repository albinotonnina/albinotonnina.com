# albinotonnina.com

[![Build Status](https://travis-ci.org/albinotonnina/albinotonnina.com.svg?branch=master)](https://travis-ci.org/albinotonnina/albinotonnina.com)
[![License: CC BY-NC-ND 4.0](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-nd/4.0/)

> Interactive portfolio website showcasing creative web development and animation techniques

**Live Site:** [www.albinotonnina.com](http://www.albinotonnina.com)

## ✨ Features

- **Interactive SVG Animations** - Complex scene transitions with scroll-based animations
- **Responsive Design** - Optimized for desktop and mobile viewing
- **Performance Optimized** - Webpack 5 with code splitting and asset optimization
- **Modern React** - Built with React 18 and modern JavaScript
- **Custom Animation Engine** - Scroll-triggered animations with D3 interpolation
- **Advanced SVG Rendering** - Preserved gradient definitions and complex illustrations

## 🚀 Quick Start

### Prerequisites

- **Node.js** `>=22.x`
- **Yarn** (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/albinotonnina/albinotonnina.com.git
cd albinotonnina.com

# Install dependencies
yarn install
```

### Development

```bash
# Start development server
yarn dev

# Open browser to http://localhost:8080
```

The development server includes:

- Hot module replacement
- Fast refresh for React components
- Source maps for debugging
- Optimized SVG processing
- **Animation Debugger** - Press `Ctrl/Cmd + D` to toggle real-time animation info

### Production Build

```bash
# Build for production
yarn build

# Analyze bundle size
yarn analyze
```

### Testing

```bash
# Run tests
yarn test
```

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library with modern hooks
- **Webpack 5** - Module bundler with advanced optimization
- **Babel** - JavaScript compiler with modern syntax support
- **PostCSS** - CSS processing with modern features

### Animation & Graphics

- **D3 Interpolate** - Smooth animation transitions
- **SVG Filter** - Dynamic SVG effects and filters
- **Custom Animation Engine** - Scroll-based scene transitions
- **Complex SVG Illustrations** - Hand-crafted vector graphics

### Development Tools

- **ESLint** - Code linting with Airbnb configuration
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Webpack Bundle Analyzer** - Bundle size analysis

## 📁 Project Structure

```
src/
├── scene/           # Main interactive scene components
│   ├── index.js     # Scene component with SVG rendering
│   ├── scene.svg    # Complex interactive SVG illustration
│   ├── transitions.js    # Animation definitions
│   ├── tickFunction.js   # Animation engine
│   └── ...
├── styles/          # CSS and styling
├── subtitles/       # Text content and subtitles
├── images/          # Static assets
└── index.js         # Application entry point
```

## 🎨 Key Technical Achievements

### SVG Animation System

- **Scroll-triggered animations** with precise timing control
- **Gradient preservation** during complex transformations
- **Performance optimized** rendering for large SVG files
- **Cross-browser compatible** animation engine

### Modern React Architecture

- **React 18** with createRoot API
- **Functional components** with hooks
- **Performance optimized** with React.memo
- **Clean separation** of concerns

### Advanced Webpack Configuration

- **Development/Production** optimized builds
- **Code splitting** for optimal loading
- **Asset optimization** with modern loaders
- **SVG processing** with @svgr/webpack
- **Fast development** with filesystem caching

## 🐛 Known Issues & Solutions

### SVG Gradient Rendering

The project includes custom solutions for preserving SVG gradient `stop-color` attributes during animations. The animation system has been modified to prevent opacity inheritance issues that could break gradient definitions.

## � Development & Debugging

### Animation Debugger

The project includes a powerful real-time animation debugger to help understand and modify the complex scene transitions:

**Toggle Debugger:** Press `Ctrl/Cmd + D` in the browser

**Features:**

- 📊 Real-time timing and progress information
- 🎭 Current scene and animation state
- 📅 Complete scene timeline with status indicators
- 🎯 List of currently active animated elements
- 🔍 Scene-by-scene breakdown with timing details

**Console Commands:**

```javascript
// Available in browser console
animationDebugger.jumpToScene("company"); // Jump to specific scene
animationDebugger.listScenes(); // Show all available scenes
animationDebugger.exportState(); // Export current state as JSON
animationDebugger.logState(); // Log detailed state info
```

For detailed debugging information, see [ANIMATION_DEBUG.md](./ANIMATION_DEBUG.md).

### Making Changes

1. **Use the debugger** to understand current animation state
2. **Modify timing** in the `SCENE_TIMING` object in `transitions.js`
3. **Add new animations** using the existing generator patterns
4. **Test changes** with the real-time debugger feedback

## Project Status ✅

This project has been successfully modernized with the following improvements:

### ✅ Completed Modernization

- **React 18** with latest features and concurrent mode support
- **Webpack 5** with improved bundling and tree-shaking
- **Modern build tools** (Babel 7, PostCSS, CSS optimization)
- **Animation system refactor** for improved maintainability
- **Development tooling** with hot module replacement and source maps

### ✅ Animation Debugging System

- **Real-time animation debugger** available in development mode only
- **Toggle with Ctrl/Cmd+D** to show/hide the debug overlay
- **Zero production overhead** - debug code is completely excluded from production builds
- **Console API** available at `window.animationDebugger` in development

### ✅ Bundle Optimization

- **Production build size reduced by ~88%** (181KB → 23KB) through effective tree-shaking
- **Development-only features** properly excluded from production
- **SVG optimizations** with proper gradient and animation preservation

### ✅ Code Quality

- **Modular architecture** with clear separation of concerns
- **Comprehensive documentation** including animation debugging guide
- **Test coverage** for utility functions
- **Modern JavaScript** with ES6+ features and proper bundling

## �📄 License

This project is licensed under [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/).

**You are free to:**

- Share — copy and redistribute the material in any medium or format

**Under the following terms:**

- **Attribution** — You must give appropriate credit
- **NonCommercial** — You may not use the material for commercial purposes
- **NoDerivatives** — You may not distribute modified material

## 👨‍💻 Author

**Albino Tonnina**

- Website: [albinotonnina.com](http://www.albinotonnina.com)
- Email: albinotonnina@gmail.com
- LinkedIn: [linkedin.com/in/albinotonnina](https://www.linkedin.com/in/albinotonnina/)
- GitHub: [@albinotonnina](https://github.com/albinotonnina)

## 🤝 Contributing

While this is a personal portfolio project, feedback and suggestions are welcome! Please feel free to open an issue or reach out directly.

---

_Built with ❤️ and lots of ☕_
