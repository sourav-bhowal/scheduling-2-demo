import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import appointmentsReducer from './slices/appointmentsSlice';
import authReducer from './slices/authSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['appointments', 'auth'], // Only persist these reducers
  debug: __DEV__, // Enable debugging in development
};

const rootReducer = combineReducers({
  appointments: appointmentsReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Add logging for store state changes in development
if (__DEV__) {
  store.subscribe(() => {
    const state = store.getState();
    console.log("🏪 STORE STATE CHANGED:", {
      authRegisteredUsers: state.auth.registeredUsers?.length || 0,
      authDoctorSlots: state.auth.doctorSlots?.length || 0,
      authIsAuthenticated: state.auth.isAuthenticated,
      authCurrentUser: state.auth.user?.email || null,
      authLoading: state.auth.loading,
      authError: state.auth.error,
    });
  });
}

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
