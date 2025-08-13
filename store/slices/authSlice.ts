import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string; // Added password field for authentication
  role: "doctor" | "patient";
  avatar?: string;
  // Veterinary Doctor specific fields
  petSpecialization?: string[]; // ['dogs', 'cats', 'birds', 'rabbits', 'reptiles', 'exotic']
  medicalSpecialty?: string[]; // ['general', 'surgery', 'dermatology', 'cardiology', 'oncology', 'orthopedics', 'ophthalmology', 'dentistry', 'emergency', 'behavior']
  languages?: string[]; // ['english', 'spanish', 'french', 'mandarin', 'hindi', etc.]
  licenseNumber?: string;
  clinicName?: string;
  clinicAddress?: string;
  experience?: number;
  consultationFee?: number;
  // Patient specific fields (pet owners)
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  emergencyContact?: string;
  medicalHistory?: string[];
  // Pet information for patients
  pets?: {
    id: string;
    name: string;
    species: string; // 'dog', 'cat', 'bird', 'rabbit', 'reptile', 'exotic'
    breed?: string;
    age: number;
    weight?: number;
    medicalHistory?: string[];
    allergies?: string[];
  }[];
}

export interface TimeSlot {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  duration: number; // in minutes
  isRecurring?: boolean;
  recurringDays?: string[]; // ['monday', 'tuesday', etc.]
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
  availableSlots: TimeSlot[];
  doctorSlots: TimeSlot[]; // For doctors to manage their own slots
  registeredUsers: User[]; // Store all registered users
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null,
  availableSlots: [],
  doctorSlots: [],
  registeredUsers: [], // Start with empty array - users register through signup
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      console.log("⏳ REDUX: setLoading called with:", action.payload);
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      console.log("🔴 REDUX: setError called with:", action.payload);
      state.error = action.payload;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      console.log("🔵 REDUX: loginSuccess called with:", {
        userId: action.payload.user.id,
        userName: action.payload.user.name,
        userEmail: action.payload.user.email,
        userRole: action.payload.user.role,
        token: action.payload.token,
      });

      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      console.log("🔵 REDUX: loginSuccess completed. New state:", {
        isAuthenticated: state.isAuthenticated,
        userId: state.user?.id,
        loading: state.loading,
        error: state.error,
      });
    },
    signupSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      console.log("🔵 REDUX: signupSuccess called with:", {
        userId: action.payload.user.id,
        userName: action.payload.user.name,
        userEmail: action.payload.user.email,
        userRole: action.payload.user.role,
        token: action.payload.token,
        currentRegisteredUsersCount: state.registeredUsers?.length || 0,
        registeredUsersExists: !!state.registeredUsers,
      });

      // Ensure registeredUsers array exists
      if (!state.registeredUsers) {
        console.log("🔧 REDUX: Initializing registeredUsers array");
        state.registeredUsers = [];
      }

      const newUser = action.payload.user;
      // Add user to registered users if not already exists
      const existingUser = state.registeredUsers.find(
        (u) => u.email === newUser.email
      );

      if (!existingUser) {
        console.log("✅ Adding new user to registered users");
        state.registeredUsers.push(newUser);
      } else {
        console.log(
          "⚠️ User already exists in registered users, not adding duplicate"
        );
      }

      state.user = newUser;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      console.log("🔵 REDUX: signupSuccess completed. New state:", {
        isAuthenticated: state.isAuthenticated,
        userId: state.user?.id,
        registeredUsersCount: state.registeredUsers?.length || 0,
        loading: state.loading,
        error: state.error,
      });
    },
    registerUser: (state, action: PayloadAction<User>) => {
      const newUser = action.payload;
      // Check if user already exists
      const existingUser = state.registeredUsers.find(
        (u) => u.email === newUser.email
      );
      if (!existingUser) {
        state.registeredUsers.push(newUser);
      }
    },
    authenticateUser: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      const { email, password } = action.payload;
      const user = state.registeredUsers.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );

      if (user) {
        state.user = { ...user };
        state.token = `token-${user.id}`;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      } else {
        state.error = "Invalid email or password";
        state.loading = false;
      }
    },
    logout: (state) => {
      console.log("🔵 REDUX: logout called", {
        currentDoctorSlotsCount: state.doctorSlots.length,
        currentRegisteredUsersCount: state.registeredUsers?.length || 0,
      });

      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.availableSlots = [];
      // Keep doctorSlots and registered users for persistence - doctors' time slots should survive logout

      console.log("✅ REDUX: logout completed", {
        doctorSlotsPreserved: state.doctorSlots.length,
        registeredUsersPreserved: state.registeredUsers?.length || 0,
      });
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    // Time slot management
    addTimeSlot: (state, action: PayloadAction<TimeSlot>) => {
      console.log("🔵 REDUX: addTimeSlot called", {
        userRole: state.user?.role,
        slotData: action.payload,
        currentDoctorSlotsCount: state.doctorSlots.length,
      });

      if (state.user?.role === "doctor") {
        state.doctorSlots.push(action.payload);
        console.log(
          "✅ REDUX: Time slot added successfully. New count:",
          state.doctorSlots.length
        );
      } else {
        console.log("❌ REDUX: Time slot not added - user is not a doctor");
      }
    },
    updateTimeSlot: (state, action: PayloadAction<TimeSlot>) => {
      const index = state.doctorSlots.findIndex(
        (slot) => slot.id === action.payload.id
      );
      if (index !== -1) {
        state.doctorSlots[index] = action.payload;
      }
    },
    deleteTimeSlot: (state, action: PayloadAction<string>) => {
      state.doctorSlots = state.doctorSlots.filter(
        (slot) => slot.id !== action.payload
      );
    },
    setAvailableSlots: (state, action: PayloadAction<TimeSlot[]>) => {
      state.availableSlots = action.payload;
    },
    setDoctorSlots: (state, action: PayloadAction<TimeSlot[]>) => {
      state.doctorSlots = action.payload;
    },
    resetAllState: (state) => {
      console.log(
        "🔵 REDUX: resetAllState called - This will clear ALL data including time slots!"
      );
      console.log("Current state before reset:", {
        registeredUsers: state.registeredUsers?.length || 0,
        doctorSlots: state.doctorSlots.length,
      });
      // Reset to initial state - WARNING: This clears EVERYTHING
      return initialState;
    },
  },
});

export const {
  setLoading,
  setError,
  loginSuccess,
  signupSuccess,
  registerUser,
  authenticateUser,
  logout,
  updateUser,
  clearError,
  addTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
  setAvailableSlots,
  setDoctorSlots,
  resetAllState,
} = authSlice.actions;

export default authSlice.reducer;
