# Redux Persist Reset Guide

This guide explains how to reset Redux persist state and clear everything in your React Native app.

## 🚀 Quick Start

### Using NPM Scripts (Recommended for Development)

```bash
# Quick reset - clears persist storage and resets state (recommended)
npm run reset-redux

# Soft reset - only clears persist storage, keeps current state
npm run reset-redux-soft

# Nuclear reset - clears everything including AsyncStorage (use with caution)
npm run reset-redux-nuclear
```

## 📁 Files Created

### 1. Redux Actions
- **`store/slices/authSlice.ts`** - Added `resetAllState` action
- **`store/slices/appointmentsSlice.ts`** - Added `resetAllAppointmentsState` action

### 2. Utility Functions  
- **`store/resetUtils.ts`** - Core reset functions for programmatic use

### 3. React Hook & Component
- **`components/ReduxResetHelper.tsx`** - React hook and optional UI components

### 4. NPM Scripts
- **`scripts/reset-redux-persist.js`** - Script that runs from package.json
- **`package.json`** - Added reset scripts

## 🛠️ Usage Methods

### Method 1: NPM Scripts (Development)
```bash
npm run reset-redux        # Quick reset
npm run reset-redux-soft   # Soft reset  
npm run reset-redux-nuclear # Nuclear reset
```

### Method 2: Programmatically in React Components
```tsx
import { useReduxReset } from '../components/ReduxResetHelper';

const MyComponent = () => {
  const { quickReset, softReset, nuclearReset } = useReduxReset();

  const handleReset = () => {
    quickReset(); // Shows confirmation alert
  };

  return (
    <TouchableOpacity onPress={handleReset}>
      <Text>Reset App Data</Text>
    </TouchableOpacity>
  );
};
```

### Method 3: Direct Function Calls
```tsx
import { quickReset, softReset, nuclearReset } from '../store/resetUtils';

// In an async function
const resetAppData = async () => {
  const result = await quickReset();
  if (result.success) {
    console.log('Reset successful!');
  }
};
```

### Method 4: Redux Actions
```tsx
import { useDispatch } from 'react-redux';
import { resetAllState } from '../store/slices/authSlice';
import { resetAllAppointmentsState } from '../store/slices/appointmentsSlice';

const MyComponent = () => {
  const dispatch = useDispatch();

  const resetReduxState = () => {
    dispatch(resetAllState());
    dispatch(resetAllAppointmentsState());
  };

  return (
    <TouchableOpacity onPress={resetReduxState}>
      <Text>Reset Redux State Only</Text>
    </TouchableOpacity>
  );
};
```

## 🎯 Reset Types Explained

### Quick Reset (Recommended)
- ✅ Clears Redux Persist storage
- ✅ Resets Redux state to initial values
- ✅ Keeps other AsyncStorage data intact
- 🎯 **Best for**: Development, testing, after data structure changes

### Soft Reset
- ✅ Clears Redux Persist storage only
- ❌ Keeps current Redux state
- ❌ Doesn't touch other AsyncStorage data
- 🎯 **Best for**: Clearing persist issues while keeping current state

### Nuclear Reset ⚠️
- ✅ Clears Redux Persist storage
- ✅ Resets Redux state to initial values
- ⚠️ **Clears ENTIRE AsyncStorage** 
- 🎯 **Best for**: Complete app reset (use with caution!)

## 🔧 When to Use Each Method

| Scenario | Recommended Method | Command |
|----------|-------------------|---------|
| Development/Testing | NPM Script | `npm run reset-redux` |
| Data structure changed | Quick Reset | `quickReset()` |
| Persist storage corrupted | Soft Reset | `npm run reset-redux-soft` |
| Complete app reset needed | Nuclear Reset | `npm run reset-redux-nuclear` |
| User logout | Redux Action | `dispatch(logout())` |
| Programmatic reset | Utility Function | `await quickReset()` |

## 🚨 Important Notes

1. **Always restart your app** after running a reset for changes to take full effect.

2. **Nuclear reset warning**: This will delete ALL AsyncStorage data, not just Redux data. Use with extreme caution.

3. **Development only**: The reset components and some functions are designed for development use.

4. **Backup important data**: Always ensure critical user data is backed up before performing resets.

## 🐛 Troubleshooting

### Reset not working?
1. Make sure you restart the app after reset
2. Check console for error messages  
3. Try soft reset first, then quick reset

### TypeScript errors?
- Ensure all imports are correct
- Check that store types are properly exported

### AsyncStorage permission issues?
- Check if your app has proper AsyncStorage permissions
- Try soft reset instead of nuclear reset

## 📝 Example Integration

Here's a complete example of integrating reset functionality in a settings screen:

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useReduxReset } from '../components/ReduxResetHelper';

const SettingsScreen = () => {
  const { quickReset, softReset } = useReduxReset();

  const confirmReset = () => {
    Alert.alert(
      'Reset App Data',
      'This will clear all app data and return to initial state. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: quickReset }
      ]
    );
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Settings</Text>
      
      {__DEV__ && (
        <TouchableOpacity 
          onPress={confirmReset}
          style={{ 
            backgroundColor: '#FF3B30', 
            padding: 15, 
            borderRadius: 8 
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>
            Reset App Data (Dev Only)
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SettingsScreen;
```

## 🎉 That's it!

You now have a comprehensive reset system for your Redux persist state. Use the appropriate method based on your needs and always remember to restart your app after a reset!
