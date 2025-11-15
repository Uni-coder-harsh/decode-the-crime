import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import LobbyPage from '@/components/pages/LobbyPage';
import AdminPage from '@/components/pages/AdminPage';
import GamePage from '@/components/pages/GamePage';
import LeaderboardPage from '@/components/pages/LeaderboardPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "lobby",
        element: <LobbyPage />,
      },
      {
        path: "admin",
        element: <AdminPage />,
      },
      {
        path: "game",
        element: <GamePage />,
      },
      {
        path: "leaderboard",
        element: <LeaderboardPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
