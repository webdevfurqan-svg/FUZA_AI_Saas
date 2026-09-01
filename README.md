# FUZA_AI_Saas 🚀

A production-ready, full-stack AI SaaS application that enables users to register, manage accounts, and interact with an AI-driven assistant in real time. 

Built using a classic server-side rendered architecture with Express and EJS, backed by MongoDB Atlas for data persistence, and powered by OpenRouter for multi-model AI generation.

---

### ✨ Key Features
* **User Authentication:** Secure session-based authentication (Register, Login, Logout) with encrypted password handling.
* **AI Chat Interface:** Clean, responsive chat interface featuring streaming/message handling with OpenRouter API integration.
* **Credit System:** Built-in credit tracking mechanism per user account to monitor AI query limits.
* **Dynamic Views:** Server-rendered UI using EJS templating and modular partials.
* **Database Management:** MongoDB Atlas integration using Mongoose models for user and chat session persistence.

---

### 🛠️ Tech Stack
* **Backend:** Node.js, Express.js
* **Frontend:** EJS (Embedded JavaScript), Vanilla CSS, HTML5
* **Database:** MongoDB Atlas (Mongoose ODM)
* **AI Provider:** OpenRouter API (Meta Llama 3.3 70B)
* **Session Management:** `express-session`
* **Configuration:** `dotenv`