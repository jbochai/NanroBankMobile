import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';
import { selectUser } from '../../store/auth/authSlice';
import { selectPrimaryAccount } from '../../store/account/accountSlice';
import TransactionService from '../../api/transaction';

// Separate DatePicker component
const CustomDatePicker = ({ visible, currentDate, onSelect, onClose }) => {
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate());

  useEffect(() => {
    if (visible) {
      setSelectedYear(currentDate.getFullYear());
      setSelectedMonth(currentDate.getMonth());
      setSelectedDay(currentDate.getDate());
    }
  }, [visible, currentDate]);

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleConfirm = () => {
    const newDate = new Date(selectedYear, selectedMonth, selectedDay);
    onSelect(newDate);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.datePickerModal}>
          <View style={styles.datePickerHeader}>
            <Text style={styles.datePickerTitle}>Select Date</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.datePickerContent}>
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Year</Text>
              <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                {years.map(year => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.pickerItem,
                      selectedYear === year && styles.pickerItemSelected,
                    ]}
                    onPress={() => setSelectedYear(year)}>
                    <Text
                      style={[
                        styles.pickerItemText,
                        selectedYear === year && styles.pickerItemTextSelected,
                      ]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Month</Text>
              <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                {months.map((month, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.pickerItem,
                      selectedMonth === index && styles.pickerItemSelected,
                    ]}
                    onPress={() => setSelectedMonth(index)}>
                    <Text
                      style={[
                        styles.pickerItemText,
                        selectedMonth === index && styles.pickerItemTextSelected,
                      ]}>
                      {month.substring(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Day</Text>
              <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                {days.map(day => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.pickerItem,
                      selectedDay === day && styles.pickerItemSelected,
                    ]}
                    onPress={() => setSelectedDay(day)}>
                    <Text
                      style={[
                        styles.pickerItemText,
                        selectedDay === day && styles.pickerItemTextSelected,
                      ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.datePickerFooter}>
            <TouchableOpacity
              style={[styles.datePickerButton, styles.datePickerButtonCancel]}
              onPress={onClose}>
              <Text style={styles.datePickerButtonTextCancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.datePickerButton, styles.datePickerButtonConfirm]}
              onPress={handleConfirm}>
              <Text style={styles.datePickerButtonTextConfirm}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const AccountStatementScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const account = useSelector(selectPrimaryAccount);
  const LOGO_BASE64 = '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';
  
  const [isLoading, setIsLoading] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [transactions, setTransactions] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [totalDebits, setTotalDebits] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      email: user?.email || '',
    },
  });

  useEffect(() => {
    if (user?.email) {
      setValue('email', user.email);
    }
    
    // Debug account info
    console.log('========================================');
    console.log('ACCOUNT DEBUG:');
    console.log('User:', user);
    console.log('Account:', account);
    console.log('Account Number:', account?.account_number);
    console.log('========================================');
  }, [user, setValue, account]);

  const statementFormats = [
    { id: 'pdf', name: 'PDF', icon: 'picture-as-pdf', color: '#f44336' },
    { id: 'excel', name: 'Excel', icon: 'table-chart', color: '#4caf50' },
    { id: 'csv', name: 'CSV', icon: 'description', color: '#2196f3' },
  ];

  const quickPeriods = [
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'Last 3 Months', days: 90 },
    { label: 'Last 6 Months', days: 180 },
  ];

  const handleQuickPeriod = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setStartDate(start);
    setEndDate(end);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatCurrency = (amount) => {
    return `₦${parseFloat(amount).toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version >= 33) {
          // Android 13+ doesn't need WRITE_EXTERNAL_STORAGE
          return true;
        }
        
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to storage to save files',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const generateHTMLContent = (transactionData, summary) => {
    // Get account number from first transaction if Redux account is null
    const accountNumber = account?.account_number || 
                         transactionData[0]?.account?.account_number || 
                         'N/A';
    
    const accountType = account?.account_type || 
                       transactionData[0]?.account?.account_type || 
                       'Savings';
    
    const transactionRows = transactionData.map(transaction => {
      const isCredit = transaction.type === 'credit';
      // Handle both string and number amounts
      const amount = typeof transaction.amount === 'string' ? parseFloat(transaction.amount) : transaction.amount;
      const creditAmount = isCredit ? formatCurrency(amount) : '-';
      const debitAmount = !isCredit ? formatCurrency(amount) : '-';
      
      // Handle balance_after as string or number
      const balanceAfter = typeof transaction.balance_after === 'string' ? 
                          parseFloat(transaction.balance_after) : 
                          transaction.balance_after;
      
      return `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(transaction.created_at).toLocaleDateString()}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">
          ${transaction.description || transaction.type}<br/>
          <small style="color: #999;">${transaction.reference || ''}</small>
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; color: #4caf50; text-align: right;">
          ${creditAmount}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; color: #f44336; text-align: right;">
          ${debitAmount}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatCurrency(balanceAfter || 0)}</td>
      </tr>
    `;
    }).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Account Statement</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1a73e8; padding-bottom: 20px; }
            .logo { max-width: 150px; height: auto; margin-bottom: 10px; }
            .bank-name { font-size: 24px; font-weight: bold; color: #1a73e8; margin-bottom: 5px; }
            .statement-title { font-size: 18px; color: #666; }
            .account-info { margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px; }
            .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
            .info-label { font-weight: bold; color: #666; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background-color: #1a73e8; color: white; padding: 12px 8px; text-align: left; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
            tr:hover { background-color: #f9f9f9; }
            .summary { margin-top: 30px; padding: 20px; background-color: #f5f5f5; border-radius: 5px; }
            .summary-row { display: flex; justify-content: space-between; margin: 10px 0; font-size: 16px; }
            .total-row { border-top: 2px solid #1a73e8; padding-top: 10px; margin-top: 10px; font-size: 18px; font-weight: bold; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #ddd; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="data:image/png;base64,${LOGO_BASE64}" class="logo" alt="Nanro Bank Logo" />
            <div class="bank-name">Nanro Bank</div>
            <div class="statement-title">Account Statement</div>
          </div>
          <div class="account-info">
            <div class="info-row"><span class="info-label">Account Name:</span><span>${user?.first_name} ${user?.last_name}</span></div>
            <div class="info-row"><span class="info-label">Account Number:</span><span>${accountNumber}</span></div>
            <div class="info-row"><span class="info-label">Account Type:</span><span>${accountType}</span></div>
            <div class="info-row"><span class="info-label">Email:</span><span>${user?.email}</span></div>
            ${user?.address ? `<div class="info-row"><span class="info-label">Address:</span><span>${user.address}</span></div>` : ''}
            <div class="info-row"><span class="info-label">Statement Period:</span><span>${formatDate(startDate)} to ${formatDate(endDate)}</span></div>
            <div class="info-row"><span class="info-label">Generated On:</span><span>${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</span></div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description / Reference</th>
                <th style="text-align: right;">Credit</th>
                <th style="text-align: right;">Debit</th>
                <th style="text-align: right;">Balance</th>
              </tr>
            </thead>
            <tbody>${transactionRows}</tbody>
          </table>
          <div class="summary">
            <h3 style="margin-top: 0; color: #1a73e8;">Summary</h3>
            <div class="summary-row"><span>Total Credits:</span><span style="color: #4caf50;">${formatCurrency(summary.total_credits)}</span></div>
            <div class="summary-row"><span>Total Debits:</span><span style="color: #f44336;">${formatCurrency(summary.total_debits)}</span></div>
            <div class="summary-row total-row"><span>Net Change:</span><span style="color: ${summary.net_change >= 0 ? '#4caf50' : '#f44336'};">${formatCurrency(summary.net_change)}</span></div>
            <div class="summary-row"><span>Total Transactions:</span><span>${transactionData.length}</span></div>
          </div>
          <div class="footer">
            <p>This is a computer-generated statement and does not require a signature.</p>
            <p>© ${new Date().getFullYear()} Nanro Bank. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;
  };

  const generateCSVContent = (transactionData, summary) => {
    let csv = 'Account Statement - Nanro Bank\n\n';
    csv += `Account Name:,${user?.first_name} ${user?.last_name}\n`;
    csv += `Account Number:,${account?.account_number || 'N/A'}\n`;
    csv += `Account Type:,${account?.account_type || 'Savings'}\n`;
    csv += `Email:,${user?.email}\n`;
    if (user?.address) {
      csv += `Address:,${user.address}\n`;
    }
    csv += `Period:,${formatDate(startDate)} to ${formatDate(endDate)}\n`;
    csv += `Generated:,${new Date().toLocaleString()}\n\n`;
    
    csv += 'Date,Description / Reference,Credit,Debit,Balance After\n';
    
    transactionData.forEach(transaction => {
      const isCredit = transaction.type === 'credit';
      const creditAmount = isCredit ? transaction.amount : '-';
      const debitAmount = !isCredit ? transaction.amount : '-';
      
      csv += `${new Date(transaction.created_at).toLocaleDateString()},`;
      csv += `"${transaction.description || transaction.type} (${transaction.reference || '-'})",`;
      csv += `${creditAmount},`;
      csv += `${debitAmount},`;
      csv += `${transaction.balance_after || 0}\n`;
    });
    
    csv += `\nSummary\n`;
    csv += `Total Credits:,${summary.total_credits}\n`;
    csv += `Total Debits:,${summary.total_debits}\n`;
    csv += `Net Change:,${summary.net_change}\n`;
    csv += `Total Transactions:,${transactionData.length}\n`;
    
    return csv;
  };

  const generateExcelHTML = (transactionData, summary) => {
    const transactionRows = transactionData.map(transaction => {
      const isCredit = transaction.type === 'credit';
      const creditAmount = isCredit ? transaction.amount : '-';
      const debitAmount = !isCredit ? transaction.amount : '-';
      
      return `
      <tr>
        <td>${new Date(transaction.created_at).toLocaleDateString()}</td>
        <td>${transaction.description || transaction.type}<br/>${transaction.reference || ''}</td>
        <td>${creditAmount}</td>
        <td>${debitAmount}</td>
        <td>${transaction.balance_after || 0}</td>
      </tr>
    `;
    }).join('');

    return `
      <html xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
          <meta charset="UTF-8">
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Statement</x:Name>
                  <x:WorksheetOptions>
                    <x:Print>
                      <x:ValidPrinterInfo/>
                    </x:Print>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
        </head>
        <body>
          <h2>Nanro Bank - Account Statement</h2>
          <table border="1">
            <tr><td>Account Name:</td><td>${user?.first_name} ${user?.last_name}</td></tr>
            <tr><td>Account Number:</td><td>${account?.account_number || 'N/A'}</td></tr>
            <tr><td>Account Type:</td><td>${account?.account_type || 'Savings'}</td></tr>
            <tr><td>Email:</td><td>${user?.email}</td></tr>
            ${user?.address ? `<tr><td>Address:</td><td>${user.address}</td></tr>` : ''}
            <tr><td>Period:</td><td>${formatDate(startDate)} to ${formatDate(endDate)}</td></tr>
          </table>
          <br/>
          <table border="1">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description / Reference</th>
                <th>Credit</th>
                <th>Debit</th>
                <th>Balance After</th>
              </tr>
            </thead>
            <tbody>${transactionRows}</tbody>
          </table>
          <br/>
          <table border="1">
            <tr><td><b>Total Credits:</b></td><td>${summary.total_credits}</td></tr>
            <tr><td><b>Total Debits:</b></td><td>${summary.total_debits}</td></tr>
            <tr><td><b>Net Change:</b></td><td>${summary.net_change}</td></tr>
            <tr><td><b>Total Transactions:</b></td><td>${transactionData.length}</td></tr>
          </table>
        </body>
      </html>
    `;
  };

  const generatePDF = async (transactionData, summary) => {
    try {
      const htmlContent = generateHTMLContent(transactionData, summary);
      const timestamp = Date.now();
      const fileName = `${timestamp}_Nanro_Statement_${formatDate(startDate)}_to_${formatDate(endDate)}`;

      const options = {
        html: htmlContent,
        fileName: fileName,
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);
      console.log('PDF generated at:', file.filePath);
      
      return file;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };

  const saveFile = async (content, fileName, mimeType) => {
    try {
      const downloadPath = Platform.OS === 'android' 
        ? `${RNFS.DownloadDirectoryPath}/${fileName}`
        : `${RNFS.DocumentDirectoryPath}/${fileName}`;

      await RNFS.writeFile(downloadPath, content, 'utf8');
      console.log('File saved at:', downloadPath);
      
      return downloadPath;
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  };

  const shareFile = async (filePath, fileName, mimeType, email) => {
    try {
      console.log('Sharing file from:', filePath);
      
      const fileExists = await RNFS.exists(filePath);
      console.log('File exists:', fileExists);
      
      if (!fileExists) {
        throw new Error('File not found at path: ' + filePath);
      }

      // For Android, we need to copy to cache and use content:// URI
      let shareUrl = filePath;
      
      if (Platform.OS === 'android') {
        // Copy file to cache directory for sharing
        const cacheFileName = `${Date.now()}_${fileName}`;
        const cachePath = `${RNFS.CachesDirectoryPath}/${cacheFileName}`;
        
        await RNFS.copyFile(filePath, cachePath);
        console.log('Copied to cache:', cachePath);
        
        shareUrl = `file://${cachePath}`;
      }

      const shareOptions = {
        title: 'Share Account Statement',
        message: `Account Statement for ${user?.first_name} ${user?.last_name}`,
        url: shareUrl,
        type: mimeType,
        subject: 'Account Statement - Nanro Bank',
        email: email,
        failOnCancel: false,
      };

      console.log('Share options:', shareOptions);

      const result = await Share.open(shareOptions);
      console.log('Share result:', result);
      return result;
    } catch (error) {
      if (error.message === 'User did not share' || error.message.includes('cancel')) {
        console.log('User cancelled share');
        return null;
      }
      console.error('Error sharing file:', error);
      throw error;
    }
  };

  const openFile = async (filePath) => {
    try {
      console.log('Opening file:', filePath);
      
      if (Platform.OS === 'android') {
        // Use Share to open the file (more reliable than Linking)
        const fileExists = await RNFS.exists(filePath);
        
        if (!fileExists) {
          Toast.show({
            type: 'error',
            text1: 'File Not Found',
            text2: 'The file could not be found on your device',
          });
          return;
        }

        // Determine mime type
        let mimeType = 'application/pdf';
        if (filePath.endsWith('.xls') || filePath.endsWith('.xlsx')) {
          mimeType = 'application/vnd.ms-excel';
        } else if (filePath.endsWith('.csv')) {
          mimeType = 'text/csv';
        }

        // Copy to cache for opening
        const fileName = filePath.split('/').pop();
        const cachePath = `${RNFS.CachesDirectoryPath}/${fileName}`;
        await RNFS.copyFile(filePath, cachePath);

        await Share.open({
          url: `file://${cachePath}`,
          type: mimeType,
          showAppsToView: true,
          failOnCancel: false,
        });
      } else {
        // iOS
        const supported = await Linking.canOpenURL(filePath);
        if (supported) {
          await Linking.openURL(filePath);
        }
      }
    } catch (error) {
      if (error.message !== 'User did not share' && !error.message.includes('cancel')) {
        console.error('Error opening file:', error);
        Toast.show({
          type: 'info',
          text1: 'No App Found',
          text2: 'Install a file viewer app to open this file',
        });
      }
    }
  };

  const fetchTransactionsForPeriod = async () => {
    try {
      const response = await TransactionService.getTransactions({
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        per_page: 1000,
      });

      if (response.success) {
        const transactionData = response.data.data || [];
        
        // Debug logs
        console.log('========================================');
        console.log('FETCHED TRANSACTIONS:', transactionData.length);
        if (transactionData.length > 0) {
          console.log('First transaction:', transactionData[0]);
          console.log('Amount:', transactionData[0].amount);
          console.log('Amount type:', typeof transactionData[0].amount);
        }
        
        setTransactions(transactionData);

        // CRITICAL FIX: Convert string amounts to numbers
        const credits = transactionData
          .filter(t => t.type === 'credit')
          .reduce((sum, t) => {
            // Force convert string to number
            const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
            console.log(`Credit: ${t.reference} = ${amount} (was ${typeof t.amount})`);
            return sum + (amount || 0);
          }, 0);
        
        const debits = transactionData
          .filter(t => t.type === 'debit' || t.type === 'transfer') // Include 'transfer' type
          .reduce((sum, t) => {
            // Force convert string to number
            const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
            console.log(`Debit: ${t.reference} = ${amount} (was ${typeof t.amount})`);
            return sum + (amount || 0);
          }, 0);

        console.log('CALCULATED TOTALS:');
        console.log('Total Credits:', credits);
        console.log('Total Debits:', debits);
        console.log('Net Change:', credits - debits);
        console.log('========================================');

        setTotalCredits(credits);
        setTotalDebits(debits);

        return transactionData;
      }

      return [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  };

  const onSubmit = async (data) => {
    if (startDate > endDate) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Date Range',
        text2: 'Start date cannot be after end date',
      });
      return;
    }

    try {
      setIsLoading(true);

      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Toast.show({
          type: 'error',
          text1: 'Permission Denied',
          text2: 'Storage permission is required',
        });
        setIsLoading(false);
        return;
      }

      const transactionData = await fetchTransactionsForPeriod();

      if (transactionData.length === 0) {
        Toast.show({
          type: 'info',
          text1: 'No Transactions',
          text2: 'No transactions found for the selected period',
        });
        setIsLoading(false);
        return;
      }

      // Recalculate totals here for PDF (state values may be stale)
      const credits = transactionData
        .filter(t => t.type === 'credit')
        .reduce((sum, t) => {
          const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
          return sum + (amount || 0);
        }, 0);
      
      const debits = transactionData
        .filter(t => t.type === 'debit' || t.type === 'transfer')
        .reduce((sum, t) => {
          const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
          return sum + (amount || 0);
        }, 0);

      const summary = {
        total_credits: credits,
        total_debits: debits,
        net_change: credits - debits,
      };
      
      console.log('📊 Summary for PDF:', summary);

      let filePath;
      let fileName;
      let mimeType;

      const timestamp = Date.now();

      if (selectedFormat === 'pdf') {
        const pdfFile = await generatePDF(transactionData, summary);
        filePath = pdfFile.filePath;
        fileName = `${timestamp}_Nanro_Statement_${formatDate(startDate)}_to_${formatDate(endDate)}.pdf`;
        mimeType = 'application/pdf';
      } else if (selectedFormat === 'csv') {
        const csvContent = generateCSVContent(transactionData, summary);
        fileName = `${timestamp}_Nanro_Statement_${formatDate(startDate)}_to_${formatDate(endDate)}.csv`;
        filePath = await saveFile(csvContent, fileName, 'text/csv');
        mimeType = 'text/csv';
      } else if (selectedFormat === 'excel') {
        const excelContent = generateExcelHTML(transactionData, summary);
        fileName = `${timestamp}_Nanro_Statement_${formatDate(startDate)}_to_${formatDate(endDate)}.xls`;
        filePath = await saveFile(excelContent, fileName, 'application/vnd.ms-excel');
        mimeType = 'application/vnd.ms-excel';
      }

      setIsLoading(false);

      Alert.alert(
        'Statement Generated',
        `Your ${selectedFormat.toUpperCase()} statement has been saved successfully!`,
        [
          {
            text: 'View File',
            onPress: () => openFile(filePath),
          },
          {
            text: 'Share/Email',
            onPress: async () => {
              try {
                await shareFile(filePath, fileName, mimeType, data.email);
              } catch (error) {
                Toast.show({
                  type: 'error',
                  text1: 'Share Failed',
                  text2: error.message,
                });
              }
            },
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );

    } catch (error) {
      console.error('Error generating statement:', error);
      setIsLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Generation Failed',
        text2: error.message || 'Failed to generate statement',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Statement</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.infoCard}>
          <Icon name="info" size={24} color={Colors.primary} />
          <Text style={styles.infoText}>
            Generate and download your account statement in PDF, Excel, or CSV format. Files can be shared via email or any app.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Select Period</Text>
          
          <View style={styles.quickPeriodsContainer}>
            {quickPeriods.map((period, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickPeriodButton}
                onPress={() => handleQuickPeriod(period.days)}>
                <Text style={styles.quickPeriodText}>{period.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <Text style={styles.dateLabel}>Start Date</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowStartDatePicker(true)}>
                <Icon name="calendar-today" size={20} color={Colors.textLight} />
                <Text style={styles.dateText}>
                  {startDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateField}>
              <Text style={styles.dateLabel}>End Date</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowEndDatePicker(true)}>
                <Icon name="calendar-today" size={20} color={Colors.textLight} />
                <Text style={styles.dateText}>
                  {endDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Select Format</Text>
          <View style={styles.formatsContainer}>
            {statementFormats.map((format) => (
              <TouchableOpacity
                key={format.id}
                style={[
                  styles.formatCard,
                  selectedFormat === format.id && styles.formatCardSelected,
                ]}
                onPress={() => setSelectedFormat(format.id)}>
                <Icon name={format.icon} size={32} color={format.color} />
                <Text style={styles.formatName}>{format.name}</Text>
                {selectedFormat === format.id && (
                  <View style={styles.selectedBadge}>
                    <Icon name="check" size={16} color={Colors.white} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email Address"
                placeholder="Enter email for sharing"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                keyboardType="email-address"
                leftIcon="email"
              />
            )}
          />

          <Button
            title={isLoading ? "Generating..." : "Download & Share"}
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
            style={styles.submitButton}
          />
        </View>

        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Features:</Text>
          <View style={styles.featureItem}>
            <Icon name="check" size={16} color={Colors.success} />
            <Text style={styles.featureText}>Download in PDF, Excel, or CSV</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="check" size={16} color={Colors.success} />
            <Text style={styles.featureText}>Share via Email, WhatsApp, Drive</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="check" size={16} color={Colors.success} />
            <Text style={styles.featureText}>All transactions with details</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="check" size={16} color={Colors.success} />
            <Text style={styles.featureText}>Transaction summary & totals</Text>
          </View>
        </View>
      </ScrollView>

      <CustomDatePicker
        visible={showStartDatePicker}
        currentDate={startDate}
        onSelect={setStartDate}
        onClose={() => setShowStartDatePicker(false)}
      />

      <CustomDatePicker
        visible={showEndDatePicker}
        currentDate={endDate}
        onSelect={setEndDate}
        onClose={() => setShowEndDatePicker(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.text,
    marginLeft: Spacing.sm,
    lineHeight: 20,
  },
  form: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  quickPeriodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.lg,
  },
  quickPeriodButton: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  quickPeriodText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  dateField: {
    flex: 1,
    marginHorizontal: 4,
  },
  dateLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: Spacing.sm,
  },
  dateText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.text,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  formatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  formatCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: Spacing.md,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  formatCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  formatName: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  selectedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  featuresCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
  },
  featuresTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  featureText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginLeft: Spacing.sm,
  },
  // Date Picker Styles (same as before...)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerModal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  datePickerTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  datePickerContent: {
    flexDirection: 'row',
    padding: Spacing.md,
    height: 300,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  pickerLabel: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  pickerScroll: {
    flex: 1,
  },
  pickerItem: {
    padding: Spacing.sm,
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  pickerItemSelected: {
    backgroundColor: Colors.primary,
  },
  pickerItemText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.text,
  },
  pickerItemTextSelected: {
    color: Colors.white,
    fontFamily: Fonts.semiBold,
  },
  datePickerFooter: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  datePickerButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  datePickerButtonCancel: {
    backgroundColor: Colors.background,
  },
  datePickerButtonConfirm: {
    backgroundColor: Colors.primary,
  },
  datePickerButtonTextCancel: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  datePickerButtonTextConfirm: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
  },
});

export default AccountStatementScreen;