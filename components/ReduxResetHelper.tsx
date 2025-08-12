import { Alert } from 'react-native';
import {
    nuclearReset as nuclearResetUtil,
    quickReset as quickResetUtil,
    softReset as softResetUtil
} from '../store/resetUtils';

/**
 * Hook to handle Redux Persist reset operations in React Native
 */
export const useReduxReset = () => {
  const handleReset = async (
    resetType: 'quick' | 'soft' | 'nuclear' = 'quick',
    options?: {
      showAlert?: boolean;
      onSuccess?: () => void;
      onError?: (error: any) => void;
    }
  ) => {
    const { showAlert = true, onSuccess, onError } = options || {};

    try {
      let result;
      
      switch (resetType) {
        case 'soft':
          result = await softResetUtil();
          break;
        case 'nuclear':
          result = await nuclearResetUtil();
          break;
        case 'quick':
        default:
          result = await quickResetUtil();
          break;
      }

      if (result?.success) {
        if (showAlert) {
          Alert.alert(
            'Reset Successful! 🎉',
            'Redux state and persisted data have been cleared. Please restart the app for changes to take full effect.',
            [
              {
                text: 'OK',
                onPress: onSuccess,
              },
            ]
          );
        } else {
          onSuccess?.();
        }
      } else {
        throw new Error(result?.message || 'Reset failed');
      }
    } catch (error) {
      console.error('Reset failed:', error);
      
      if (showAlert) {
        Alert.alert(
          'Reset Failed ❌',
          `Failed to reset Redux state: ${error instanceof Error ? error.message : 'Unknown error'}`,
          [{ text: 'OK' }]
        );
      }
      
      onError?.(error);
    }
  };

  // Convenient preset methods
  const quickReset = () => handleReset('quick');
  const softReset = () => handleReset('soft');
  
  const nuclearReset = () => {
    Alert.alert(
      'Nuclear Reset ⚠️',
      'This will delete ALL data including AsyncStorage. This cannot be undone. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, Delete Everything',
          style: 'destructive',
          onPress: () => handleReset('nuclear'),
        },
      ]
    );
  };

  return {
    resetRedux: handleReset,
    quickReset,
    softReset,
    nuclearReset,
  };
};

/**
 * Component that provides reset buttons for development/debugging
 * Only use in development builds!
 */
export const ReduxResetButtons = () => {
  // Only show in development
  if (__DEV__ === false) {
    return null;
  }

  // For now, return null - uncomment the hook and JSX below when you want to use the buttons
  return null;

  // Uncomment these lines when you want to use the reset buttons:
  // const { quickReset, softReset, nuclearReset } = useReduxReset();
  
  // return (
  //   <View style={{ padding: 20, backgroundColor: '#f0f0f0' }}>
  //     <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
  //       Development Tools
  //     </Text>
      
  //     <TouchableOpacity
  //       style={{
  //         backgroundColor: '#007AFF',
  //         padding: 10,
  //         borderRadius: 5,
  //         marginBottom: 10,
  //       }}
  //       onPress={quickReset}
  //     >
  //       <Text style={{ color: 'white', textAlign: 'center' }}>
  //         Quick Reset (Recommended)
  //       </Text>
  //     </TouchableOpacity>

  //     <TouchableOpacity
  //       style={{
  //         backgroundColor: '#FF9500',
  //         padding: 10,
  //         borderRadius: 5,
  //         marginBottom: 10,
  //       }}
  //       onPress={softReset}
  //     >
  //       <Text style={{ color: 'white', textAlign: 'center' }}>
  //         Soft Reset (Persist Only)
  //       </Text>
  //     </TouchableOpacity>

  //     <TouchableOpacity
  //       style={{
  //         backgroundColor: '#FF3B30',
  //         padding: 10,
  //         borderRadius: 5,
  //       }}
  //       onPress={nuclearReset}
  //     >
  //       <Text style={{ color: 'white', textAlign: 'center' }}>
  //         Nuclear Reset (Everything)
  //       </Text>
  //     </TouchableOpacity>
  //   </View>
  // );
};
