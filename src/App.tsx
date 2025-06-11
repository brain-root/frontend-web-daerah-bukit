import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import { useAuth } from "./contexts/AuthContext";

// Lazy-loaded pages
const HomePage = lazy(() => import("./pages/HomePage"));
const TourismPage = lazy(() => import("./pages/TourismPage"));
const TourismDetailPage = lazy(() => import("./pages/TourismDetailPage")); // Add Tourism Detail Page
const BusinessDirectoryPage = lazy(
  () => import("./pages/BusinessDirectoryPage")
);
const BusinessDetailPage = lazy(() => import("./pages/BusinessDetailPage")); // Make sure this import is added
const EventsPage = lazy(() => import("./pages/EventsPage"));
const ForumPage = lazy(() => import("./pages/ForumPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage")); // Add ProfilePage
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const UnauthorizedPage = lazy(() => import("./pages/auth/UnauthorizedPage"));
const EventDetailPage = lazy(() => import("./pages/EventDetailPage")); // Import the EventDetailPage component

// Forum pages
const CategoryThreadsPage = lazy(
  () => import("./pages/forum/CategoryThreadsPage")
);
const ThreadDetailPage = lazy(() => import("./pages/forum/ThreadDetailPage"));
const ThreadFormPage = lazy(() => import("./pages/forum/ThreadFormPage"));

// Admin pages
const AdminDashboardPage = lazy(
  () => import("./pages/admin/AdminDashboardPage")
);
const UserManagementPage = lazy(
  () => import("./pages/admin/UserManagementPage")
);
const AdminTourismPage = lazy(() => import("./pages/admin/AdminTourismPage"));
const AdminBusinessPage = lazy(() => import("./pages/admin/AdminBusinessPage"));
const AdminEventsPage = lazy(() => import("./pages/admin/AdminEventsPage"));
const AdminForumPage = lazy(() => import("./pages/admin/AdminForumPage"));

function App() {
  const { user } = useAuth();

  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="tentang" element={<AboutPage />} />
          <Route path="wisata" element={<TourismPage />} />
          <Route path="wisata/:id" element={<TourismDetailPage />} />{" "}
          {/* Add this route for tourism details */}
          <Route path="acara" element={<EventsPage />} />
          <Route path="acara/:id" element={<EventDetailPage />} />{" "}
          {/* Add this route for event details */}
          <Route path="umkm" element={<BusinessDirectoryPage />} />
          <Route path="umkm/:id" element={<BusinessDetailPage />} />{" "}
          {/* Add this route for business details */}
          <Route path="forum" element={<ForumPage />} />
          {/* Forum routes */}
          <Route
            path="forum/category/:categoryId"
            element={<CategoryThreadsPage />}
          />
          <Route path="forum/thread/:threadId" element={<ThreadDetailPage />} />
          <Route
            path="forum/category/:categoryId/create"
            element={
              <ProtectedRoute>
                <ThreadFormPage />
              </ProtectedRoute>
            }
          />
          {/* Auth routes - redirect if already logged in */}
          <Route
            path="login"
            element={user ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route
            path="daftar"
            element={user ? <Navigate to="/" replace /> : <RegisterPage />}
          />
          <Route path="unauthorized" element={<UnauthorizedPage />} />
          {/* Protected routes - require authentication */}
          <Route
            path="profil"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          {/* 404 page */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin">
          {/* Dashboard page */}
          <Route
            index
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />

          {/* User Management */}
          <Route
            path="users"
            element={
              <AdminRoute>
                <UserManagementPage />
              </AdminRoute>
            }
          />

          {/* Tourism Management */}
          <Route
            path="wisata"
            element={
              <AdminRoute>
                <AdminTourismPage />
              </AdminRoute>
            }
          />

          {/* Business/UMKM Management */}
          <Route
            path="umkm"
            element={
              <AdminRoute>
                <AdminBusinessPage />
              </AdminRoute>
            }
          />

          {/* Events Management */}
          <Route
            path="acara"
            element={
              <AdminRoute>
                <AdminEventsPage />
              </AdminRoute>
            }
          />

          {/* Forum Management */}
          <Route
            path="forum"
            element={
              <AdminRoute>
                <AdminForumPage />
              </AdminRoute>
            }
          />

          {/* Catch all other admin routes */}
          <Route
            path="*"
            element={
              <AdminRoute>
                <NotFoundPage />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
