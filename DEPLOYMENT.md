# KnowledgeDocs Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the easiest deployment for Next.js applications:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository

3. **Configure Environment Variables**
   In Vercel dashboard, add these environment variables:
   ```
   GITHUB_TOKEN=your_github_token
   GITHUB_OWNER=your_github_username
   GITHUB_REPO=your_repo_name
   GITHUB_BRANCH=main
   GITHUB_ARTICLES_PATH=articles
   ```

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-app.vercel.app`

### Option 2: Manual Build & Deploy

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Deploy to your hosting provider**
   - Upload the `.next` folder and other files
   - Configure environment variables
   - Start the Node.js server

## 🔧 Environment Configuration

### Required Environment Variables

```env
# GitHub API Configuration
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=your-username
GITHUB_REPO=your-repo-name
GITHUB_BRANCH=main
GITHUB_ARTICLES_PATH=articles

# Optional App Configuration
NEXT_PUBLIC_APP_NAME=KnowledgeDocs
NEXT_PUBLIC_APP_DESCRIPTION=Simple. Structured. Smart.
```

### GitHub Token Permissions

Your GitHub token needs these permissions:
- **Public repositories**: `public_repo` scope
- **Private repositories**: `repo` scope

## 📁 Repository Structure Requirements

Your documentation repository should follow this structure:

```
your-docs-repo/
└── articles/
    ├── 1_browser/
    │   ├── 0_browser.md              # Category main page
    │   ├── 1_browser_basics.md       # Article 1
    │   └── 2_browser_apis.md         # Article 2
    ├── 2_javascript/
    │   ├── 0_javascript.md
    │   ├── 1_js_basics.md
    │   └── 2_js_advanced.md
    └── 3_react/
        ├── 0_react.md
        ├── 1_react_basics.md
        └── 2_react_hooks.md
```

### File Naming Convention

- **Categories**: `{number}_{category_name}/`
- **Main pages**: `0_{category_name}.md` (optional)
- **Articles**: `{number}_{article_name}.md`

## 🎯 Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test GitHub API connection
- [ ] Check category navigation
- [ ] Test article rendering
- [ ] Verify search functionality
- [ ] Test theme switching
- [ ] Check mobile responsiveness
- [ ] Verify error handling for missing files

## 🔍 Troubleshooting

### Common Issues

1. **GitHub API Rate Limits**
   - Use authenticated requests with a token
   - Consider caching for high-traffic sites

2. **Missing Articles**
   - Check file paths and naming conventions
   - Verify repository structure
   - Check GitHub token permissions

3. **Build Errors**
   - Ensure all dependencies are installed
   - Check TypeScript errors
   - Verify environment variables

### Debug Mode

Enable debug logging by adding:
```env
NODE_ENV=development
```

## 📊 Performance Optimization

### For Production

1. **Enable caching**
   ```javascript
   // In next.config.js
   module.exports = {
     experimental: {
       staleTimes: {
         dynamic: 30,
         static: 180,
       },
     },
   }
   ```

2. **Optimize images**
   - Use Next.js Image component
   - Enable image optimization

3. **Enable compression**
   - Most hosting providers enable this by default
   - For custom servers, use compression middleware

## 🔒 Security Considerations

1. **GitHub Token Security**
   - Never commit tokens to repository
   - Use environment variables only
   - Rotate tokens regularly

2. **CORS Configuration**
   - Configure allowed origins if needed
   - Use HTTPS in production

3. **Rate Limiting**
   - Implement rate limiting for search
   - Cache GitHub API responses

## 📈 Monitoring

### Recommended Monitoring

1. **Vercel Analytics** (if using Vercel)
2. **Google Analytics** for user tracking
3. **Sentry** for error tracking
4. **GitHub API rate limit monitoring**

---

Your KnowledgeDocs application is now ready for production! 🎉

