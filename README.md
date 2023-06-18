# TodoApp Frontend

This is the front-end repository for the TodoApp project. It provides a user interface for managing and organizing tasks.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and login
- Saving user login info 
- Adding new tasks
- Marking tasks as completed
- Removing tasks completetly from your list
- Viewing and managing task lists and completed task lists
- Responsive design for mobile and web platforms

## Technologies Used

- React Native
- Expo
- React Navigation
- Prisma
- TypeScript

## Getting Started

To get started with the TodoApp frontend, follow these steps:

1. Clone this repository to your local machine.
2. Install Node.js (if not already installed).
3. Update the IP address in the following files:

      - `register.tsx`
      - `login.tsx`
      - `home.tsx`

    In each of these files, locate the line where the `SERVER_IP` constant is defined and replace `'192.168.1.4:8000'` with the IP address of your server.
4. Install Expo CLI globally by running `npm install -g expo-cli`.
5. Install project dependencies by running `npm install`.
6. Start the development server by running `npm start`.

## Usage

Once the development server is running, you can use the Expo Go app on your mobile device to scan the QR code and view the app. Alternatively, you can run the app on an iOS or Android emulator.

Make sure the backend server is also running and properly configured to handle API requests from the front-end.
