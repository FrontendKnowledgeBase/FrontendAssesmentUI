# Frontend Assesment: KnowledgeDocs

A modern, GitBook-style knowledge base system built with Next.js, React, TypeScript, and shadcn/ui. KnowledgeDocs automatically fetches and displays documentation from a GitHub repository with powerful search, navigation, and theming capabilities.

![KnowledgeDocs](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🚀 Core Functionality

- **GitHub Integration**: Automatically fetches documentation from any GitHub repository
- **Hierarchical Navigation**: Organized category-based navigation with expandable sections
- **Real-time Search**: Intelligent search with autocomplete and keyboard navigation
- **Markdown Rendering**: Full markdown support with syntax highlighting
- **Table of Contents**: Auto-generated TOC from article headings

### 🎨 User Experience

- **GitBook-style Layout**: Professional 3-column layout (navigation, content, TOC)
- **Dark/Light Themes**: Seamless theme switching with persistence
- **Responsive Design**: Mobile-first design with collapsible navigation
- **Fast Performance**: Server-side rendering with optimized loading

### 🛠 Technical Features

- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Built with shadcn/ui components
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Error Handling**: Graceful handling of missing content

## 🏗 Architecture

```
KnowledgeDocs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [category]/         # Dynamic category routes
│   │   ├── [category]/[article]/ # Dynamic article routes
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # React components
│   │   ├── layout/             # Layout components
│   │   ├── common/             # Shared components
│   │   └── ui/                 # shadcn/ui components
│   ├── lib/                    # Utilities and services
│   │   ├── github.ts           # GitHub API service
│   │   ├── markdown.ts         # Markdown processing
│   │   └── utils.ts            # Helper functions
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
└── docs/                       # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- GitHub Personal Access Token

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd knowledgedocs
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your GitHub configuration:

   ```env
   GITHUB_TOKEN=your_github_personal_access_token
   GITHUB_OWNER=repository_owner
   GITHUB_REPO=repository_name
   GITHUB_BRANCH=main
   GITHUB_ARTICLES_PATH=articles
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## ⚙️ Configuration

### GitHub Repository Structure

Your documentation repository should follow this structure:

```
articles/
├── 1_category_name/
│   ├── 0_category_name.md      # Category main page (optional)
│   ├── 1_article_one.md       # Article files
│   ├── 2_article_two.md
│   └── ...
├── 2_another_category/
│   ├── 0_another_category.md
│   ├── 1_some_article.md
│   └── ...
└── ...
```

### Environment Variables

| Variable               | Description                   | Required               |
| ---------------------- | ----------------------------- | ---------------------- |
| `GITHUB_TOKEN`         | GitHub Personal Access Token  | Yes                    |
| `GITHUB_OWNER`         | Repository owner/organization | Yes                    |
| `GITHUB_REPO`          | Repository name               | Yes                    |
| `GITHUB_BRANCH`        | Branch to fetch from          | No (default: main)     |
| `GITHUB_ARTICLES_PATH` | Path to articles directory    | No (default: articles) |

### GitHub Token Setup

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with `repo` scope (for private repos) or `public_repo` (for public repos)
3. Add the token to your `.env` file

## 🎯 Usage

### Navigation

- **Categories**: Organized in the left sidebar with expandable sections
- **Articles**: Listed under each category with clear hierarchy
- **Search**: Use the search bar to find articles across all categories
- **Themes**: Toggle between light and dark themes using the theme button

### Content Management

- **Markdown Support**: Full GitHub Flavored Markdown support
- **Auto-sync**: Content automatically syncs from your GitHub repository
- **Live Updates**: Changes in your repository are reflected immediately

### Customization

- **Branding**: Update app name and description in environment variables
- **Styling**: Customize themes and colors in the Tailwind configuration
- **Layout**: Modify components in the `src/components` directory

## 🛠 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Project Structure

- **`src/app/`**: Next.js App Router pages and layouts
- **`src/components/`**: Reusable React components
- **`src/lib/`**: Utility functions and services
- **`src/types/`**: TypeScript type definitions

### Key Components

- **`MainLayout`**: Main application layout with 3-column structure
- **`NavigationSidebar`**: Hierarchical navigation component
- **`SearchComponent`**: Real-time search with autocomplete
- **`GitHubService`**: Service for GitHub API interactions

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Add environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** - The React framework for production
- **shadcn/ui** - Beautiful and accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **GitHub API** - For seamless content integration
- **Vercel** - For excellent deployment platform

## 📞 Support

If you have any questions or need help:

1. Check the [documentation](docs/)
2. Search existing [issues](issues)
3. Create a new [issue](issues/new)

---

**Built with ❤️ using Next.js, React, and TypeScript**
