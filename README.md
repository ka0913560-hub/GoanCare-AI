# 🌿 GoanCare AI — Smart Rural Healthcare Assistant 🤖

GoanCare AI is an **AI-powered healthcare assistant** designed to support people in **rural areas** by providing quick, accessible health advice and symptom analysis.  

This project bridges technology and healthcare — making medical information simple, reliable, and available to everyone 🌍  

---

## 🧩 Project Structure

The system is divided into **two major components** 👇  

### 1️⃣ GoanCare-AI (Backend – Web App)
- **Built with:** Node.js + Express  
- **Integrated with:** Google Gemini API (Gemini 2.0 Flash)  
- **Purpose:** Generate AI-driven medical responses  
- **Endpoints:**
  - `/askHealth` — Processes user health queries  
  - `/api/test-gemini` — Tests Gemini API connection  
  - `/api/health` — Returns smart health insights  

---

### 2️⃣ GoanCareApp (Frontend – Mobile App)
- **Framework:** React Native (Expo)
- **Interface:** WhatsApp-style chat UI 💬
- **Connection:** Fetches data from Gemini backend  
- **Key Features:**
  - Real-time medical suggestions  
  - Smooth chat experience  
  - Buildable into `.apk` (like WhatsApp or Facebook)

---

## 🧠 Key Features

✅ Ask any health-related question (e.g. *“What are fever symptoms?”* or *“Home remedies for cold”*)  
✅ AI (Gemini) provides fast, human-like responses  
✅ Simple & intuitive chat interface  
✅ Works locally and can be deployed online  
✅ Future-ready for:
  - Doctor booking integration  
  - Patient record management  

---

## 🧰 Tech Stack

| Component | Technologies Used |
|------------|------------------|
| **Backend** | Node.js, Express, Google Gemini API |
| **Frontend** | React Native, Expo |
| **Build Tool** | EAS CLI |
| **Version Control** | Git & GitHub |

---

## 🏆 Current Status

✅ Backend (Node + Gemini API) working perfectly  
✅ Mobile App running smoothly via Expo  
✅ Gemini integration tested and verified  
✅ App successfully buildable as `.apk`  

---	


🌱 Future Enhancements

🚑 Real-time doctor consultation
📋 Health record management
📍 Geo-based healthcare recommendations
🔔 Push notifications for reminders
npm install
npm start
