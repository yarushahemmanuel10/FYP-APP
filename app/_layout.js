import { useEffect } from "react";
import { Slot, useSegments, useRouter } from "expo-router";
import "../global.css";
import { AuthContextProvider, useAuth } from "../context/authContext";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (typeof isAuthenticated === "undefined") return;

    const inApp = segments[0] === "(app)";

    if (isAuthenticated && !inApp) {
      // Redirect to home only if the user is authenticated and NOT already inside (app)
      router.replace("/home");
    } else if (isAuthenticated === false) {
      // Redirect to sign-in page if not authenticated
      router.replace("/signIn");
    }
  }, [isAuthenticated]);

  return <Slot />;
};

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <MainLayout />
    </AuthContextProvider>
  );
}
