# 🚀 Anvaya CRM 

**Anvaya CRM** is a powerful, modern, and aesthetically elegant Lead Management System built for sales teams that demand speed and clarity. Designed with a premium glassmorphic aesthetic, it provides a high-level overview of your sales pipeline while allowing deep dives into individual lead journeys.

---

## 🌟 Key Features

- **📊 Strategic Analytics Dashboard**: Instantly track your pipeline health with real-time distribution charts and performance metrics.
- **⚡ Dynamic Pipeline Tracking**: Monitor leads through 5 distinct stages (*New, Contacted, Qualified, Proposal Sent, Closed*) with synchronized color coding across the entire app.
- **👥 Multi-Agent Collaboration**: Assign leads to specific sales agents and track their individual performance via dedicated agent views.
- **🏷️ Smart Tagging & Filtering**: Categorize leads with custom tags and find what you need instantly with multi-parameter filtering.
- **📝 Contextual Activity Logs**: Never lose context with a built-in commenting system for every lead.
- **🌑 Premium Glassmorphism UI**: A state-of-the-art interface built with Tailwind CSS for a professional, blurred-glass look.

---

## 🏗️ Architecture

```mermaid
graph TD
    subgraph "Frontend (React)"
        A[Dashboard] --> B[API Service]
        C[Leads / Status View] --> B
        D[Agent Management] --> B
    end

    subgraph "Backend (Express)"
        B --> E[Lead Controller]
        B --> F[Agent Controller]
        B --> G[Tag Controller]
        E --> H((MongoDB Atlas))
        F --> H
        G --> H
    end
```

---

## 🛠️ Tech Stack

### **Frontend**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Lucide React](https://img.shields.io/badge/Lucide_React-FFB100?style=for-the-badge)
![Recharts](https://img.shields.io/badge/Recharts-22b573?style=for-the-badge)

### **Backend**
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

---

## ⚙️ Getting Started

To get the project running locally, follow these steps:

### **1. Clone the repository**
```bash
git clone https://github.com/aaquib132/anvaya-crm.git
cd anvaya-crm
```

### **2. Setup Backend**
```bash
cd Backend
npm install
```
Create a `.env` file in the `Backend` directory:
```env
MONGODB_URI=your_mongodb_atlas_uri
PORT=3000
```
Run the server:
```bash
npm run dev
```

### **3. Setup Frontend**
```bash
cd ../frontend
npm install
```
Run the frontend:
```bash
npm run dev
```

---

## 📐 Project Structure

```bash
Anvaya CRM/
├── Backend/          # Express.js Server
│   ├── config/       # DB Connection
│   ├── controllers/  # Business Logic
│   ├── models/       # Mongoose Schemas
│   └── routes/       # API Endpoints
└── frontend/         # React.js App
    ├── src/
    │   ├── components/ # Reusable UI
    │   ├── context/    # Global State
    │   ├── pages/      # View Routes
    │   └── services/   # API Connection
```

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
