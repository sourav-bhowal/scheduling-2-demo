import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "../global.css"; // Ensure global styles are imported
import { persistor, store } from "../store";

function LoadingComponent() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg text-gray-600">Loading...</Text>
    </View>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingComponent />} persistor={persistor}>
        <Stack 
          screenOptions={{
            headerShown: false, // Hide headers by default
          }}
        >
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="doctor-signin" options={{ headerShown: false }} />
          <Stack.Screen name="doctor-signup" options={{ headerShown: false }} />
          <Stack.Screen name="patient-signin" options={{ headerShown: false }} />
          <Stack.Screen name="patient-signup" options={{ headerShown: false }} />
          <Stack.Screen name="doctor-dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="patient-dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="manage-availability" options={{ headerShown: false }} />
          <Stack.Screen name="book-appointment" options={{ headerShown: false }} />
          <Stack.Screen 
            name="appointments" 
            options={{ 
              headerShown: true,
              title: "All Appointments",
              headerStyle: { backgroundColor: '#3b82f6' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' }
            }} 
          />
          <Stack.Screen 
            name="create-appointment" 
            options={{ 
              headerShown: true,
              title: "Create Appointment",
              headerStyle: { backgroundColor: '#3b82f6' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' }
            }} 
          />
        </Stack>
      </PersistGate>
    </Provider>
  );
}
