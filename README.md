Professional Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Vite. Features a clean design with smooth animations and professional styling.

## 🚀 Features

- **Modern Design**: Clean, professional layout with smooth animations
- **Responsive**: Fully responsive design that works on all devices
- **Fast Performance**: Built with Vite for lightning-fast development and builds
- **TypeScript**: Full type safety and better development experience
- **Smooth Navigation**: Smooth scrolling between sections
- **Contact Form**: Ready-to-use contact form (needs backend integration)
- **Social Links**: Easy integration with LinkedIn, GitHub, Medium, and other platforms

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.tsx      # Navigation header
│   ├── Header.css
│   ├── Footer.tsx      # Footer component
│   └── Footer.css
├── sections/           # Main page sections
│   ├── Hero.tsx        # Hero/landing section
│   ├── Hero.css
│   ├── About.tsx       # About section with skills
│   ├── About.css
│   ├── Projects.tsx    # Projects showcase
│   ├── Projects.css
│   ├── Contact.tsx     # Contact form and social links
│   └── Contact.css
├── App.tsx             # Main app component
├── App.css             # Global styles
├── index.css           # Base styles and resets
└── main.tsx            # App entry point
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd portfolio
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎨 Customization

### Personal Information

Update the following files with your personal information:

1. **Hero Section** (`src/sections/Hero.tsx`):

   - Change "Your Name" to your actual name
   - Update the subtitle and description
   - Replace the avatar placeholder

2. **About Section** (`src/sections/About.tsx`):

   - Update the about text with your story
   - Modify the skills array with your technologies
   - Update the statistics

3. **Projects Section** (`src/sections/Projects.tsx`):

   - Replace the example projects with your actual projects
   - Update project URLs, descriptions, and technologies
   - Add or remove projects as needed

4. **Contact Section** (`src/sections/Contact.tsx`):

   - Update email address and location
   - Modify social media links
   - Update availability status

5. **HTML Meta Tags** (`index.html`):

   - Update the title, description, and author meta tags

### Styling

The portfolio uses CSS modules for styling. You can customize:

- **Colors**: Update CSS custom properties in each component's CSS file
- **Fonts**: Change the Google Fonts import in `src/index.css`
- **Layout**: Modify grid layouts and spacing in component CSS files
- **Animations**: Adjust or add new animations in the CSS files

### Adding New Sections

1. Create a new component in the `src/sections/` directory
2. Add the corresponding CSS file
3. Import and add the component to `src/App.tsx`
4. Update the navigation in `src/components/Header.tsx`

## 📱 Responsive Design

The portfolio is fully responsive and includes:

- Mobile-first design approach
- Flexible grid layouts
- Responsive typography
- Touch-friendly navigation
- Optimized images and icons

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Deploy to Vercel

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
vercel
```

### Deploy to Netlify

1. Build the project:

```bash
npm run build
```

2. Drag and drop the `dist` folder to Netlify

### Deploy to GitHub Pages

1. Install gh-pages:

```bash
npm install --save-dev gh-pages
```

2. Add deploy script to `package.json`:

```json
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

3. Deploy:

```bash
npm run build
npm run deploy
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📞 Support

If you have any questions or need help customizing the portfolio, feel free to reach out!
