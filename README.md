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

**Note:** Currently, the bundle.js file is temporarily committed to the repository (in assets/js/) to ensure GitHub Pages compatibility. We'll revisit the CI/CD approach later.

### Manual Build

If you want to build locally:
```
npm run build:webpack  # Compile TypeScript
bundle exec jekyll build  # Build Jekyll site
```
