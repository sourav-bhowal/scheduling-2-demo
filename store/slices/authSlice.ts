import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'doctor' | 'patient';
  avatar?: string;
  // Doctor specific fields
  specialization?: string;
  licenseNumber?: string;
  clinicName?: string;
  clinicAddress?: string;
  experience?: number;
  consultationFee?: number;
  // Patient specific fields
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  emergencyContact?: string;
  medicalHistory?: string[];
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
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null,
  availableSlots: [],
  doctorSlots: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    signupSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.availableSlots = [];
      state.doctorSlots = [];
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
      if (state.user?.role === 'doctor') {
        state.doctorSlots.push(action.payload);
      }
    },
    updateTimeSlot: (state, action: PayloadAction<TimeSlot>) => {
      const index = state.doctorSlots.findIndex(slot => slot.id === action.payload.id);
      if (index !== -1) {
        state.doctorSlots[index] = action.payload;
      }
    },
    deleteTimeSlot: (state, action: PayloadAction<string>) => {
      state.doctorSlots = state.doctorSlots.filter(slot => slot.id !== action.payload);
    },
    setAvailableSlots: (state, action: PayloadAction<TimeSlot[]>) => {
      state.availableSlots = action.payload;
    },
    setDoctorSlots: (state, action: PayloadAction<TimeSlot[]>) => {
      state.doctorSlots = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  loginSuccess,
  signupSuccess,
  logout,
  updateUser,
  clearError,
  addTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
  setAvailableSlots,
  setDoctorSlots,
} = authSlice.actions;

export default authSlice.reducer;
