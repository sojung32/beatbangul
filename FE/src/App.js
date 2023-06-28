import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import "./styles/style.scss";
import Calendar from './pages/Calendar';
import Information from './pages/Information';
import Main, { loader as MainLoader } from './pages/Main';
import Form from './pages/Form';
import Layout from './pages/Layout';
import Login from './pages/Login';
import ErrorPage from './pages/ErrorPage';
import { AuthContext } from './context/auth-context';
import { useAuth } from './hooks/auth-hook';
import User from './pages/User';
import { useEffect } from 'react';
import { useCate } from './hooks/category-hook';

const basicPages = [
  { 
    path: '/', 
    element: <Main />,
    loader: MainLoader,
  },
  { 
    path: '/calendar', 
    element: <Calendar />,
    children: [
      {
        path: ':year',
        children: [
          {
            path: ':month',
            children: [
              {
                path: ':date',
              }
            ]
          }
        ]
      }
    ],
    title: '달력',
  },
  { 
    path: '/introduce', 
    element: <Information />,
    title: '소개',
  },
  { 
    path: '/notice', 
    element: <Information subPage='notice'/>,
    title: '공지사항',
  },
  { 
    path: '/sitemap', 
    element: <Information subPage='sitemap'/>,
    title: '사이트맵',
  },
  { 
    path: '/login', 
    element: <Login />,
    children: [
      {
        path: ':platform',
      }
    ],
    title: '로그인',
  },
  { 
    path: '/form', 
    element: <Form />,
    title: '스케줄 추가',
  },
  {
    path: '/user',
    element: <User/>,
    title: '마이페이지',
  }
];

function App() {
  const {token, platform, login, logout } = useAuth();

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout pages={basicPages}/>,
      errorElement: <ErrorPage/>,
      children: basicPages,
    }
  ]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        platform: platform,
        login: login,
        logout: logout,
      }}
    >
      <RouterProvider router={router}/>
    </AuthContext.Provider>
  );
}

export default App;
