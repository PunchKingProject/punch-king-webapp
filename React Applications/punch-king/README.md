

---

# 🥊 PunchKing Boxing Platform

**PunchKing** is a mobile-responsive boxing promotion web app that connects verified boxing teams, fans, and sponsors in one platform.
Fans can sponsor teams to boost their rankings, teams can apply for certification and manage subscriptions, and admins oversee verifications and payments — all within a clean and modern interface built with **React + TypeScript + Vite**.

---

## 🚀 Features

### 👑 Admin Dashboard

* View and filter all registered boxing teams
* Approve certifications, subscriptions, and sponsorship credits
* Manage team visibility and rankings

### 🥊 Team Dashboard

* Register and manage team profiles
* Apply for certification and upload proof of payment
* Subscribe to PunchKing plans (₦10,000/year or ₦5,000/6 months)
* Upload videos/photos and monitor sponsorship votes

### 💸 Sponsor Dashboard

* Browse and vote for verified boxing teams
* Purchase vote credits and submit payment proofs
* View rankings and interact with team posts

### 🌍 Public Landing Page

* Hero section with CTA: *Join as Team / Join as Fan*
* Overview of platform functionality
* Subscription tiers and live team rankings

---

## 🛠️ Tech Stack

* **Frontend:** React 18, TypeScript, Vite
* **UI Framework:** Material-UI (MUI)
* **Routing:** React Router v6
* **State/Data:** TanStack Query, Context API
* **Forms & Validation:** Formik + Yup
* **Utilities:** dayjs, lodash.debounce
* **Build & Tooling:** ESLint, Prettier

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/punchking.git
cd punchking
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start the Development Server

```bash
npm run dev
```

Visit **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🧱 Project Structure

```
src/
├── assets/              # Static images and icons
├── components/          # Reusable UI components
├── pages/               # Page-level views (Admin, Team, Sponsor, etc.)
├── routes/              # Route definitions
├── hooks/               # Custom React hooks
├── context/             # Global state management
├── utils/               # Helper functions
└── App.tsx              # App entry point
```

---

## 🧩 Core Concepts

* **Role-based architecture:** Separate dashboards and routes for Admin, Teams, and Sponsors.
* **Subscription logic:** Teams must be subscribed and certified before appearing in rankings.
* **Sponsorship mechanics:** Likes = Votes; votes are deducted from sponsors’ credit balance.
* **Responsive design:** Optimized layouts for both desktop and mobile experiences.

---



## 🤝 Contributing

Pull requests are welcome!
If you'd like to suggest improvements or new features, please open an issue or submit a PR.

---

## 🧑‍💻 Author

**Damilola Ayodele**
Frontend Engineer
📧 [Ayodeled28@gmail.com](mailto:Ayodeled28@gmail.com)
🌐 [Portfolio](https://dammie-portfolio.netlify.app/)

---

## 📄 License

This project is licensed under the **MIT License**.


