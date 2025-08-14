import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChatMessage {
  id: string;
  appointmentId: string;
  senderId: string;
  senderName: string;
  senderRole: 'doctor' | 'patient';
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface Appointment {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  doctorId: string;
  doctorName: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  serviceType: string;
  petSpecies?: string; // 'dog', 'cat', 'bird', 'rabbit', 'reptile', 'exotic'
  petName?: string;
  petAge?: number;
  duration: number; // in minutes
  price?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  chatMessages?: ChatMessage[];
}

interface AppointmentsState {
  appointments: Appointment[];
  chatMessages: ChatMessage[];
  loading: boolean;
  error: string | null;
  selectedDate: string;
  filters: {
    status: 'all' | 'scheduled' | 'completed' | 'cancelled';
    serviceType: string;
    petSpecies: string;
    dateRange: {
      start: string;
      end: string;
    };
  };
}

const initialState: AppointmentsState = {
  appointments: [],
  chatMessages: [],
  loading: false,
  error: null,
  selectedDate: new Date().toISOString().split('T')[0],
  filters: {
    status: 'all',
    serviceType: '',
    petSpecies: '',
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
    // Chat message actions
    addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chatMessages.push(action.payload);
      // Also add to the specific appointment's chat messages
      const appointment = state.appointments.find(apt => apt.id === action.payload.appointmentId);
      if (appointment) {
        if (!appointment.chatMessages) {
          appointment.chatMessages = [];
        }
        appointment.chatMessages.push(action.payload);
      }
    },
    markMessagesAsRead: (state, action: PayloadAction<{ appointmentId: string; userId: string }>) => {
      const { appointmentId, userId } = action.payload;
      // Mark messages as read in global chat messages
      state.chatMessages?.forEach(msg => {
        if (msg.appointmentId === appointmentId && msg.senderId !== userId) {
          msg.isRead = true;
        }
      });
      // Mark messages as read in appointment-specific messages
      const appointment = state.appointments.find(apt => apt.id === appointmentId);
      if (appointment?.chatMessages) {
        appointment.chatMessages?.forEach(msg => {
          if (msg.senderId !== userId) {
            msg.isRead = true;
          }
        });
      }
    },
    resetAllAppointmentsState: (state) => {
      // Reset to initial state
      return initialState;
    },
    clearChatMessages: (state) => {
      // Only clear chat messages, keep appointments
      state.chatMessages = [];
      // Also clear chat messages from individual appointments
      state.appointments.forEach(appointment => {
        if (appointment.chatMessages) {
          appointment.chatMessages = [];
        }
      });
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
  addChatMessage,
  markMessagesAsRead,
  resetAllAppointmentsState,
  clearChatMessages,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
