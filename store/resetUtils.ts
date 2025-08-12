import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistor, store } from './index';
import { resetAllAppointmentsState } from './slices/appointmentsSlice';
import { resetAllState } from './slices/authSlice';

/**
 * Complete reset function that clears everything:
 * - Redux persist storage
 * - All Redux state
 * - AsyncStorage (optional)
 */
export const resetReduxPersist = async (options?: { 
  clearAsyncStorage?: boolean;
  resetReduxState?: boolean;
}) => {
  try {
    const { 
      clearAsyncStorage = false,
      resetReduxState = true 
    } = options || {};

    console.log('🧹 Starting Redux Persist reset...');

    // Step 1: Clear persisted state
    await persistor.purge();
    console.log('✅ Redux Persist storage cleared');

    // Step 2: Reset Redux state (optional)
    if (resetReduxState) {
      store.dispatch(resetAllState());
      store.dispatch(resetAllAppointmentsState());
      console.log('✅ Redux state reset to initial values');
    }

    // Step 3: Clear entire AsyncStorage (optional - use with caution)
    if (clearAsyncStorage) {
      await AsyncStorage.clear();
      console.log('✅ AsyncStorage completely cleared');
    } else {
      // Only clear specific keys related to redux-persist
      const keys = await AsyncStorage.getAllKeys();
      const reduxPersistKeys = keys.filter(key => 
        key.startsWith('persist:') || 
        key === 'root' ||
        key.includes('redux')
      );
      
      if (reduxPersistKeys.length > 0) {
        await AsyncStorage.multiRemove(reduxPersistKeys);
        console.log(`✅ Cleared ${reduxPersistKeys.length} Redux Persist keys from AsyncStorage`);
      }
    }

    // Step 4: Restart persistor
    await persistor.flush();
    console.log('✅ Redux Persist reset complete! 🎉');

    return {
      success: true,
      message: 'Redux Persist reset completed successfully'
    };

  } catch (error) {
    console.error('❌ Error during Redux Persist reset:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      message: `Reset failed: ${errorMessage}`,
      error
    };
  }
};

/**
 * Quick reset - only clears persist and resets state
 */
export const quickReset = () => resetReduxPersist({
  clearAsyncStorage: false,
  resetReduxState: true
});

/**
 * Nuclear reset - clears everything including AsyncStorage
 * Use with extreme caution!
 */
export const nuclearReset = () => resetReduxPersist({
  clearAsyncStorage: true,
  resetReduxState: true
});

/**
 * Soft reset - only clears persist storage, keeps current state
 */
export const softReset = () => resetReduxPersist({
  clearAsyncStorage: false,
  resetReduxState: false
});
