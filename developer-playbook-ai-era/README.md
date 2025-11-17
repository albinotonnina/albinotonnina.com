# Developer's Playbook for the AI Era - Landing Page

A modern, performant landing page for the "Developer's Playbook for the AI Era" book, built with Vite, React, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites

- **Node.js** `>=22.x`
- **Yarn** (recommended)

### Installation

```bash
cd developer-playbook-ai-era
yarn install
```

### Development

```bash
yarn dev
```

The development server will start at `http://localhost:5173`.

### Production Build

```bash
yarn build
```

This generates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
yarn preview
```

## 🛠️ Available Scripts

| Command         | Description                   |
| --------------- | ----------------------------- |
| `yarn dev`      | Start development server      |
| `yarn build`    | Build for production          |
| `yarn preview`  | Preview production build      |
| `yarn lint`     | Lint JavaScript/JSX files     |
| `yarn lint:fix` | Fix auto-fixable linting issues |
| `yarn format`   | Format code with Prettier     |

## 📁 Project Structure

```
src/
├── components/       # React components
│   ├── Hero.jsx      # Hero section
│   ├── Features.jsx  # Features section
│   ├── About.jsx     # About section
│   └── CTA.jsx       # Call-to-action section
├── App.jsx          # Main App component
├── main.jsx         # Entry point
└── index.css        # Global styles with Tailwind

Configuration files:
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── .eslintrc             # ESLint configuration
└── .prettierrc           # Prettier configuration
```

## 🎨 Tech Stack

- **Vite** - Lightning-fast frontend build tool
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📦 Deployment

This project is ready for deployment to Vercel or any static hosting platform.

### Vercel Deployment

1. Push to GitHub
2. Import in Vercel dashboard
3. Set root directory to `developer-playbook-ai-era`
4. Vite will automatically be detected and configured

## 📄 License

Same as parent project (CC BY-NC-ND 4.0)

---

Built with ❤️ by Albino Tonnina
