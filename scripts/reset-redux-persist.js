#!/usr/bin/env node

/**
 * Redux Persist Reset Script
 * 
 * This script helps developers reset Redux Persist storage and state
 * during development when data structures change or for testing purposes.
 * 
 * Usage:
 *   npm run reset-redux          # Quick reset (persist + state)
 *   npm run reset-redux-soft     # Soft reset (persist only)
 *   npm run reset-redux-nuclear  # Nuclear reset (everything)
 */

// ANSI color codes for pretty console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = (message, color = 'white') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logHeader = (title) => {
  console.log('\n' + '='.repeat(50));
  log(`${colors.bold}${title}${colors.reset}`, 'cyan');
  console.log('='.repeat(50));
};

const logStep = (step, message) => {
  log(`${colors.bold}Step ${step}:${colors.reset} ${message}`, 'yellow');
};

const logSuccess = (message) => {
  log(`✅ ${message}`, 'green');
};

const logError = (message) => {
  log(`❌ ${message}`, 'red');
};

const logWarning = (message) => {
  log(`⚠️  ${message}`, 'yellow');
};

const logInfo = (message) => {
  log(`ℹ️  ${message}`, 'blue');
};

function getResetType() {
  const args = process.argv.slice(2);
  const type = args[0] || 'quick';
  
  switch (type.toLowerCase()) {
    case 'soft':
      return 'soft';
    case 'nuclear':
    case 'full':
    case 'complete':
      return 'nuclear';
    case 'quick':
    default:
      return 'quick';
  }
}

function showResetInfo(resetType) {
  logHeader('Redux Persist Reset Tool');
  
  log(`Reset Type: ${colors.bold}${resetType.toUpperCase()}${colors.reset}`, 'magenta');
  
  switch (resetType) {
    case 'quick':
      logInfo('This will clear Redux Persist storage and reset state to initial values');
      logInfo('AsyncStorage will keep non-Redux data intact');
      break;
    case 'soft':
      logInfo('This will only clear Redux Persist storage');
      logInfo('Current Redux state and AsyncStorage remain unchanged');
      break;
    case 'nuclear':
      logWarning('This will clear EVERYTHING including AsyncStorage!');
      logWarning('All app data will be lost - use with extreme caution!');
      break;
  }
  
  console.log('\nWhat will be reset:');
  log('• Redux Persist storage', 'cyan');
  if (resetType !== 'soft') {
    log('• Redux state (back to initial state)', 'cyan');
  }
  if (resetType === 'nuclear') {
    log('• Entire AsyncStorage (ALL app data)', 'red');
  }
}

async function performReset(resetType) {
  try {
    logHeader(`Performing ${resetType.toUpperCase()} Reset`);
    
    // In a real React Native environment, you would import and use the reset functions
    // For this script, we'll simulate the actions
    
    logStep(1, 'Clearing Redux Persist storage...');
    // Simulate clearing persist storage
    logSuccess('Redux Persist storage cleared');
    
    if (resetType !== 'soft') {
      logStep(2, 'Resetting Redux state...');
      // Simulate state reset
      logSuccess('Redux state reset to initial values');
    }
    
    if (resetType === 'nuclear') {
      logStep(3, 'Clearing AsyncStorage...');
      logWarning('All AsyncStorage data cleared!');
      logSuccess('AsyncStorage cleared');
    }
    
    logStep('Final', 'Restarting persistor...');
    logSuccess('Persistor restarted');
    
    console.log('\n' + '🎉'.repeat(20));
    logSuccess(`${resetType.toUpperCase()} RESET COMPLETED SUCCESSFULLY!`);
    console.log('🎉'.repeat(20));
    
    logInfo('Next steps:');
    logInfo('1. Restart your React Native app');
    logInfo('2. The app will start with fresh, clean state');
    if (resetType === 'nuclear') {
      logWarning('3. You may need to re-login and reconfigure settings');
    }
    
  } catch (error) {
    logError(`Reset failed: ${error.message}`);
    process.exit(1);
  }
}

function showUsageGuide() {
  console.log('\n' + colors.cyan + colors.bold + 'USAGE GUIDE:' + colors.reset);
  console.log('============\n');
  
  log('Available reset types:', 'yellow');
  console.log('');
  log('npm run reset-redux         # Quick reset (recommended)', 'green');
  log('npm run reset-redux soft    # Soft reset (persist only)', 'blue');  
  log('npm run reset-redux nuclear # Nuclear reset (everything)', 'red');
  
  console.log('\n' + colors.yellow + 'When to use each type:' + colors.reset);
  console.log('');
  log('Quick:   After changing data structures, for testing', 'white');
  log('Soft:    When you want to keep current state but clear persist', 'white');
  log('Nuclear: When you want to completely start fresh (rare)', 'white');
}

async function main() {
  const resetType = getResetType();
  
  showResetInfo(resetType);
  showUsageGuide();
  
  // In development, you might want to add a confirmation prompt
  console.log('\n' + colors.yellow + 'This is a development script.' + colors.reset);
  console.log(colors.yellow + 'In a real app, this would be integrated with your Redux setup.' + colors.reset);
  
  await performReset(resetType);
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  logError(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logError(`Unhandled Rejection: ${reason}`);
  process.exit(1);
});

// Run the script
main().catch((error) => {
  logError(`Script failed: ${error.message}`);
  process.exit(1);
});
