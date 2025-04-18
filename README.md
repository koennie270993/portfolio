# [Portfolio website](https://koennie270993.github.io/portfolio/)

## Development

This portfolio is built with Jekyll and TypeScript.

### Local Development

1. Install dependencies:
```
npm install
bundle install
```

2. Run development server:
```
npm run watch
```

### Build Process

The build and deployment process is automated through GitHub Actions:
- TypeScript files are compiled with webpack
- Jekyll builds the static site
- Site is deployed to GitHub Pages

**Note:** We're using dynamic script injection to load the bundle.js file instead of a standard script tag, as this ensures proper script loading in the GitHub Pages environment.

### Manual Build

If you want to build locally:
```
npm run build:webpack  # Compile TypeScript
bundle exec jekyll build  # Build Jekyll site
```
