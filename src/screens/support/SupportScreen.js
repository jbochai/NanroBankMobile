import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const SupportScreen = () => {
  const navigation = useNavigation();
  const [showContactModal, setShowContactModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      subject: '',
      message: '',
    },
  });

  const contactOptions = [
    {
      id: 1,
      title: 'Call Us',
      subtitle: '+234 800 123 4567',
      icon: 'phone',
      color: '#4caf50',
      action: () => Linking.openURL('tel:+2348001234567'),
    },
    {
      id: 2,
      title: 'Email Us',
      subtitle: 'support@nanrobank.com',
      icon: 'email',
      color: '#2196f3',
      action: () => Linking.openURL('mailto:support@nanrobank.com'),
    },
    {
      id: 3,
      title: 'WhatsApp',
      subtitle: 'Chat with us',
      icon: 'chat',
      color: '#4caf50',
      action: () => Linking.openURL('https://wa.me/2348001234567'),
    },
    {
      id: 4,
      title: 'Live Chat',
      subtitle: 'Start a conversation',
      icon: 'chat-bubble',
      color: Colors.primary,
      action: () => {},
    },
  ];

  const faqs = [
    {
      id: 1,
      question: 'How do I reset my password?',
      answer: 'Go to Settings > Security > Change Password. Enter your current password and choose a new one. You can also use "Forgot Password" on the login screen.',
    },
    {
      id: 2,
      question: 'What are the transaction limits?',
      answer: 'Daily transfer limit is ₦500,000 by default. You can adjust limits in Settings > Transaction Limits based on your account tier.',
    },
    {
      id: 3,
      question: 'How do I upgrade my account tier?',
      answer: 'Complete your KYC verification by providing BVN, NIN, and other required documents. Higher tiers offer increased limits and more features.',
    },
    {
      id: 4,
      question: 'Are there charges for transfers?',
      answer: 'Transfers to other Nanro Bank accounts are free. Transfers to other banks cost ₦10 per transaction. Bill payments have no extra charges.',
    },
    {
      id: 5,
      question: 'How long do transfers take?',
      answer: 'Transfers to Nanro Bank accounts are instant. Transfers to other banks typically complete within 5-15 minutes.',
    },
    {
      id: 6,
      question: 'How do I link my card?',
      answer: 'Go to Cards > Request Card or link an existing card. Follow the verification process to complete the setup.',
    },
    {
      id: 7,
      question: 'What should I do if I suspect fraud?',
      answer: 'Immediately contact support via phone or email. Block your account through the app under Settings > Security > Block Account.',
    },
    {
      id: 8,
      question: 'How do rewards points work?',
      answer: 'Earn points on transactions, referrals, and savings. Redeem points for cashback, discounts, and premium features in the Rewards section.',
    },
  ];

  const quickActions = [
    {
      id: 1,
      title: 'FAQs',
      icon: 'help',
      color: Colors.primary,
      screen: null,
    },
    {
      id: 2,
      title: 'Report Issue',
      icon: 'report-problem',
      color: '#f44336',
      action: () => setShowContactModal(true),
    },
    {
      id: 3,
      title: 'Account Security',
      icon: 'security',
      color: '#ff9800',
      screen: 'SecuritySettings',
    },
    {
      id: 4,
      title: 'Transaction History',
      icon: 'receipt-long',
      color: '#4caf50',
      screen: 'Statements',
    },
  ];

  const onSubmitTicket = async (data) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setShowContactModal(false);
      reset();
      
      Toast.show({
        type: 'success',
        text1: 'Support Ticket Created',
        text2: 'We will respond within 24 hours',
      });
    }, 1500);
  };

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const renderContactOption = (option) => (
    <TouchableOpacity
      key={option.id}
      style={styles.contactCard}
      onPress={option.action}>
      <View style={[styles.contactIcon, { backgroundColor: option.color + '20' }]}>
        <Icon name={option.icon} size={28} color={option.color} />
      </View>
      <View style={styles.contactContent}>
        <Text style={styles.contactTitle}>{option.title}</Text>
        <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
      </View>
      <Icon name="chevron-right" size={24} color={Colors.textLight} />
    </TouchableOpacity>
  );

  const renderQuickAction = (action) => (
    <TouchableOpacity
      key={action.id}
      style={styles.quickActionCard}
      onPress={() => {
        if (action.screen) {
          navigation.navigate(action.screen);
        } else if (action.action) {
          action.action();
        }
      }}>
      <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
        <Icon name={action.icon} size={24} color={action.color} />
      </View>
      <Text style={styles.quickActionTitle}>{action.title}</Text>
    </TouchableOpacity>
  );

  const renderFaq = (faq) => (
    <TouchableOpacity
      key={faq.id}
      style={styles.faqCard}
      onPress={() => toggleFaq(faq.id)}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{faq.question}</Text>
        <Icon
          name={expandedFaq === faq.id ? 'expand-less' : 'expand-more'}
          size={24}
          color={Colors.textLight}
        />
      </View>
      {expandedFaq === faq.id && (
        <Text style={styles.faqAnswer}>{faq.answer}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.heroCard}>
          <Icon name="support-agent" size={64} color={Colors.primary} />
          <Text style={styles.heroTitle}>How can we help you?</Text>
          <Text style={styles.heroSubtitle}>
            We're here 24/7 to assist you with any questions or concerns
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          {contactOptions.map(renderContactOption)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map(renderFaq)}
        </View>

        <View style={styles.hoursCard}>
          <Icon name="schedule" size={24} color={Colors.primary} />
          <View style={styles.hoursContent}>
            <Text style={styles.hoursTitle}>Support Hours</Text>
            <Text style={styles.hoursText}>
              24/7 Phone & Email Support{'\n'}
              Live Chat: Mon-Fri, 8AM-8PM
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Report Issue Modal */}
      <Modal
        visible={showContactModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowContactModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Report an Issue</Text>
              <TouchableOpacity onPress={() => setShowContactModal(false)}>
                <Icon name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Controller
                control={control}
                name="subject"
                rules={{ required: 'Subject is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Subject"
                    placeholder="Brief description of your issue"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.subject?.message}
                    leftIcon="subject"
                  />
                )}
              />

              <Controller
                control={control}
                name="message"
                rules={{ required: 'Message is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Message"
                    placeholder="Describe your issue in detail"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.message?.message}
                    multiline
                    numberOfLines={6}
                    style={styles.messageInput}
                  />
                )}
              />

              <Button
                title="Submit Ticket"
                onPress={handleSubmit(onSubmitTicket)}
                loading={isLoading}
                style={styles.submitButton}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  heroCard: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  heroTitle: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  quickActionTitle: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.text,
    textAlign: 'center',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  faqCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginRight: Spacing.sm,
  },
  faqAnswer: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  hoursCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: Spacing.md,
  },
  hoursContent: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  hoursTitle: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 4,
  },
  hoursText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: Spacing.md,
  },
});

export default SupportScreen;