# Project Analysis: Developer's Playbook AI Era Landing Page

## Current Setup Analysis

### Main Portfolio Site

- **Build Tool**: Webpack 5
- **Framework**: React 18
- **Port**: 8080
- **Entry Point**: `src/index.js`
- **Features**: Complex SVG animations, scroll-based scene transitions

### New Landing Page (Developer's Playbook)

- **Build Tool**: Vite 5
- **Framework**: React 18  
- **Port**: 5173 (development)
- **Entry Point**: `src/main.jsx`
- **Styling**: Tailwind CSS + PostCSS
- **Location**: `/developer-playbook-ai-era` folder

## Directory Structure

```
albinotonnina.com/
├── src/                              # Main portfolio site
│   ├── animation/                    # SVG animations
│   ├── styles/                       # Main styles
│   └── ...
├── webpack.config.babel.js           # Main site webpack config
├── package.json                      # Root dependencies
├── vercel.json                       # NEW: Vercel deployment config
└── developer-playbook-ai-era/        # NEW: Book landing page
    ├── src/
    │   ├── components/               # React components
    │   │   ├── Hero.jsx
    │   │   ├── Features.jsx
    │   │   ├── About.jsx
    │   │   └── CTA.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json                  # Sub-project dependencies
    ├── vite.config.js                # Vite configuration
    ├── tailwind.config.js            # Tailwind configuration
    ├── postcss.config.js             # PostCSS configuration
    ├── index.html                    # Entry HTML
    └── README.md                     # Sub-project documentation
```

## Vercel Configuration Strategy

### Current Implementation

Created `vercel.json` in the root directory with:

- **buildCommand**: Builds the developer-playbook-ai-era sub-project
- **installCommand**: Installs root dependencies (yarn)
- **outputDirectory**: Points to `developer-playbook-ai-era/dist`

This configuration ensures Vercel:

1. Installs dependencies from the root
2. Builds the Vite app in the sub-directory
3. Serves the built output from the correct location

### URL Structure

- Main site: `www.albinotonnina.com/`
- Book landing page: `www.albinotonnina.com/developer-playbook-ai-era/`

## Development Workflow

### Local Development - Main Site

```bash
cd albinotonnina.com/
yarn dev
# Runs on localhost:8080
```

### Local Development - Book Landing Page

```bash
cd albinotonnina.com/developer-playbook-ai-era/
yarn install
yarn dev
# Runs on localhost:5173
```

### Production Build - Full Stack

The root `vercel.json` handles the complete build process. When deployed:

1. Root dependencies are installed
2. Vite build command runs for the sub-project
3. Output is served from the correct path

## Technology Decisions

### Why Vite for the Book Landing Page?

1. **Speed**: Much faster builds and dev server compared to Webpack
2. **Modern**: Native ES modules, optimized for modern browsers
3. **Simplicity**: Minimal configuration needed for a landing page
4. **Performance**: Better code splitting and optimization out of the box

### Why Keep Main Site on Webpack?

1. **Existing Setup**: Already heavily optimized for complex SVG animations
2. **Custom Loaders**: SVG ID processing and animation system
3. **Stability**: Well-tested configuration for the portfolio
4. **Separation of Concerns**: Different projects can use different tools

## Package Dependencies

### Shared Across Projects

- React 18
- Prettier
- ESLint

### Main Site Only

- Webpack 5
- D3 Interpolate
- SVG Filter
- Custom animation libraries

### Book Landing Page Only

- Vite 5
- Tailwind CSS
- PostCSS

## Next Steps

1. **Install dependencies** in the new sub-project:

   ```bash
   cd developer-playbook-ai-era
   yarn install
   ```

2. **Test locally**:

   ```bash
   yarn dev
   ```

3. **Build and verify**:

   ```bash
   yarn build
   ```

4. **Commit and push** to GitHub

5. **Deploy** to Vercel (should auto-detect from vercel.json)

## Configuration Files Summary

### Root Level

- `vercel.json` - Deployment configuration for sub-directory builds

### Sub-Project Level

- `vite.config.js` - Vite bundler configuration
- `tailwind.config.js` - Tailwind CSS theme and plugins
- `postcss.config.js` - PostCSS processing pipeline
- `.eslintrc` - Code linting rules
- `.prettierrc` - Code formatting rules
- `.gitignore` - Git exclusions

## Build Optimization

The Vite config includes:

- **Code Splitting**: Vendors separated into their own chunk
- **Terser Minification**: Production code minimized
- **Source Maps**: Disabled in production for smaller bundle size
- **Output Directory**: `dist/` relative to sub-project

## Hosting Considerations

### For Vercel

- Sub-directory builds are fully supported
- Automatic detection of Vite projects
- Zero-config deployment with vercel.json
- Automatic redirects and SPA routing if needed

### For Custom Domains

- The landing page can be served from a subdomain
- Or from a sub-path like shown above
- DNS/routing managed by Vercel

---

**Created**: November 13, 2025
**Status**: Ready for development
