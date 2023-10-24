# FILO - Post Message and Like Web App

Welcome to FILO, a simple web app that allows you to create and like post messages. This README will guide you through the setup process.

## Prerequisites

### Clone the Git Repository and make sure you are in the main directory

Before you begin, ensure you have Node.js and npm installed on your system. If you don't have them, you can install them using the following steps:

1. **Node.js**: Download and install Node.js from [nodejs.org](https://nodejs.org/).

2. **npm (Node Package Manager)**: npm is usually bundled with Node.js. To verify if you have npm installed, open your terminal or command prompt and run:
   ```bash
   npm -v
   ```
3. After installing npm, run the following command to install the React dependencies:
   ```bash
   npm i
   ```
4. Then build the project in the FILO directory using the following command:
   ```bash
   npm run build
   ```
5. Finally, run the project using the command:
   ```bash
   docker-compose up --build --force-recreate
   ```

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
