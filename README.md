# Ghana eVisa Portal - Frontend

A modern Next.js application for Ghana's electronic visa application system.

## 🚀 **Vercel Deployment Guide**

### **Step 1: Prepare Your Repository**
```bash
# Ensure all changes are committed
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### **Step 2: Deploy to Vercel**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js and configure settings
5. Click **"Deploy"**

### **Step 3: Configuration (Already Done)**
✅ **vercel.json** - Optimized for Next.js  
✅ **next.config.js** - Production ready  
✅ **package.json** - Build scripts configured  

### **Step 4: Custom Domain (Optional)**
1. In Vercel Dashboard → Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## 🛠️ **Local Development**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn

### **Setup**
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### **Build for Production**
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 **Project Structure**

```
frontend/
├── app/                    # Next.js app router
│   ├── page.tsx           # Homepage
│   ├── dashboard/         # Dashboard pages
│   ├── login/             # Authentication
│   └── verify/            # Visa verification
├── components/            # Reusable UI components
├── lib/                  # Utilities and types
├── public/               # Static assets
├── vercel.json          # Vercel configuration
└── next.config.js       # Next.js configuration
```

## 🎯 **Features**

- **Homepage**: Landing page with visa information
- **Dashboard**: Multi-role dashboard (Applicant, GIS, MFA, Admin)
- **Application Form**: Complete visa application flow
- **Payment Integration**: Multiple payment methods
- **Document Upload**: File management system
- **Real-time Updates**: Live status tracking

## 🔧 **Environment Variables**

Create `.env.local` for local development:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 📦 **Deployment Notes**

- **Framework**: Next.js 16 with App Router
- **Rendering**: Server-Side Rendering (SSR)
- **Build**: Optimized production build
- **Performance**: Edge caching enabled
- **Security**: Security headers configured

## 🌐 **Vercel Features Used**

- ✅ Automatic deployments from GitHub
- ✅ Preview environments for pull requests
- ✅ Edge caching globally
- ✅ Custom domain support
- ✅ SSL certificates
- ✅ Analytics and performance monitoring

## 📞 **Support**

For deployment issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Ensure all dependencies are installed
4. Check build output for errors

---

**🎉 Your Ghana eVisa Portal is ready for Vercel deployment!**
