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

## Screenshots

### Home Page
<img width="1898" height="873" alt="image" src="https://github.com/user-attachments/assets/a22a132d-0de7-4c14-bbeb-a1c11f2f9ecd" />

### Login Page
<img width="1900" height="858" alt="image" src="https://github.com/user-attachments/assets/1fab26b4-8b06-4547-b845-267af3a679d0" />

### Reset Password
<img width="1883" height="855" alt="image" src="https://github.com/user-attachments/assets/e8c0190c-7111-4765-a26b-0c19c7b5fab0" />


## Getting Started

1. Clone the repo:  
   ```bash
   git clone https://github.com/himanii777/MERN_AUTHENTICATION.git
   cd MERN_AUTHENTICATION
