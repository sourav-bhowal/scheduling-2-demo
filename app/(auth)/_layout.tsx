import { Stack } from "expo-router";

// AUTH LAYOUT
export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="doctor-signin" options={{ headerShown: false }} />
      <Stack.Screen name="doctor-signup" options={{ headerShown: false }} />
      <Stack.Screen name="patient-signin" options={{ headerShown: false }} />
      <Stack.Screen name="patient-signup" options={{ headerShown: false }} />
    </Stack>
  );
}
