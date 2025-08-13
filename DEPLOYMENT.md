# 🚀 Deployment Guide

## Prerequisites

Before deploying Monad Mission 7, ensure you have:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Supabase Project**: Create at [supabase.com](https://supabase.com)
3. **GitHub Repository**: Code pushed to GitHub
4. **Environment Variables**: Configured as per `.env.example`

## Step-by-Step Deployment

### 1. Database Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Run Database Migration**
   \`\`\`sql
   -- Execute in Supabase SQL Editor
   CREATE TABLE IF NOT EXISTS leaderboard (
     id SERIAL PRIMARY KEY,
     player_name VARCHAR(50) NOT NULL,
     wallet_address VARCHAR(42),
     score INTEGER NOT NULL,
     time_taken INTEGER NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   CREATE INDEX IF NOT EXISTS idx_leaderboard_score 
   ON leaderboard(score DESC, time_taken ASC);
   \`\`\`

### 2. Vercel Deployment

1. **Connect Repository**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Add Environment Variables**
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   \`\`\`

4. **Deploy**
   - Click "Deploy"
   - Wait for build completion
   - Your game will be live at `your-project.vercel.app`

### 3. Post-Deployment Setup

1. **Test Wallet Connection**
   - Visit your deployed site
   - Connect MetaMask
   - Verify Monad Testnet switching

2. **Test Game Functionality**
   - Play a complete game
   - Verify score submission
   - Check leaderboard display

3. **Test NFT Minting**
   - Reach 20 points
   - Attempt NFT minting
   - Verify transaction on block explorer

## Environment Configuration

### Production Environment Variables

\`\`\`bash
# Required for Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: Custom redirect URL
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://your-domain.vercel.app
\`\`\`

### Security Considerations

1. **Environment Variables**
   - Never commit `.env.local` to version control
   - Use Vercel's environment variable interface
   - Rotate keys regularly

2. **Database Security**
   - Enable Row Level Security (RLS) in Supabase
   - Configure proper API permissions
   - Monitor database usage

3. **Smart Contract Security**
   - Verify contract addresses
   - Use testnet for development
   - Implement proper error handling

## Performance Optimization

### Build Optimization

1. **Bundle Analysis**
   \`\`\`bash
   npm run build
   npm run analyze
   \`\`\`

2. **Image Optimization**
   - Use Next.js Image component
   - Optimize SVGs and icons
   - Implement lazy loading

3. **Code Splitting**
   - Dynamic imports for heavy components
   - Route-based code splitting
   - Component-level optimization

### Runtime Performance

1. **GSAP Optimization**
   - Use `gsap.set()` for initial states
   - Implement proper cleanup
   - Optimize animation timelines

2. **3D Performance**
   - Limit particle count on mobile
   - Use CSS transforms over JavaScript
   - Implement performance monitoring

## Monitoring and Analytics

### Error Tracking

1. **Vercel Analytics**
   - Enable in Vercel dashboard
   - Monitor Core Web Vitals
   - Track user interactions

2. **Custom Logging**
   \`\`\`typescript
   // Add to critical functions
   console.log('Game started:', { timestamp: Date.now() })
   \`\`\`

### Performance Monitoring

1. **Lighthouse Scores**
   - Aim for 90+ performance score
   - Optimize Largest Contentful Paint
   - Minimize Cumulative Layout Shift

2. **Real User Monitoring**
   - Track game completion rates
   - Monitor NFT minting success
   - Analyze user engagement

## Troubleshooting Deployment Issues

### Common Build Errors

1. **TypeScript Errors**
   \`\`\`bash
   npm run type-check
   \`\`\`

2. **Missing Dependencies**
   \`\`\`bash
   npm install --production=false
   \`\`\`

3. **Environment Variable Issues**
   - Check variable names match exactly
   - Verify values are correct
   - Restart deployment after changes

### Runtime Issues

1. **Database Connection**
   - Verify Supabase URL and keys
   - Check network connectivity
   - Review database logs

2. **Blockchain Integration**
   - Confirm MetaMask is installed
   - Verify network configuration
   - Check contract addresses

3. **Performance Issues**
   - Monitor Vercel function logs
   - Check database query performance
   - Optimize heavy animations

## Scaling Considerations

### Database Scaling

1. **Connection Pooling**
   - Use Supabase connection pooling
   - Implement proper connection management
   - Monitor connection usage

2. **Query Optimization**
   - Add database indexes
   - Optimize leaderboard queries
   - Implement caching strategies

### Application Scaling

1. **CDN Configuration**
   - Leverage Vercel's global CDN
   - Optimize static asset delivery
   - Implement proper caching headers

2. **API Rate Limiting**
   - Implement request throttling
   - Add proper error handling
   - Monitor API usage patterns

## Maintenance

### Regular Tasks

1. **Dependency Updates**
   \`\`\`bash
   npm audit
   npm update
   \`\`\`

2. **Database Maintenance**
   - Monitor storage usage
   - Archive old leaderboard entries
   - Backup critical data

3. **Security Updates**
   - Update environment variables
   - Review access permissions
   - Monitor for vulnerabilities

### Monitoring Checklist

- [ ] Application uptime
- [ ] Database performance
- [ ] NFT minting success rate
- [ ] User engagement metrics
- [ ] Error rates and logs
- [ ] Security alerts

---

**Need help?** Check the main README.md or open an issue on GitHub.
