UniSafe Web Application  

Overview  
UniSafe is a web application designed to provide a secure and organized platform for managing users, payments, and dashboards for different roles, including customers, employees, and administrators.  

Features  
User Authentication Secure login functionality for customers, employees, and administrators.  

Role-Based Dashboards  
Customer Dashboard Users can access their dashboard after login.  
Employee Dashboard Employees can view all previous payments and query them.  
Admin Dashboard Administrators have access to manage the system, including user creation.  

Payment Portal Customers can make payments through a dedicated payment page.  
Admin Privileges Only administrators can create new users.  
Secure Navigation Users are redirected to their appropriate dashboard based on their role after login.  

Installation  

Prerequisites  
Ensure you have the following installed on your system  
Node.js  
npm 

Setup: 

1. Install dependencies  
npm install  

2. Start the development server  
npm start  

Project Structure  

src/components/  
AuthForm.jsx Handles user authentication login page  
Dashboard.jsx Customer dashboard  
EmployeeDash.jsx Employee dashboard where employees can view and query previous payments  
AdminDash.jsx Admin dashboard where administrators can create new users  
PaymentPortal.jsx Handles payments from customers  

src/utils/  
axiosInstance.js Configures Axios for API requests  

App.js Main application file handling routes  

Usage  
Users log in with their credentials.  
After login, users are redirected based on their role  
Customers go to /dashboard  
Employees go to /employee-dashboard  
Admins go to /admin-dashboard  

The payment portal allows customers to make payments securely.  
Employees can review and query past payments.  
Admins can manage users and create new accounts.  

Technologies Used  
React.js Frontend Framework  
React Router Navigation  
Axios API Calls  
Node.js and Express.js Backend API handling  
