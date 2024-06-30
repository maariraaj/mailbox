import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignUp from './components/authentication/SignUp';
import SignIn from './components/authentication/SignIn';
import Home from './components/Home';
import ComposeMail from './components/ComposeMail/ComposeMail';
import RootLayout from './components/NavBar/Root';
import Inbox from './components/Inbox/Inbox';
import SentMail from './components/SentMail/SentMail';
import MailPage from './components/Inbox/MailPage';
import { useSelector } from 'react-redux';
import SentMailPage from './components/SentMail/SentMailPage';

const App = () => {
  const { isLoggedIn } = useSelector((state) => state.signin);
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <RootLayout />
      ),
      children: [
        { path: '/', element: isLoggedIn ? <Home /> : <SignIn /> },
        { path: "/signin", element: isLoggedIn ? <Home /> : <SignIn /> },
        { path: "/signup", element: isLoggedIn ? <Home /> : <SignUp /> },
        { path: "/compose", element: isLoggedIn ? <ComposeMail /> : <SignIn /> },
        { path: "/inbox", element: isLoggedIn ? <Inbox /> : <SignIn /> },
        { path: "/inbox/:mailId", element: isLoggedIn ? <MailPage /> : <SignIn /> },
        { path: "/sent", element: isLoggedIn ? <SentMail /> : <SignIn /> },
        { path: "/sent/:sentMailId", element: isLoggedIn ? <SentMailPage /> : <SignIn /> },
      ]
    }
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App;
