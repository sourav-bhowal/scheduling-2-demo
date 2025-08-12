import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetAllState, signupSuccess, User } from "@/store/slices/authSlice";
import { Text, TouchableOpacity, View } from "react-native";

export default function QuickTestSignup({ show = false }: { show?: boolean }) {
  const dispatch = useAppDispatch();
  const { registeredUsers, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!show) return null;

  const testDoctorSignup = () => {
    console.log("🧪 TEST: Creating test doctor");
    const testDoctor: User = {
      id: `test-doctor-${Date.now()}`,
      name: "Dr. Test Doctor",
      email: `test-doctor-${Date.now()}@test.com`,
      phone: "+1234567890",
      password: "testpassword",
      role: "doctor",
      specialization: "Cardiologist",
      licenseNumber: "TEST-123",
    };

    dispatch(signupSuccess({
      user: testDoctor,
      token: `token-${testDoctor.id}`,
    }));
  };

  const testPatientSignup = () => {
    console.log("🧪 TEST: Creating test patient");
    const testPatient: User = {
      id: `test-patient-${Date.now()}`,
      name: "Test Patient",
      email: `test-patient-${Date.now()}@test.com`,
      phone: "+1234567890",
      password: "testpassword",
      role: "patient",
      dateOfBirth: "1990-01-01",
      gender: "male",
    };

    dispatch(signupSuccess({
      user: testPatient,
      token: `token-${testPatient.id}`,
    }));
  };

  const clearAllData = () => {
    console.log("🧪 TEST: Clearing all data");
    dispatch(resetAllState());
  };

  return (
    <View className="bg-blue-50 border border-blue-300 rounded-lg p-4 m-4">
      <Text className="font-bold text-blue-800 mb-2">🧪 QUICK TEST SIGNUP</Text>
      
      <TouchableOpacity 
        onPress={testDoctorSignup}
        className="bg-blue-500 p-2 rounded mb-2"
      >
        <Text className="text-white text-center text-sm">Test Doctor Signup</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={testPatientSignup}
        className="bg-green-500 p-2 rounded mb-2"
      >
        <Text className="text-white text-center text-sm">Test Patient Signup</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={clearAllData}
        className="bg-red-500 p-2 rounded"
      >
        <Text className="text-white text-center text-sm">Clear All Data</Text>
      </TouchableOpacity>

      <Text className="text-xs text-blue-700 mt-2">
        Registered: {registeredUsers?.length} | Auth: {isAuthenticated ? "Yes" : "No"}
      </Text>
    </View>
  );
}
