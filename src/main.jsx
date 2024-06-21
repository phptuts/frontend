import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Upload from "./pages/Upload.jsx";
import Videos from "./pages/Videos.jsx";
import AuthProvider from "./context/auth.context.jsx";
import { initializeApp } from "firebase/app";
import Video from "./pages/Video.jsx";
import Protected from "./components/Protected.jsx";
import Error from "./pages/Error.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/upload",
        element: (
          <Protected>
            <Upload />
          </Protected>
        ),
      },
      {
        path: "/videos",
        element: (
          <Protected>
            <Videos />
          </Protected>
        ),
      },
      {
        path: "/videos/:videoId",
        element: (
          <Protected>
            <Video />
          </Protected>
        ),
      },
    ],
  },
]);
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
