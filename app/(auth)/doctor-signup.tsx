import { store } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearError,
  setError,
  setLoading,
  signupSuccess,
  User,
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
import CustomMultiSelect from "../../components/CustomMultiSelect";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DoctorSignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    petSpecialization: [] as string[], // ['dogs', 'cats', 'birds', 'rabbits', 'reptiles', 'exotic']
    medicalSpecialty: [] as string[], // ['general', 'surgery', 'dermatology', etc.]
    languages: [] as string[], // ['english', 'spanish', 'french', etc.]
    licenseNumber: "",
    clinicName: "",
    clinicAddress: "",
    experience: "",
    consultationFee: "",
  });

  // Dropdown options
  const petSpeciesOptions = [
    { label: "Dogs", value: "dogs" },
    { label: "Cats", value: "cats" },
    { label: "Birds", value: "birds" },
    { label: "Rabbits", value: "rabbits" },
    { label: "Reptiles", value: "reptiles" },
    { label: "Exotic Pets", value: "exotic" },
    { label: "Farm Animals", value: "farm" },
    { label: "Wildlife", value: "wildlife" },
  ];

  const medicalSpecialtyOptions = [
    { label: "General Practice", value: "general" },
    { label: "Surgery", value: "surgery" },
    { label: "Dermatology", value: "dermatology" },
    { label: "Cardiology", value: "cardiology" },
    { label: "Oncology", value: "oncology" },
    { label: "Orthopedics", value: "orthopedics" },
    { label: "Ophthalmology", value: "ophthalmology" },
    { label: "Dentistry", value: "dentistry" },
    { label: "Emergency Care", value: "emergency" },
    { label: "Animal Behavior", value: "behavior" },
    { label: "Internal Medicine", value: "internal" },
    { label: "Radiology", value: "radiology" },
  ];

  const languageOptions = [
    { label: "English", value: "english" },
    { label: "Spanish", value: "spanish" },
    { label: "French", value: "french" },
    { label: "German", value: "german" },
    { label: "Mandarin", value: "mandarin" },
    { label: "Hindi", value: "hindi" },
    { label: "Arabic", value: "arabic" },
    { label: "Portuguese", value: "portuguese" },
    { label: "Italian", value: "italian" },
    { label: "Japanese", value: "japanese" },
  ];

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async () => {
    console.log("🔷 DOCTOR SIGNUP STARTED");
    console.log("📝 Form Data:", {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      hasPassword: !!formData.password,
      hasConfirmPassword: !!formData.confirmPassword,
      specialization: formData.petSpecialization?.join(", ") || "Not specified",
      licenseNumber: formData.licenseNumber,
    });

    // Validation checks with detailed logging
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone
    ) {
      const missingFields = [];
      if (!formData.name) missingFields.push("name");
      if (!formData.email) missingFields.push("email");
      if (!formData.password) missingFields.push("password");
      if (!formData.phone) missingFields.push("phone");

      console.log("❌ Missing required fields:", missingFields);
      dispatch(
        setError(
          "Please fill in all required fields: " + missingFields.join(", ")
        )
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      console.log("❌ Password mismatch");
      dispatch(setError("Passwords do not match"));
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      console.log(
        "❌ Password too short:",
        formData.password?.length || 0,
        "characters"
      );
      dispatch(setError("Password must be at least 6 characters"));
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.log("❌ Invalid email format:", formData.email);
      dispatch(setError("Please enter a valid email address"));
      return;
    }

    console.log("✅ All validations passed");
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      console.log("⏳ Starting signup process...");
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Check if email already exists in registered users
      const currentState = store.getState();
      console.log(
        "📊 Current registered users count:",
        currentState.auth.registeredUsers?.length
      );
      console.log(
        "👥 Registered users:",
        currentState.auth.registeredUsers?.map((u) => ({
          email: u.email,
          role: u.role,
        }))
      );

      const existingUser = currentState.auth.registeredUsers?.find(
        (user: User) =>
          user.email.toLowerCase() === formData.email.toLowerCase()
      );

      if (existingUser) {
        console.log(
          "❌ Email already exists:",
          existingUser.email,
          "Role:",
          existingUser.role
        );
        throw new Error("Email already exists");
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "doctor",
        petSpecialization: formData.petSpecialization,
        medicalSpecialty: formData.medicalSpecialty,
        languages: formData.languages,
        licenseNumber: formData.licenseNumber || "",
        clinicName: formData.clinicName || "",
        clinicAddress: formData.clinicAddress || "",
        experience: formData.experience
          ? parseInt(formData.experience, 10) || 0
          : 0,
        consultationFee: formData.consultationFee
          ? parseFloat(formData.consultationFee) || 0
          : 0,
      };

      console.log("👤 Created new doctor user:", {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        experience: newUser.experience,
        consultationFee: newUser.consultationFee,
      });

      console.log("🚀 Dispatching signupSuccess...");
      dispatch(
        signupSuccess({
          user: newUser,
          token: `token-${newUser.id}`,
        })
      );

      console.log("🏥 Redirecting to doctor dashboard...");
      router.replace("/doctor-dashboard");
    } catch (error) {
      console.log("💥 Signup error:", error);
      if (error instanceof Error) {
        console.log("📋 Error details:", {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });

        if (error.message === "Email already exists") {
          dispatch(
            setError(
              "Email already registered. Please use a different email or sign in."
            )
          );
        } else {
          dispatch(setError(`Registration failed: ${error.message}`));
        }
      } else {
        console.log("🤷 Unknown error type:", typeof error, error);
        dispatch(setError("Registration failed. Please try again."));
      }
    } finally {
      console.log("🔚 Signup process completed, setting loading to false");
      dispatch(setLoading(false));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="">
        {/* <AuthDebugInfo show={true} /> */}
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
            <Text className="text-lg font-semibold text-gray-800 mt-6 mb-4">
              Veterinary Specialization
            </Text>

            {/* Pet Specialization */}
            <View className="mb-6">
              <CustomMultiSelect
                label="Animal Species You Treat"
                options={petSpeciesOptions}
                selectedValues={formData.petSpecialization}
                onSelectionChange={(values) =>
                  setFormData((prev) => ({
                    ...prev,
                    petSpecialization: values,
                  }))
                }
                placeholder="Select animal species..."
                required
              />
            </View>

            {/* Medical Specialty */}
            <View className="mb-6">
              <CustomMultiSelect
                label="Medical Specialties"
                options={medicalSpecialtyOptions}
                selectedValues={formData.medicalSpecialty}
                onSelectionChange={(values) =>
                  setFormData((prev) => ({ ...prev, medicalSpecialty: values }))
                }
                placeholder="Select medical specialties..."
                required
                maxSelections={5}
              />
            </View>

            {/* Languages */}
            <View className="mb-6">
              <CustomMultiSelect
                label="Languages Spoken"
                options={languageOptions}
                selectedValues={formData.languages}
                onSelectionChange={(values) =>
                  setFormData((prev) => ({ ...prev, languages: values }))
                }
                placeholder="Select languages..."
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
                  onChangeText={(value) =>
                    handleInputChange("experience", value)
                  }
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
              <Link href="/(auth)/doctor-signin" asChild>
                <TouchableOpacity>
                  <Text className="text-blue-500 font-semibold">Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>

            <View className="mt-4">
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
