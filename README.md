# DBMS (Group 5)

This project is a web application that consists of both frontend and backend components.

* Frontend - React.js 
* Backend - Express.js
* Database - MongoDB

#### http://ec2-13-200-180-49.ap-south-1.compute.amazonaws.com/
Frontend URL
#### https://backend-ssnn.onrender.com/
Backend URL

Frontend and Backend are integrated.

## Frontend

To run the frontend locally, navigate to the `frontend` directory:

```bash
cd frontend
npm i # Install dependencies
npm start # Start the development server

The frontend utilizes Tailwind CSS. Running locally implies the application will be served on localhost:3000.
```
## Backend
To run the backend locally, navigate to the backend directory:

```bash
cd backend
npm i # Install dependencies
nodmon app.js # Start the development server   
```
Additionally, you need to create a .env file in the backend directory and paste the environment variables in the format mentioned in **envformat** in root of backend directory.
## Deployment

Backend of this project is deployed on render.
Frontend of this project is deployed on vercel.


## Dependencies
The backend has the following dependencies:

#### Backend

| Dependency       | Version | Description                                                                                         |
|------------------|---------|-----------------------------------------------------------------------------------------------------|
| cookie-parser    | 1.4.6  | Middleware for parsing cookies in Express.                                                          |
| cors             | 2.8.5  | Middleware for enabling Cross-Origin Resource Sharing (CORS) in Express.                             |
| dotenv           | 16.4.5 | Loads environment variables from a .env file into process.env.                                       |
| express          | 4.18.2 | Web framework for Node.js, used for building the backend REST APIs.                                  |
| jsonwebtoken     | 9.0.2  | Library for generating and verifying JSON Web Tokens (JWT) for authentication.                       |
| mongoose         | 8.2.1  | MongoDB object modeling tool designed to work in an asynchronous environment.                        |
| morgan           | 1.10.0 | HTTP request logger middleware for Node.js.                                                          |
| nodemailer       | 6.9.12 | Library for sending emails with Node.js.                                                             |
| nodemon          | 3.1.0  | Utility that automatically restarts the server when changes are detected in the source code.         |
| razorpay         | 2.9.2  | Library for integrating Razorpay payment gateway with Node.js applications.                          |
| ws               | 8.16.0 | Library for creating WebSocket servers and clients.      

#### Frontend


| Dependency                   | Description                                                                                         |
|------------------------------|-----------------------------------------------------------------------------------------------------|
| react                        | A JavaScript library for building user interfaces.                                                  |
| react-dom                    | Provides DOM-specific methods that can be used at the top level of your app.                         |
| react-scripts                | Set of scripts and configuration used by Create React App.                                                                   |
| web-vitals                   | Tooling to measure real-user website performance.                                                    |
                                            

## Interim: Dummy Data
This system incorporates dummy data for administrative purposes. It comprises:

 * 5 halls
*  5 wings
*  1 Washerman is assigned to 1 hall

(Note: The washerman may be assigned to multiple halls as required)

## Assumptions
**Assignment of Washerman :**
>1. The allocation of wing to a washerman is managed by administration.                     
>2. The administration, which could be any student authority, or    hall administration handles this responsibility.
>3. Initially, washers must contact the administration to obtain their login credentials.

**Login Credentials:** 
> 1. Washermen are required to provide their contact number and password during login. (The password is issued by the administration.)
>2. Students are required to provide their roll number and password(created on First login). 
>3. The student's OTP will be sent to their IITK email address.
