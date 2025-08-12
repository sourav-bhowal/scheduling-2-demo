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

export default function DoctorSignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    licenseNumber: "",
    clinicName: "",
    clinicAddress: "",
    experience: "",
    consultationFee: "",
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
        role: "doctor",
        specialization: formData.specialization,
        licenseNumber: formData.licenseNumber,
        clinicName: formData.clinicName,
        clinicAddress: formData.clinicAddress,
        experience: parseInt(formData.experience) || 0,
        consultationFee: parseFloat(formData.consultationFee) || 0,
      };

      dispatch(
        signupSuccess({
          user: newUser,
          token: "mock-jwt-token",
        })
      );

      router.replace("/doctor-dashboard");
    } catch (err) {
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
          <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
            <Text className="text-3xl">👩‍⚕️</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Doctor Registration
          </Text>
          <Text className="text-gray-600 text-center">
            Join our platform to manage your practice
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
              placeholder="Dr. John Smith"
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
              placeholder="doctor@example.com"
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

          {/* Professional Information */}
          <Text className="text-lg font-semibold text-gray-800 mt-6 mb-2">
            Professional Information
          </Text>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Specialization
            </Text>
            <TextInput
              value={formData.specialization}
              onChangeText={(value) =>
                handleInputChange("specialization", value)
              }
              placeholder="e.g., Cardiologist, Dermatologist"
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              License Number
            </Text>
            <TextInput
              value={formData.licenseNumber}
              onChangeText={(value) =>
                handleInputChange("licenseNumber", value)
              }
              placeholder="Medical license number"
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Clinic/Hospital Name
            </Text>
            <TextInput
              value={formData.clinicName}
              onChangeText={(value) => handleInputChange("clinicName", value)}
              placeholder="Name of your practice"
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Clinic Address
            </Text>
            <TextInput
              value={formData.clinicAddress}
              onChangeText={(value) =>
                handleInputChange("clinicAddress", value)
              }
              placeholder="Practice address"
              multiline
              numberOfLines={2}
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            />
          </View>

          <View className="flex-row space-x-3">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </Text>
              <TextInput
                value={formData.experience}
                onChangeText={(value) => handleInputChange("experience", value)}
                placeholder="0"
                keyboardType="numeric"
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Consultation Fee ($)
              </Text>
              <TextInput
                value={formData.consultationFee}
                onChangeText={(value) =>
                  handleInputChange("consultationFee", value)
                }
                placeholder="100"
                keyboardType="numeric"
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              />
            </View>
          </View>

          {error && (
            <View className="bg-red-50 border border-red-300 rounded-lg p-3">
              <Text className="text-red-600 text-sm">{error}</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleSignUp}
            disabled={loading}
            className={`py-3 rounded-lg mt-6 ${loading ? "bg-gray-400" : "bg-blue-500"}`}
          >
            <Text className="text-white text-center font-semibold">
              {loading ? "Creating Account..." : "Create Doctor Account"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="mt-6">
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600">Already have an account? </Text>
            <Link href="/auth/doctor-signin" asChild>
              <TouchableOpacity>
                <Text className="text-blue-500 font-semibold">Sign In</Text>
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
