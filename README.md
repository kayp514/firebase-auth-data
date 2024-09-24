# Firebase Auth Data: Open Source User Management System

Welcome to **Firebase Auth Data**, an open-source project designed to provide a seamless user authentication and data management experience using Firebase. Built with Next.js, it offers a robust platform to manage user accounts and their associated data

## Features

- **User Authentication**: Secure sign-in and sign-up functionality using Firebase Authentication.

- **User Management**: Admin interface to view and manage users, including their email verification status and account status.

- **Responsive Design**: A mobile-friendly interface that adapts to various screen sizes.

- **Dark Mode Support**: A toggle for users to switch between light and dark themes for a personalized experience.

- **Real-Time Updates**: Leveraging Firebase for real-time data fetching and updates.

- **Dashboard Overview**: A dedicated dashboard for users to view their account details and manage settings.

- **Google Cloud Function**: Utilizes a Google Cloud Function to fetch a list of users from the Identity Platform.


## Technologies Used

- **Next.js**: A React framework for building server-side rendered (SSR) applications.
- **Firebase**: Utilizes Firebase Authentication for secure user authentication and Firebase Realtime Database for real-time data storage.
- **Tailwind CSS**: A utility-first CSS framework for styling the application.
- **Google Cloud Function**: We created a function using JavaScript and deployed it on Cloud Run. This function lists all users, which is displayed on the Users page of the system, ensuring efficient and secure data retrieval. The code for the Cloud Function is not included in this repository. If you would like to take a look at it, please reach out to me, and I will be happy to assist.

## Getting Started

To get started with Firebase Auth Data, follow these steps:
1. Clone the repository:
Bash
```bash
git clone https://github.com/kayp514//firebase-auth-data.git
cd firebase-auth-data
```

2. Install dependencies:
Bash
```bash
npm install
```

3. Set up Firebase:
- Create a Firebase project in the Firebase Console.
- Enable Firebase Authentication and Firebase Realtime Database.
- Add your Firebase configuration to the `.env.local` file.

4. Start the development server:
Bash
```bash
npm run dev
```

5. Access the application at `http://localhost:3000`.

## Contributing

We welcome contributions to improve Firebase Auth Data! Please read our [contributing guidelines](CONTRIBUTING.md) for more details.

