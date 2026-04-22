# 🏥 MediFlow — Rural PHC Intelligence Network

**Bridging Medicine Gaps Across Rural India — Powered by AI + Google Maps.**

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-latest-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![SDG](https://img.shields.io/badge/UN--SDG-Goal--3-009D4D.svg)](https://sdgs.un.org/goals/goal3)

## 🌟 Overview
MediFlow is a high-fidelity intelligence platform designed for the **Google Solution Challenge**. It addresses the critical issue of staggered medicine supply in rural Primary Health Centres (PHCs). By leveraging real-time inventory tracking and AI-driven logistics, MediFlow enables a self-healing medicine network that re-balances resources across districts before shortages become critical.

**Localized for Ernakulam District, Kerala.**

---

## 🚀 Key Features

### 1. **Interactive PHC Network Map**
*   **Live GIS Visualization**: Real-time status of 8 key PHCs (Aluva, Kochi Town, Angamaly, etc.).
*   **Dynamic Alert Nodes**: Visual pulsing for critical stockout zones.
*   **Logistics Visualizer**: Animated truck routes powered by mock Google Maps logic for resource redistribution.

### 2. **Medicine Intelligence Hub**
*   **AI-Reactive Inventory**: Stock levels and "Days Left" estimations recalculate dynamically based on seasonal risks (Monsoon/Summer/Winter).
*   **Auto-Sorting Engine**: Prioritizes life-saving medicines (Antimalarials, Analgesics) based on projected demand.

### 3. **Gemini Intelligence Assistant**
*   **Smart Audit System**: Context-aware AI chatbot that audits PHC data and suggests re-supply routes.
*   **Quick Query Frames**: One-tap buttons for instant network status reports and risk analysis.

### 4. **Smart Swap Engine**
*   **Logistics Optimization**: AI identifies surplus stock in stable PHCs and coordinates automated swaps to critical zones.
*   **Real-time Synchronization**: Inventory metrics and map nodes update instantly upon swap approval.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS v4 (Glassmorphism & High-Contrast Design System)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Animations**: native Tailwind keyframes & Framer-like transitions
- **Intelligence**: Custom state-driven AI briefing engine

---

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/S-Sreelakshmi/MediFlow.git
   cd MediFlow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run locally**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🚢 Deployment Instructions

### **Option 1: Vercel (Recommended)**
1. Sign in to [Vercel](https://vercel.com/).
2. Click **"New Project"** and import your GitHub repository.
3. Vercel will automatically detect Vite. Click **Deploy**.

### **Option 2: GitHub Pages**
1. Install `gh-pages`: `npm install gh-pages --save-dev`
2. Add `base: './'` to your `vite.config.js`.
3. Add these scripts to `package.json`:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
4. Run `npm run deploy`.

---



**Developed by Team MediFlow • GDSC Kerala**
