# 🎉 EventFesta

**EventFesta** is a powerful full-stack event management platform built with **Spring Boot** and **React.js**. It bridges the gap between organizers and participants through an intuitive interface, smart email notifications, and secure payment integration.

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-blue.svg" />&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/Spring_Boot-3.x-brightgreen.svg" />&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/React-18-blue.svg" />&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/MongoDB-green.svg" />&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/Razorpay-Enabled-blue.svg" />
</p>



---

## ✨ Features

### 🎭 Role-Based Access
- **Organizers**: Create, update, and manage events.
- **Participants**: Explore and register for events.

### 📧 Smart Email Notifications
- Personalized event suggestions based on interests and tags.
- Reminder emails sent 24 hours before an event.

### 📊 Analytics Dashboard
- Month-wise and location-based event insights.
- Download participant lists (registered, upcoming, past) in CSV format.

### 💳 Payment Integration
- Support for **free** and **paid** events.
- Integrated with **Razorpay** for smooth transactions.

---

## 🧰 Tech Stack

| Layer         | Technologies                             |
|---------------|------------------------------------------|
| **Backend**   | Spring Boot, Spring Security, MongoDB    |
| **Frontend**  | React.js, Axios, Tailwind CSS            |
| **Database**  | MongoDB                                  |
| **Payment**   | Razorpay                                 |
| **Testing**   | Postman                                  |

---

## ⚙️ Getting Started

### ✅ Prerequisites

Make sure you have the following installed:

- Java 17+
- Maven
- Node.js and npm
- MongoDB
- IDE of your choice (VSCode / IntelliJ)

---

## 🧪 Installation & Setup

### 🔁 Clone the Repository

```bash
git clone https://github.com/KuldipVaghasiya19/EventFesta.git
cd EventFesta

```
### 🖥️ Backend Setup (Spring Boot)
```bash
cd backend
```
### Update src/main/resources/application.properties:
```bash
properties

SET ALL PROPERTIES
```

### Run the backend:

```bash
mvn spring-boot:run
```

### 🌐 Frontend Setup (React)
```bash
cd ../frontend
npm install
```

### Create a .env file in the root of the frontend directory:

```bash
REACT_APP_API_URL=http://localhost:8080
```

### Start the React development server:

```bash

npm start
```
### 🙌 Ready to Use!
Visit the frontend at: http://localhost:3000
Backend should be running on: http://localhost:8080

🎉 Enjoy managing your events with EventFesta!
