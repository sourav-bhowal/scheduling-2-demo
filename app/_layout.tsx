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
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(main)" options={{ headerShown: false }} />
        </Stack>
      </PersistGate>
    </Provider>
  );
}
