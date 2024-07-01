import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Layout from "./pages/app/Layout";
import Forgot from "./pages/auth/Forgot";
import Recovery from "./pages/auth/Recovery";
import Home from "./pages/app/Home";
import { getCookie } from "./utils/Cookies";
import { useEffect, useState } from "react";
import useAuthStore from "./store/useAuthStore";
import Spinner from "./components/Spinner";
import Favorites from "./pages/app/Favorites";

const Protector = ({ element }: { element: JSX.Element }): JSX.Element => {
  const { setUser, setToken } = useAuthStore();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = getCookie('jwtToken');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [setUser, setToken]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return element;
};

const AuthRoute = ({ element }: { element: JSX.Element }): JSX.Element => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = getCookie('jwtToken');

      if (storedUser && storedToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <Spinner />
  }

  if (isAuthenticated) {
    return <Navigate to="/app/home" />;
  }

  return element;
};

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        path: 'login',
        element: <AuthRoute element={<Login />} />
      },
      {
        path: 'register',
        element: <AuthRoute element={<Register />} />
      },
      {
        path: 'forgot',
        element: <AuthRoute element={<Forgot />} />
      },
      {
        path: 'recovery/:userId/:recoveryHash',
        element: <AuthRoute element={<Recovery />} />
      },
      {
        path: 'app',
        element: <Protector element={<Layout />} />,
        children: [
          {
            path: 'home',
            element: <Home />
          },
          {
            path: 'favorites',
            element: <Favorites />
          }
        ]
      }
    ]
  }
]);

const Router = () => <RouterProvider router={router} />

export default Router;
