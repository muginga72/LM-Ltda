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
