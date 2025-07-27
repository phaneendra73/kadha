
# ✍️ Kadha – A Simple Blog Writing Platform

**Kadha** is a minimalist blog writing platform built using **React** and **Prisma**. This project helped me understand how Prisma works with modern front-end frameworks. Users can write and save markdown-based blog posts in a clean, distraction-free UI.

🔗 **Live Demo**: [https://kadha.onrender.com](https://kadha.onrender.com)
📂 **Repository**: [github.com/phaneendra73/kadha](https://github.com/phaneendra73/kadha)

---

## 📦 Features

* 📝 Write blog posts in **Markdown**
* 📄 Live preview as you type
* 💾 Save and manage your posts (persisted via Prisma DB)
* 🧠 Built to understand **Prisma ORM** integration
* 📱 Responsive layout

---

## 🛠 Tech Stack

* **React** (Frontend)
* **Prisma** (ORM for DB interactions)
* **Express / Node.js** (Backend)
* **SQLite** or **PostgreSQL** (Database)
* **Markdown rendering**

---

## 🚀 Getting Started

### 🔧 Installation

```bash
git clone https://github.com/phaneendra73/kadha.git
cd kadha
npm install
```

### ⚙️ Set Up Prisma

```bash
npx prisma init
# update your .env with DATABASE_URL
npx prisma migrate dev --name init
```

### ▶️ Run the App

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🖼️ Screenshot

<img width="1897" height="903" alt="image" src="https://github.com/user-attachments/assets/e657be2a-33dd-48a5-beda-d334dd5f40b5" />

---

## 📌 License

MIT — Free to use for personal or learning purposes.
