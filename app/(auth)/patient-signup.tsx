import { Link, router } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    clearError,
    setError,
    setLoading,
    signupSuccess,
    User,
} from "@/store/slices/authSlice";

export default function PatientSignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "",
    emergencyContact: "",
    medicalHistory: "",
  });

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone
    ) {
      dispatch(setError("Please fill in all required fields"));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      dispatch(setError("Passwords do not match"));
      return;
    }

    if (formData.password.length < 6) {
      dispatch(setError("Password must be at least 6 characters"));
      return;
    }

    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful signup
      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: "patient",
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender as "male" | "female" | "other",
        emergencyContact: formData.emergencyContact,
        medicalHistory: formData.medicalHistory
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
      };

      dispatch(
        signupSuccess({
          user: newUser,
          token: "mock-jwt-token-patient",
        })
      );

      router.replace("/patient-dashboard");
    } catch {
      dispatch(setError("Registration failed. Please try again."));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="items-center mb-6">
          <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
            <Text className="text-3xl">🏥</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Patient Registration
          </Text>
          <Text className="text-gray-600 text-center">
            Create your account to book appointments
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-4">
          {/* Personal Information */}
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Personal Information
          </Text>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </Text>
            <TextInput
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              placeholder="John Doe"
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </Text>
            <TextInput
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              placeholder="patient@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </Text>
            <TextInput
              value={formData.phone}
              onChangeText={(value) => handleInputChange("phone", value)}
              placeholder="+1 (555) 123-4567"
              keyboardType="phone-pad"
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </Text>
            <TextInput
              value={formData.dateOfBirth}
              onChangeText={(value) => handleInputChange("dateOfBirth", value)}
              placeholder="YYYY-MM-DD"
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Gender
            </Text>
            <View className="flex-row space-x-3">
              {["male", "female", "other"].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  onPress={() => handleInputChange("gender", gender)}
                  className={`flex-1 py-3 rounded-lg border-2 ${
                    formData.gender === gender
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <Text
                    className={`text-center capitalize ${
                      formData.gender === gender
                        ? "text-green-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Emergency Contact
            </Text>
            <TextInput
              value={formData.emergencyContact}
              onChangeText={(value) =>
                handleInputChange("emergencyContact", value)
              }
              placeholder="+1 (555) 987-6543"
              keyboardType="phone-pad"
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Password *
            </Text>
            <TextInput
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              placeholder="Minimum 6 characters"
              secureTextEntry
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Confirm Password *
            </Text>
            <TextInput
              value={formData.confirmPassword}
              onChangeText={(value) =>
                handleInputChange("confirmPassword", value)
              }
              placeholder="Re-enter password"
              secureTextEntry
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            />
          </View>

          {/* Medical Information */}
          <Text className="text-lg font-semibold text-gray-800 mt-6 mb-2">
            Medical Information
          </Text>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Medical History (Optional)
            </Text>
            <Text className="text-xs text-gray-500 mb-2">
              Separate conditions with commas
            </Text>
            <TextInput
              value={formData.medicalHistory}
              onChangeText={(value) =>
                handleInputChange("medicalHistory", value)
              }
              placeholder="e.g., Diabetes, Hypertension, Allergies"
              multiline
              numberOfLines={3}
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            />
          </View>

          {error && (
            <View className="bg-red-50 border border-red-300 rounded-lg p-3">
              <Text className="text-red-600 text-sm">{error}</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleSignUp}
            disabled={loading}
            className={`py-3 rounded-lg mt-6 ${loading ? "bg-gray-400" : "bg-green-500"}`}
          >
            <Text className="text-white text-center font-semibold">
              {loading ? "Creating Account..." : "Create Patient Account"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="mt-6">
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600">Already have an account? </Text>
            <Link href="/auth/patient-signin" asChild>
              <TouchableOpacity>
                <Text className="text-green-500 font-semibold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <View className="mt-4">
            <Link href="/welcome" asChild>
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
  );
}
