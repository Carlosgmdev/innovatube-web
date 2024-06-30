import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Layout from "./pages/app/Layout";

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'app',
        element: <Layout />
      }
    ]
  }
])

const Router = () => <RouterProvider router={router} />

export default Router