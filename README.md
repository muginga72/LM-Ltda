# 🛠️ LM-Ltd Services Platform

LM-Ltd Services is a scalable, modular web application designed to streamline digital service requests, scheduling, and verification. Built with React, Node.js, and MongoDB, it empowers users to request services, manage schedules, and submit payment proof via secure upload or email.

---

## 🚀 Features

- 🧾 **Service Request Dashboard**  
  Users can submit service requests with details and track their status.

- 📅 **Scheduling System**  
  Schedule services with date/time selection and payment tracking.

- 📤 **Payment Verification Workflow**  
  Upload proof of payment or send confirmation via email to admins.

- 📧 **Admin Notification**  
  Automatic email alerts for uploaded documents and payment confirmations.

- 🔐 **Role-Based Access Control (RBAC)**  
  Admins and users have distinct dashboards and permissions.

- 🧱 **Modular Architecture**  
  Clean separation of routes, controllers, middleware, and utilities.

- 🐳 **Dockerized Dev Environment**  
  Rapid setup with Docker Compose and MongoDB GridFS integration.

---

## 🧰 Tech Stack

| Layer         | Technology                     |
|--------------|---------------------------------|
| Frontend      | React + Bootstrap              |
| Backend       | Node.js + Express              |
| Database      | MongoDB + GridFS               |
| Auth          | JWT-based authentication       |
| File Upload   | Multer + GridFS                |
| Email Service | Nodemailer (Gmail SMTP)        |
| DevOps        | Docker Compose                 |

---

## 📦 Installation

```bash
git clone https://github.com/your-org/lm-ltd-services.git
cd lm-ltd-services
npm install

🔐 Environment Variables
Create a .env file in the root with:
PORT=5000
MONGO_URI=mongodb://localhost:27017/lm-ltd
JWT_SECRET=your_jwt_secret
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your_app_password

## 🐳 Docker Setup

docker-compose up --build

## 📂 File Uploads
Uploaded documents are stored in MongoDB GridFS and served via /uploads/:filename.

## 📧 Email Integration
Users can send payment confirmation emails to:
Recipient: lmj.muginga@gmail.com
Subject: Payment Confirmation
Body: Includes service ID and user details

## 🧪 Testing
npm run test

Includes unit tests for backend routes and service logic.

## 🧑‍💻 Contributing
We welcome contributors! Please follow our onboarding flow:
- Fork the repo
- Clone locally
- Create a feature branch
- Submit a pull request
See CONTRIBUTING.md for full guidelines.

## 📌 Roadmap
- [x] User dashboard with service tracking
- [x] Admin dashboard with verification tools
- [x] File upload and email workflows
- [ ] Stripe integration for direct payments
- [ ] Plugin system for service extensions
- [ ] Multi-language support

## 🛡️ License

MIT License © LM Ltd

## 🤝 Contact
For support or collaboration inquiries:
📧 lmj.muginga@gmail.com
🌐 www.lm-ltd-services.com
