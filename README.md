# MERN_AUTHENTICATION

MERN_AUTHENTICATION is a full-stack authentication system built with the MERN stack (MongoDB, Express.js, React, Node.js). It provides secure user registration, login, email verification, and password reset flows.

## Features

- User registration and login with hashed passwords (bcrypt)  
- JWT authentication with cookies (httpOnly, secure in production)  
- Email verification via OTP using Nodemailer  
- Password reset via OTP with expiry  
- Logout with cookie clearing  
- User data API to fetch account details (name, verification status)  
- Middleware protection for private routes  
- MongoDB with Mongoose schemas for user data  

## Tech Stack

- **MongoDB** – database  
- **Express.js** – backend framework  
- **React** – frontend (to be added)  
- **Node.js** – runtime environment  

## Getting Started

1. Clone the repo:  
   ```bash
   git clone https://github.com/himanii777/MERN_AUTHENTICATION.git
   cd MERN_AUTHENTICATION
