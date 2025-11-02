# CI/CD Pipeline Setup Guide

## Quick Start

Your project now has a complete CI/CD pipeline! Here's how to get it running.

## What You Get

- ✅ Automated code linting on every push/PR
- ✅ Automated tests on every push/PR
- ✅ Automated builds with validation
- ✅ Preview deployments for pull requests
- ✅ Production deployments on main branch
- ✅ Security headers configured
- ✅ Asset caching optimized

## Setup Steps

### 1. Get Your Vercel Token

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it: `GitHub Actions CI/CD`
4. Select scope: `Full Account`
5. Click "Create"
6. **Copy the token** (you won't see it again!)

### 2. Add Token to GitHub

1. Go to your GitHub repository
2. Navigate to `Settings` > `Secrets and variables` > `Actions`
3. Click `New repository secret`
4. Name: `VERCEL_TOKEN`
5. Value: Paste your Vercel token
6. Click `Add secret`

### 3. Link Vercel Project (Optional - for local development)

If you want to test Vercel deployments locally:

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to your project
cd digital-menu-v2

# Link to Vercel project
vercel link

# Follow the prompts:
# - Set up and deploy? No
# - Which scope? Your account
# - Link to existing project? Yes
# - What's the name? digital-menu-v2
```

This creates a `.vercel` directory with project configuration.

### 4. Test the Pipeline

#### Option A: Push to Main
```bash
git add .
git commit -m "feat: Add CI/CD pipeline"
git push origin main
```

#### Option B: Create a Pull Request (Recommended)
```bash
# Create a new branch
git checkout -b feat/cicd-pipeline

# Add and commit changes
git add .
git commit -m "feat: Add CI/CD pipeline"

# Push to GitHub
git push origin feat/cicd-pipeline

# Create PR on GitHub
```

### 5. Watch the Magic Happen! ✨

1. Go to your repo's `Actions` tab on GitHub
2. You'll see the `CI/CD Pipeline` workflow running
3. Click on it to watch each step:
   - Lint (30s)
   - Test (45s)
   - Build (1m)
   - Deploy (2m)

## What Happens When?

### On Pull Request
```
1. Code is linted
2. Tests run
3. Build is created
4. Preview deployment to Vercel
5. PR comment with preview URL
```

### On Push to Main
```
1. Code is linted
2. Tests run
3. Build is created
4. Production deployment to Vercel
5. Live site updated: https://digital-menu-nine-fawn.vercel.app
```

## Pipeline Status

Check your pipeline status:
- Go to GitHub repo → `Actions` tab
- Or add this badge to README:

```markdown
![CI/CD](https://github.com/YOUR_USERNAME/digital-menu/actions/workflows/ci.yml/badge.svg)
```

## Troubleshooting

### ❌ "Vercel token is missing"
**Solution:** Add `VERCEL_TOKEN` to GitHub secrets (see step 2 above)

### ❌ "Lint failed"
**Solution:** Run locally and fix:
```bash
npm run lint:fix
git add .
git commit -m "fix: Lint errors"
git push
```

### ❌ "Tests failed"
**Solution:** Run locally and fix:
```bash
npm test
# Fix failing tests
git add .
git commit -m "fix: Update tests"
git push
```

### ❌ "Build failed"
**Solution:** Run locally:
```bash
npm run build
# Check for errors
# Fix them
git add .
git commit -m "fix: Build errors"
git push
```

### ❌ "Deployment failed"
**Possible causes:**
1. Vercel token expired → Create a new one
2. Vercel project not found → Check project settings
3. Build output incorrect → Verify `dist` folder is created

## Configuration Files

Your CI/CD setup includes these files:

### `.github/workflows/ci.yml`
Main pipeline configuration

### `vercel.json`
Vercel deployment settings including:
- Routing rules (SPA support)
- Security headers
- Asset caching
- GitHub integration

### `.github/workflows/README.md`
Detailed pipeline documentation

## Security Features

The pipeline adds these security headers automatically:

- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer info

## Performance Optimizations

- Asset caching: 1 year for /assets/* files
- Immutable assets: Browser never rechecks
- Regional deployment: Served from nearest edge location

## Next Steps

### Optional: Add Code Coverage Reporting

1. Sign up at https://codecov.io
2. Add your repo
3. Get upload token
4. Add `CODECOV_TOKEN` to GitHub secrets
5. Coverage reports will automatically upload!

### Optional: Add Status Badges to README

```markdown
![CI/CD](https://github.com/YOUR_USERNAME/digital-menu/actions/workflows/ci.yml/badge.svg)
![Coverage](https://codecov.io/gh/YOUR_USERNAME/digital-menu/branch/main/graph/badge.svg)
```

## Local Commands

Test everything locally before pushing:

```bash
# Lint
npm run lint

# Fix lint issues
npm run lint:fix

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build
npm run build

# Preview build
npm run preview
```

## Pipeline Metrics

Expected times:
- **Lint:** ~30 seconds
- **Test:** ~45 seconds
- **Build:** ~1 minute
- **Deploy:** ~2 minutes
- **Total:** ~4-5 minutes

## Best Practices

1. ✅ Always create PRs for features → Get preview deployments
2. ✅ Wait for checks to pass → Don't merge failing PRs
3. ✅ Review preview URLs → Test before merging
4. ✅ Keep main stable → Only merge reviewed code
5. ✅ Monitor deployments → Check logs if issues occur

## Support

Having issues? Check:
1. GitHub Actions logs (detailed error messages)
2. Vercel deployment logs
3. Local test runs (reproduce issues locally)

---

## Summary

You're all set! Your pipeline will now:
- ✅ Automatically test every code change
- ✅ Deploy previews for every PR
- ✅ Deploy to production on every main push
- ✅ Keep your code quality high
- ✅ Make deployments worry-free

Happy coding! 🚀
