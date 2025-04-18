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

No need to commit built files (`js/` directory) as they are generated during the CI/CD pipeline.

### Manual Build

If you want to build locally:
```
npm run build:webpack
bundle exec jekyll build
```
