import { Redirect, router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import RoleSelectionModal from "../../components/RoleSelectionModal";
import { useAppSelector } from "../../store/hooks";
import AuthDebugInfo from "@/components/AuthDebugInfo";

export default function WelcomeScreen() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [actionType, setActionType] = useState<"signin" | "signup">("signin");

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  const handleGetStarted = (action: "signin" | "signup") => {
    setActionType(action);
    setShowRoleModal(true);
  };

  const handleRoleSelect = (role: "doctor" | "patient") => {
    setShowRoleModal(false);
    router.push(`/${role}-${actionType}`);
  };

  return (
    <View className="flex-1 bg-blue-200">
      {/* Debug components for testing */}
      {__DEV__ && (
        <>
          <AuthDebugInfo show={true} />
          {/* <QuickTestSignup show={true} /> */}
        </>
      )}

      <View className="flex-1 justify-center items-center px-6">
        {/* Logo/Title */}
        <View className="items-center mb-16">
          <View className="w-24 h-24 bg-white rounded-3xl items-center justify-center mb-6">
            <Text className="text-4xl">🏥</Text>
          </View>
          <Text className="text-5xl font-bold text-black mb-4">
            MedSchedule
          </Text>
          <Text className="text-xl text-blue-500 text-center leading-relaxed">
            Seamless healthcare appointment scheduling for providers and
            patients
          </Text>
        </View>

        {/* CTA Buttons */}
        <View className="w-full flex flex-col gap-5">
          <TouchableOpacity
            onPress={() => handleGetStarted("signin")}
            className="bg-white rounded-2xl py-4 px-8 shadow-xl"
          >
            <Text className="text-gray-800 text-xl font-bold text-center">
              Sign In
            </Text>
            <Text className="text-gray-500 text-center mt-1">
              Access your account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleGetStarted("signup")}
            className="border-2 border-white/50 rounded-2xl py-4 px-8 bg-blue-500"
          >
            <Text className="text-white text-xl font-bold text-center">
              Sign Up
            </Text>
            <Text className="text-white text-center mt-1">
              Create new account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View className="mt-16 space-y-3">
          <View className="flex-row ">
            <Text className="text-blue-500 text-sm">✓ Secure & Private</Text>
            <Text className="text-blue-500 text-sm">✓ Real-time Updates</Text>
            <Text className="text-blue-500 text-sm">✓ Easy to Use</Text>
          </View>
        </View>
      </View>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        visible={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onSelectRole={handleRoleSelect}
      />
    </View>
  );
}
