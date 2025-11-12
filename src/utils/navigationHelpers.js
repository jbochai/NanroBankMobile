/**
 * Universal Navigation Helper for Transaction Receipt
 * Works with any navigation structure (Tabs, Drawer, Stack)
 */

/**
 * Navigate to TransactionDetail screen after successful transfer
 * This is a simple, compatible method that works everywhere
 * 
 * @param {object} navigation - Navigation prop from useNavigation()
 * @param {object} transaction - Transaction data from API response
 */
export const navigateToTransactionReceipt = (navigation, transaction) => {
  try {
    // Simple navigate - works with most navigation structures
    navigation.navigate('TransactionDetail', {
      transaction: transaction,
    });
  } catch (error) {
    console.error('Navigation error:', error);
    
    // Fallback: try to go back and show success message
    Toast.show({
      type: 'success',
      text1: 'Transfer Completed',
      text2: 'Check Transactions to view receipt',
    });
    
    // Try to go back to previous screen
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }
};

/**
 * Navigate with replace - removes current screen from stack
 * Good for preventing back navigation to transfer form
 * 
 * @param {object} navigation
 * @param {object} transaction
 */
export const navigateToTransactionReceiptReplace = (navigation, transaction) => {
  try {
    navigation.replace('TransactionDetail', {
      transaction: transaction,
    });
  } catch (error) {
    console.error('Replace navigation error:', error);
    // Fallback to simple navigate
    navigateToTransactionReceipt(navigation, transaction);
  }
};

/**
 * Navigate and clear transfer form from history
 * For tab-based navigation or when you want to go back to main screen
 * 
 * @param {object} navigation
 * @param {object} transaction
 * @param {string} mainScreenName - Name of your main/home screen (default: 'Home')
 */
export const navigateToReceiptFromTransfer = (navigation, transaction, mainScreenName = 'Home') => {
  try {
    // Pop to main screen first, then navigate to detail
    navigation.navigate(mainScreenName);
    
    // Small delay to ensure navigation completes
    setTimeout(() => {
      navigation.navigate('TransactionDetail', {
        transaction: transaction,
      });
    }, 100);
  } catch (error) {
    console.error('Navigation from transfer error:', error);
    // Fallback to simple navigate
    navigateToTransactionReceipt(navigation, transaction);
  }
};

/**
 * For Tab Navigation: Navigate to Transactions tab, then to detail
 * Use this if your app uses bottom tabs
 * 
 * @param {object} navigation
 * @param {object} transaction
 * @param {string} transactionsTabName - Name of transactions tab (default: 'Transactions')
 */
export const navigateToReceiptFromTabs = (navigation, transaction, transactionsTabName = 'Transactions') => {
  try {
    // Navigate to transactions tab
    navigation.navigate(transactionsTabName, {
      screen: 'TransactionDetail',
      params: { transaction },
    });
  } catch (error) {
    console.error('Tab navigation error:', error);
    // Fallback
    navigateToTransactionReceipt(navigation, transaction);
  }
};

/**
 * Simple usage example - Just use this in your TransferScreen:
 * 
 * import { navigateToTransactionReceipt } from '../../utils/navigationHelpers';
 * 
 * const handleTransferSuccess = (result) => {
 *   Toast.show({
 *     type: 'success',
 *     text1: 'Transfer Successful',
 *   });
 *   
 *   // Navigate to receipt
 *   navigateToTransactionReceipt(navigation, result.data);
 * };
 */

export default {
  navigateToTransactionReceipt,
  navigateToTransactionReceiptReplace,
  navigateToReceiptFromTransfer,
  navigateToReceiptFromTabs,
};