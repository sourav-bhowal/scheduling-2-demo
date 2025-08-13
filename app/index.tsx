import { Redirect } from "expo-router";
import { useAppSelector } from "../store/hooks";

export default function Index() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Redirect href="/(main)/welcome" />;
  }

  if (user?.role === 'doctor') {
    return <Redirect href="/(main)/doctor-dashboard" />;
  }

  if (user?.role === 'patient') {
    return <Redirect href="/(main)/patient-dashboard" />;
  }

  // Fallback to welcome screen
  return <Redirect href="/(main)/welcome" />;
}
