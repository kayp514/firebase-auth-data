# Firebase Auth Data: Open Source User Management System

Welcome to **Firebase Auth Data**, an open-source project designed to provide a seamless user authentication and data management experience using Firebase. Built with Next.js, it offers a robust platform to manage user accounts and their associated data. This project is deployed on Vercel for easy access and demonstration.

## Features

- **User Authentication**: Secure sign-in and sign-up functionality using Firebase Authentication.

- **User Management**: Admin interface to view and manage users, including their email verification status and account status.

- **Responsive Design**: A mobile-friendly interface that adapts to various screen sizes.

- **Dark Mode Support**: A toggle for users to switch between light and dark themes for a personalized experience.

- **Real-Time Updates**: Leveraging Firebase for real-time data fetching and updates.

- **Dashboard Overview**: A dedicated dashboard for users to view their account details and manage settings.

- **Google Cloud Function**: Utilizes a Google Cloud Function to fetch a list of users from the Identity Platform.


## Technologies Used

- **Google Cloud Function**: We created a function using JavaScript and deployed it on Cloud Run. This function lists all users, which is displayed on the Users page of the system, ensuring efficient and secure data retrieval. The code for the Cloud Function is not included in this repository. If you would like to take a look at it, please reach out to me, and I will be happy to assist.
- **Next.js**: A React framework for building server-side rendered (SSR) applications.
- **Firebase**: Utilizes Firebase Authentication for secure user authentication and Firebase Realtime Database for real-time data storage.
- **Tailwind CSS**: A utility-first CSS framework for styling the application.

## Getting Started

To get started with Firebase Auth Data, follow these steps:

1. **Clone the repository**:
Bash
   ```bash
   git clone https://github.com/kayp514//firebase-auth-data.git
   cd firebase-auth-data
   ```

2. **Install dependencies**:
Bash
```bash
npm install
```

3. **Set up Firebase**:
- Create a Firebase project in the Firebase Console.
- Enable Firebase Authentication and Firebase Realtime Database.

4. **Create a `.env.local` file** in the root directory of your project with the following content:

   ```
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

   You can find this information in the Firebase Console after creating your project. Log into the Firebase Console, click the settings gear beside "Project Overview" to open "Project Settings," and under the "General" tab, you will find the configuration details.

5. **Start the development server**:
Bash
```bash
npm run dev
```

6. **Access the application** at `http://localhost:3000`.

## Contributing

We welcome contributions to improve Firebase Auth Data! Please read our [contributing guidelines](CONTRIBUTING.md) for more details.

