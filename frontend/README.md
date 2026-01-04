# Vite + React + TypeScript Frontend

Modern React frontend for Bank Churn Prediction MLOps system.

## Prerequisites

- Node.js 16+
- npm or yarn
- Git

## Local Development

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Create `.env.local` File

```bash
VITE_BACKEND_URL=https://bank-churn.blackbay-c234dcf2.italynorth.azurecontainerapps.io
VITE_API_KEY=your-api-key-here
```

### 3. Run Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## Deployment on Vercel

### Option 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Deploy**

   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables**
   - During deployment, Vercel will ask you to add environment variables
   - Add `VITE_BACKEND_URL` and `VITE_API_KEY`

### Option 2: Connect GitHub Repository

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Set the following:

   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables in Vercel dashboard:

   - `VITE_BACKEND_URL`: Your Azure backend URL
   - `VITE_API_KEY`: Your API key

6. Click "Deploy"

## Environment Variables

Create `.env.local` file in the `frontend` directory:

```env
VITE_BACKEND_URL=https://bank-churn.blackbay-c234dcf2.italynorth.azurecontainerapps.io
VITE_API_KEY=your-api-key-here
```

## Features

- 🔮 **Single Prediction**: Real-time churn prediction for individual customers
- 📊 **Batch Prediction**: Upload CSV files for bulk predictions
- 📈 **Monitoring**: Check API health and detect data drift
- 🎨 **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- 🚀 **Fast Performance**: Optimized with Vite

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── client.ts          # API client
│   ├── components/
│   │   ├── PredictionTab.tsx  # Single prediction
│   │   ├── BatchTab.tsx       # Batch prediction
│   │   ├── MonitoringTab.tsx  # Monitoring & drift
│   │   ├── PredictionCard.tsx # Result display
│   │   └── SettingsModal.tsx  # Settings
│   ├── App.tsx                 # Main app
│   ├── main.tsx                # Entry point
│   └── index.css               # Styles
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── package.json
└── tsconfig.json
```

## API Endpoints Used

- `GET /health` - Check API health
- `POST /predict` - Make prediction
- `POST /drift/check` - Check for data drift

## Troubleshooting

### "Cannot find module" errors

```bash
npm install
```

### Port 5173 already in use

```bash
npm run dev -- --port 3000
```

### Build errors

Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Support

For issues, check the backend logs and ensure:

- Backend URL is correct
- API key is valid
- Backend is running and accessible

---

Built with ❤️ by the MLOps team
