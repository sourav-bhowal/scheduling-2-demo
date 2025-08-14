import { store } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  authenticateUser,
  clearError,
  setError,
  setLoading,
} from "@/store/slices/authSlice";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PatientSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSignIn = async () => {
    if (!email || !password) {
      dispatch(setError("Please fill in all fields"));
      return;
    }

    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use Redux store authentication
      dispatch(authenticateUser({ email, password }));

      // Check if authentication was successful
      setTimeout(() => {
        const currentState = store.getState();
        if (
          currentState.auth.isAuthenticated &&
          currentState.auth.user?.role === "patient"
        ) {
          router.replace("/(main)/patient-dashboard");
        } else if (!currentState.auth.error) {
          dispatch(setError("Access denied. Patient account required."));
        }
        dispatch(setLoading(false));
      }, 100);
    } catch {
      dispatch(setError("Authentication failed. Please try again."));
      dispatch(setLoading(false));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="">
        <View className="flex-1 px-6 py-12">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
              <Text className="text-3xl">🏥</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              Patient Sign In
            </Text>
            <Text className="text-gray-600 text-center">
              Access your health records and appointments
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Email Address
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="patient@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Password
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              />
            </View>

            {error && (
              <View className="bg-red-50 border border-red-300 rounded-lg p-3">
                <Text className="text-red-600 text-sm">{error}</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={handleSignIn}
              disabled={loading}
              className={`py-3 rounded-lg ${loading ? "bg-gray-400" : "bg-green-500"}`}
            >
              <Text className="text-white text-center font-semibold">
                {loading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="py-2">
              <Text className="text-green-500 text-center">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="mt-8">
            <View className="flex-row justify-center items-center">
              <Text className="text-gray-600">
                Don&apos;t have an account?{" "}
              </Text>
              <Link href="/(auth)/patient-signup" asChild>
                <TouchableOpacity>
                  <Text className="text-green-500 font-semibold">Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>

            <View className="mt-6">
              <Link href="/(main)/welcome" asChild>
                <TouchableOpacity className="py-2">
                  <Text className="text-gray-500 text-center">
                    ← Back to Role Selection
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
