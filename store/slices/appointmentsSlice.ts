import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Appointment {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  serviceType: string;
  duration: number; // in minutes
  price?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface AppointmentsState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  selectedDate: string;
  filters: {
    status: 'all' | 'scheduled' | 'completed' | 'cancelled';
    serviceType: string;
    dateRange: {
      start: string;
      end: string;
    };
  };
}

const initialState: AppointmentsState = {
  appointments: [],
  loading: false,
  error: null,
  selectedDate: new Date().toISOString().split('T')[0],
  filters: {
    status: 'all',
    serviceType: '',
    dateRange: {
      start: '',
      end: '',
    },
  },
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload);
    },
    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(
        (apt) => apt.id === action.payload.id
      );
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    deleteAppointment: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter(
        (apt) => apt.id !== action.payload
      );
    },
    updateAppointmentStatus: (
      state,
      action: PayloadAction<{ id: string; status: Appointment['status'] }>
    ) => {
      const appointment = state.appointments.find(
        (apt) => apt.id === action.payload.id
      );
      if (appointment) {
        appointment.status = action.payload.status;
        appointment.updatedAt = new Date().toISOString();
      }
    },
    setFilters: (state, action: PayloadAction<Partial<AppointmentsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
    },
    resetAllAppointmentsState: (state) => {
      // Reset to initial state
      return initialState;
    },
  },
});

export const {
  setLoading,
  setError,
  setSelectedDate,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
  setFilters,
  clearFilters,
  setAppointments,
  resetAllAppointmentsState,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
