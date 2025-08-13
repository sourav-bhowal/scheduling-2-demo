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
import AuthDebugInfo from "../../components/AuthDebugInfo";
import CustomDatePicker from "../../components/CustomDatePicker";
import CustomDropdown from "../../components/CustomDropdown";

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

  const [pets, setPets] = useState([{
    id: Date.now().toString(),
    name: "",
    species: "",
    breed: "",
    age: "",
    weight: "",
    medicalHistory: [],
    allergies: [],
  }]);

  // Dropdown options
  const petSpeciesOptions = [
    { label: 'Dog', value: 'dog' },
    { label: 'Cat', value: 'cat' },
    { label: 'Bird', value: 'bird' },
    { label: 'Rabbit', value: 'rabbit' },
    { label: 'Reptile', value: 'reptile' },
    { label: 'Exotic Pet', value: 'exotic' },
    { label: 'Fish', value: 'fish' },
    { label: 'Hamster', value: 'hamster' },
    { label: 'Guinea Pig', value: 'guinea-pig' },
  ];

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Prefer not to say', value: 'other' },
  ];

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async () => {
    console.log("🔷 PATIENT SIGNUP STARTED");
    console.log("📝 Form Data:", {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      hasPassword: !!formData.password,
      hasConfirmPassword: !!formData.confirmPassword,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
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
      dispatch(setError("Please fill in all required fields: " + missingFields.join(", ")));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      console.log("❌ Password mismatch");
      dispatch(setError("Passwords do not match"));
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      console.log("❌ Password too short:", formData.password?.length || 0, "characters");
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
      console.log("📊 Current registered users count:", currentState.auth.registeredUsers?.length || 0);
      console.log("👥 Registered users:", currentState.auth.registeredUsers?.map(u => ({ email: u.email, role: u.role })) || []);
      
      const existingUser = currentState.auth.registeredUsers?.find(
        (user: User) => user.email.toLowerCase() === formData.email.toLowerCase()
      );

      if (existingUser) {
        console.log("❌ Email already exists:", existingUser.email, "Role:", existingUser.role);
        throw new Error('Email already exists');
      }

      console.log("🔧 Creating user object...");
      console.log("📋 Form data for user creation:", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        emergencyContact: formData.emergencyContact,
        medicalHistory: formData.medicalHistory,
        medicalHistoryType: typeof formData.medicalHistory,
        medicalHistoryLength: formData.medicalHistory?.length,
      });

      console.log("🔧 Creating user object...");
      console.log("📋 Form data for user creation:", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        emergencyContact: formData.emergencyContact,
        medicalHistory: formData.medicalHistory,
        medicalHistoryType: typeof formData.medicalHistory,
        medicalHistoryLength: formData.medicalHistory?.length,
      });

      // Create new user with more defensive programming
      let processedMedicalHistory: string[] = [];
      try {
        if (formData.medicalHistory && typeof formData.medicalHistory === 'string') {
          processedMedicalHistory = formData.medicalHistory
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item);
        }
        console.log("✅ Medical history processed:", processedMedicalHistory);
      } catch (error) {
        console.log("❌ Error processing medical history:", error);
        processedMedicalHistory = [];
      }

      const processedPets = pets
        .filter(pet => pet.name.trim() && pet.species.trim())
        .map(pet => ({
          id: pet.id,
          name: pet.name.trim(),
          species: pet.species.trim(),
          breed: pet.breed.trim() || undefined,
          age: parseInt(pet.age) || 0,
          weight: parseFloat(pet.weight) || undefined,
          medicalHistory: pet.medicalHistory || [],
          allergies: pet.allergies || [],
        }));

      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name || "",
        email: formData.email || "",
        phone: formData.phone || "",
        password: formData.password || "",
        role: "patient",
        dateOfBirth: formData.dateOfBirth || "",
        gender: (formData.gender as "male" | "female" | "other") || "other",
        emergencyContact: formData.emergencyContact || "",
        medicalHistory: processedMedicalHistory,
        pets: processedPets,
      };

      console.log("👤 Created new patient user:", {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        medicalHistoryCount: newUser.medicalHistory?.length || 0,
      });

      console.log("🚀 Dispatching signupSuccess...");
      dispatch(
        signupSuccess({
          user: newUser,
          token: `token-${newUser.id}`,
        })
      );

      console.log("🏥 Redirecting to patient dashboard...");
      router.replace("/patient-dashboard");
    } catch (error) {
      console.log("💥 Signup error:", error);
      if (error instanceof Error) {
        console.log("📋 Error details:", {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
        
        if (error.message === 'Email already exists') {
          dispatch(setError("Email already registered. Please use a different email or sign in."));
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
    <ScrollView className="flex-1 bg-white">
      <AuthDebugInfo show={true} />
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
            <CustomDatePicker
              value={formData.dateOfBirth}
              onDateChange={(date) => handleInputChange("dateOfBirth", date)}
              label="Date of Birth"
              placeholder="Select your date of birth"
              maximumDate={new Date()}
            />
          </View>

          <View>
            <CustomDropdown
              label="Gender"
              options={genderOptions}
              value={formData.gender}
              onValueChange={(value) => handleInputChange("gender", value)}
              placeholder="Select gender..."
            />
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

          {/* Pet Information */}
          <Text className="text-lg font-semibold text-gray-800 mt-6 mb-2">
            Pet Information
          </Text>
          
          {pets.map((pet, index) => (
            <View key={pet.id} className="border border-gray-200 rounded-lg p-4 mb-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-md font-semibold text-gray-700">Pet #{index + 1}</Text>
                {pets.length > 1 && (
                  <TouchableOpacity
                    onPress={() => setPets(pets.filter(p => p.id !== pet.id))}
                    className="bg-red-100 px-2 py-1 rounded"
                  >
                    <Text className="text-red-600 text-xs">Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <View className="space-y-3">
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 mb-1">Pet Name *</Text>
                    <TextInput
                      value={pet.name}
                      onChangeText={(value) => {
                        setPets(pets.map(p => p.id === pet.id ? {...p, name: value} : p));
                      }}
                      placeholder="e.g., Buddy"
                      className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                    />
                  </View>
                  
                  <View className="flex-1">
                    <CustomDropdown
                      label="Species"
                      options={petSpeciesOptions}
                      value={pet.species}
                      onValueChange={(value) => {
                        setPets(pets.map(p => p.id === pet.id ? {...p, species: value} : p));
                      }}
                      placeholder="Select species..."
                      required
                    />
                  </View>
                </View>
                
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 mb-1">Breed</Text>
                    <TextInput
                      value={pet.breed}
                      onChangeText={(value) => {
                        setPets(pets.map(p => p.id === pet.id ? {...p, breed: value} : p));
                      }}
                      placeholder="e.g., Golden Retriever"
                      className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                    />
                  </View>
                  
                  <View className="w-20">
                    <Text className="text-sm font-medium text-gray-700 mb-1">Age</Text>
                    <TextInput
                      value={pet.age}
                      onChangeText={(value) => {
                        setPets(pets.map(p => p.id === pet.id ? {...p, age: value} : p));
                      }}
                      placeholder="2"
                      keyboardType="numeric"
                      className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                    />
                  </View>
                  
                  <View className="w-24">
                    <Text className="text-sm font-medium text-gray-700 mb-1">Weight (kg)</Text>
                    <TextInput
                      value={pet.weight}
                      onChangeText={(value) => {
                        setPets(pets.map(p => p.id === pet.id ? {...p, weight: value} : p));
                      }}
                      placeholder="25.5"
                      keyboardType="numeric"
                      className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                    />
                  </View>
                </View>
              </View>
            </View>
          ))}
          
          <TouchableOpacity
            onPress={() => {
              setPets([...pets, {
                id: Date.now().toString(),
                name: "",
                species: "",
                breed: "",
                age: "",
                weight: "",
                medicalHistory: [],
                allergies: [],
              }]);
            }}
            className="bg-green-50 border border-green-300 border-dashed rounded-lg p-3 items-center"
          >
            <Text className="text-green-600 font-medium">+ Add Another Pet</Text>
          </TouchableOpacity>

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
              {loading ? "Creating Account..." : "Create Pet Owner Account"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="mt-6">
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600">Already have an account? </Text>
            <Link href="/patient-signin" asChild>
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
