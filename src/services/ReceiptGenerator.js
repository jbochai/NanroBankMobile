import { Platform, PermissionsAndroid } from 'react-native';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import moment from 'moment';
import { formatCurrency } from '../utils/formatting';

class ReceiptGenerator {
  /**
   * Request storage permissions on Android
   */
  async requestStoragePermission() {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      if (Platform.Version >= 33) {
        // Android 13+ doesn't need WRITE_EXTERNAL_STORAGE
        return true;
      }

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to storage to save receipts',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  /**
   * Generate receipt HTML template
   */
  generateReceiptHTML(transaction, user) {
    const isCredit = transaction.type === 'credit' || transaction.type === 'deposit';
    const statusColor = this.getStatusColor(transaction.status);

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Transaction Receipt</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background-color: #f5f5f5;
              padding: 20px;
              color: #333;
            }
            
            .receipt-container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            
            .header {
              background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%);
              padding: 30px 20px;
              text-align: center;
              color: white;
            }
            
            .logo {
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 8px;
            }
            
            .bank-name {
              font-size: 14px;
              opacity: 0.9;
            }
            
            .status-section {
              text-align: center;
              padding: 40px 20px;
              background: #f8fffe;
            }
            
            .status-icon {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              background: ${statusColor === '#4caf50' ? '#e8f5e9' : statusColor === '#f44336' ? '#ffebee' : '#fff8e1'};
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 40px;
            }
            
            .status-text {
              font-size: 20px;
              font-weight: 600;
              color: #333;
              margin-bottom: 16px;
              text-transform: capitalize;
            }
            
            .amount {
              font-size: 36px;
              font-weight: bold;
              color: ${isCredit ? '#4caf50' : '#f44336'};
            }
            
            .section {
              padding: 24px 20px;
              border-top: 1px solid #e0e0e0;
            }
            
            .section-title {
              font-size: 16px;
              font-weight: 600;
              color: #666;
              margin-bottom: 16px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .detail-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 0;
              border-bottom: 1px solid #f5f5f5;
            }
            
            .detail-row:last-child {
              border-bottom: none;
            }
            
            .detail-label {
              font-size: 14px;
              color: #666;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .detail-value {
              font-size: 14px;
              color: #333;
              font-weight: 600;
              text-align: right;
              max-width: 60%;
              word-wrap: break-word;
            }
            
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 600;
              text-transform: capitalize;
              background: ${statusColor}20;
              color: ${statusColor};
            }
            
            .footer {
              padding: 24px 20px;
              text-align: center;
              background: #f8f9fa;
              border-top: 1px solid #e0e0e0;
            }
            
            .footer-text {
              font-size: 12px;
              color: #666;
              line-height: 1.6;
            }
            
            .generated-date {
              margin-top: 16px;
              font-size: 11px;
              color: #999;
            }
            
            @media print {
              body {
                background: white;
                padding: 0;
              }
              
              .receipt-container {
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <div class="logo">NANRO BANK</div>
              <div class="bank-name">Transaction Receipt</div>
            </div>
            
            <div class="status-section">
              <div class="status-icon">
                ${transaction.status === 'completed' ? '✓' : transaction.status === 'failed' ? '✗' : '⏱'}
              </div>
              <div class="status-text">Transaction ${transaction.status}</div>
              <div class="amount">${isCredit ? '+' : '-'}${formatCurrency(transaction.amount)}</div>
            </div>
            
            <div class="section">
              <div class="section-title">Transaction Information</div>
              
              <div class="detail-row">
                <div class="detail-label">Transaction Type</div>
                <div class="detail-value">${transaction.type?.toUpperCase()}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Amount</div>
                <div class="detail-value" style="color: ${isCredit ? '#4caf50' : '#f44336'}">
                  ${formatCurrency(transaction.amount)}
                </div>
              </div>
              
              ${transaction.fee && parseFloat(transaction.fee) > 0 ? `
              <div class="detail-row">
                <div class="detail-label">Transaction Fee</div>
                <div class="detail-value">${formatCurrency(transaction.fee)}</div>
              </div>
              ` : ''}
              
              <div class="detail-row">
                <div class="detail-label">Reference Number</div>
                <div class="detail-value" style="font-size: 11px; word-break: break-all;">
                  ${transaction.reference}
                </div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Date & Time</div>
                <div class="detail-value">
                  ${moment(transaction.created_at).format('MMM DD, YYYY • h:mm A')}
                </div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Status</div>
                <div class="detail-value">
                  <span class="status-badge">${transaction.status}</span>
                </div>
              </div>
            </div>
            
            ${transaction.recipient_account_name || transaction.recipient_account_number || transaction.description ? `
            <div class="section">
              <div class="section-title">Additional Information</div>
              
              ${transaction.recipient_account_name ? `
              <div class="detail-row">
                <div class="detail-label">${isCredit ? 'Sender' : 'Recipient'}</div>
                <div class="detail-value">${transaction.recipient_account_name}</div>
              </div>
              ` : ''}
              
              ${transaction.recipient_account_number ? `
              <div class="detail-row">
                <div class="detail-label">Account Number</div>
                <div class="detail-value">${transaction.recipient_account_number}</div>
              </div>
              ` : ''}
              
              ${transaction.recipient_bank_name ? `
              <div class="detail-row">
                <div class="detail-label">Bank</div>
                <div class="detail-value">${transaction.recipient_bank_name}</div>
              </div>
              ` : ''}
              
              ${transaction.description ? `
              <div class="detail-row">
                <div class="detail-label">Description</div>
                <div class="detail-value">${transaction.description}</div>
              </div>
              ` : ''}
              
              ${transaction.session_id ? `
              <div class="detail-row">
                <div class="detail-label">Session ID</div>
                <div class="detail-value" style="font-size: 11px; word-break: break-all;">
                  ${transaction.session_id}
                </div>
              </div>
              ` : ''}
            </div>
            ` : ''}
            
            <div class="footer">
              <div class="footer-text">
                This is an electronically generated receipt and does not require a signature.<br>
                For inquiries, contact: support@nanrobank.com | 0800-NANRO-BANK
              </div>
              <div class="generated-date">
                Generated on ${moment().format('MMMM DD, YYYY [at] h:mm A')}
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Get status color
   */
  getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return '#4caf50';
      case 'pending':
      case 'processing':
        return '#ff9800';
      case 'failed':
        return '#f44336';
      default:
        return '#999';
    }
  }

  /**
   * Generate and download PDF receipt
   */
  async generateAndDownloadPDF(transaction, user) {
    try {
      const hasPermission = await this.requestStoragePermission();
      if (!hasPermission) {
        throw new Error('Storage permission denied');
      }

      const html = this.generateReceiptHTML(transaction, user);
      
      // Use different directory based on platform
      let directory;
      if (Platform.OS === 'ios') {
        directory = 'Documents';
      } else {
        // For Android, use the app's document directory
        directory = RNFS.DocumentDirectoryPath;
      }
      
      const fileName = `receipt_${transaction.reference}`;
      
      const options = {
        html,
        fileName,
        directory,
        base64: false,
      };

      console.log('PDF Generation Options:', options);
      
      const file = await RNHTMLtoPDF.convert(options);
      
      console.log('PDF Generated:', file);
      
      // For Android, copy to Downloads folder
      if (Platform.OS === 'android' && file.filePath) {
        const downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}.pdf`;
        
        try {
          // Check if file exists at source
          const fileExists = await RNFS.exists(file.filePath);
          console.log('Source file exists:', fileExists, file.filePath);
          
          if (fileExists) {
            // Copy to Downloads
            await RNFS.copyFile(file.filePath, downloadPath);
            console.log('File copied to Downloads:', downloadPath);
            
            return {
              success: true,
              filePath: downloadPath,
              fileName: `${fileName}.pdf`,
            };
          } else {
            throw new Error('Generated PDF file not found');
          }
        } catch (copyError) {
          console.log('Copy error, using original path:', copyError);
          // If copy fails, return original path
          return {
            success: true,
            filePath: file.filePath,
            fileName: `${fileName}.pdf`,
          };
        }
      }
      
      return {
        success: true,
        filePath: file.filePath,
        fileName: `${fileName}.pdf`,
      };
    } catch (error) {
      console.error('Error generating PDF:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Share PDF receipt
   */
  async sharePDF(transaction, user) {
    try {
      const result = await this.generateAndDownloadPDF(transaction, user);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      console.log('Sharing PDF from:', result.filePath);
      
      // Verify file exists
      const fileExists = await RNFS.exists(result.filePath);
      console.log('File exists for sharing:', fileExists);
      
      if (!fileExists) {
        throw new Error('PDF file not found');
      }

      // Get proper file URI for sharing
      let fileUri = result.filePath;
      
      if (Platform.OS === 'android') {
        // For Android, use file:// protocol
        if (!fileUri.startsWith('file://')) {
          fileUri = `file://${fileUri}`;
        }
      }
      
      console.log('Sharing with URI:', fileUri);

      const shareOptions = {
        title: 'Transaction Receipt',
        message: `Transaction Receipt - ${transaction.reference}`,
        url: fileUri,
        type: 'application/pdf',
        subject: 'Transaction Receipt from Nanro Bank',
        failOnCancel: false,
      };

      const shareResponse = await Share.open(shareOptions);
      console.log('Share response:', shareResponse);
      
      return {
        success: true,
      };
    } catch (error) {
      console.error('Error sharing PDF:', error);
      if (error.message !== 'User did not share') {
        return {
          success: false,
          error: error.message,
        };
      }
      return { success: true };
    }
  }

  /**
   * Share transaction details as text
   */
  async shareAsText(transaction) {
    try {
      const isCredit = transaction.type === 'credit' || transaction.type === 'deposit';
      
      const message = `
NANRO BANK
Transaction Receipt
-------------------

Transaction ${transaction.status?.toUpperCase()}
Amount: ${isCredit ? '+' : '-'}${formatCurrency(transaction.amount)}

Transaction Information:
• Type: ${transaction.type?.toUpperCase()}
• Amount: ${formatCurrency(transaction.amount)}
${transaction.fee && parseFloat(transaction.fee) > 0 ? `• Fee: ${formatCurrency(transaction.fee)}` : ''}
• Reference: ${transaction.reference}
• Date: ${moment(transaction.created_at).format('MMM DD, YYYY h:mm A')}
• Status: ${transaction.status}

${transaction.recipient_account_name ? `
Additional Information:
• ${isCredit ? 'Sender' : 'Recipient'}: ${transaction.recipient_account_name}
${transaction.recipient_account_number ? `• Account: ${transaction.recipient_account_number}` : ''}
${transaction.recipient_bank_name ? `• Bank: ${transaction.recipient_bank_name}` : ''}
${transaction.description ? `• Description: ${transaction.description}` : ''}
` : ''}

Generated: ${moment().format('MMM DD, YYYY h:mm A')}

For inquiries: support@nanrobank.com
      `.trim();

      const shareOptions = {
        title: 'Transaction Receipt',
        message,
        subject: 'Transaction Receipt',
        failOnCancel: false,
      };

      await Share.open(shareOptions);
      
      return {
        success: true,
      };
    } catch (error) {
      if (error.message !== 'User did not share') {
        console.error('Error sharing text:', error);
        return {
          success: false,
          error: error.message,
        };
      }
      return { success: true };
    }
  }
}

export default new ReceiptGenerator();