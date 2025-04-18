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

**Note:** We're currently working through an issue with how GitHub Pages deploys the site, which may result in a nested directory structure (/portfolio/portfolio/). Our GitHub Actions workflow handles this by placing assets in both possible locations.

### Manual Build

If you want to build locally:
```
npm run build:webpack  # Compile TypeScript
bundle exec jekyll build  # Build Jekyll site
```
