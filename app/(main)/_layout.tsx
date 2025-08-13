import { Stack } from "expo-router";

// MAIN LAYOUT
export default function MainLayout() {
  return (
    <Stack>
      <Stack.Screen name="appointments" options={{ headerShown: false }} />
      <Stack.Screen name="book-appointment" options={{ headerShown: false }} />
      <Stack.Screen
        name="create-appointment"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="doctor-dashboard" options={{ headerShown: false }} />
      <Stack.Screen
        name="manage-availability"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="patient-dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
    </Stack>
  );
}
