import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const SavingsScreen = () => {
  const navigation = useNavigation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      planName: '',
      targetAmount: '',
      duration: '',
    },
  });

  const savingsPlans = [
    {
      id: 1,
      name: 'Emergency Fund',
      targetAmount: 500000,
      currentAmount: 350000,
      percentage: 70,
      duration: '12 months',
      interestRate: 5,
      frequency: 'Monthly',
      nextDeposit: 'Dec 15, 2024',
      icon: 'security',
      color: '#f44336',
    },
    {
      id: 2,
      name: 'Vacation Trip',
      targetAmount: 300000,
      currentAmount: 180000,
      percentage: 60,
      duration: '6 months',
      interestRate: 4,
      frequency: 'Weekly',
      nextDeposit: 'Dec 10, 2024',
      icon: 'flight',
      color: '#2196f3',
    },
    {
      id: 3,
      name: 'New Car',
      targetAmount: 2000000,
      currentAmount: 400000,
      percentage: 20,
      duration: '24 months',
      interestRate: 6,
      frequency: 'Monthly',
      nextDeposit: 'Dec 20, 2024',
      icon: 'directions-car',
      color: '#4caf50',
    },
  ];

  const savingsOptions = [
    {
      id: 1,
      name: 'Target Savings',
      description: 'Save towards a specific goal',
      minAmount: '₦5,000',
      interestRate: '5% p.a.',
      icon: 'flag',
      color: Colors.primary,
    },
    {
      id: 2,
      name: 'Fixed Savings',
      description: 'Lock funds for a period',
      minAmount: '₦50,000',
      interestRate: '8% p.a.',
      icon: 'lock',
      color: '#ff9800',
    },
    {
      id: 3,
      name: 'Flexible Savings',
      description: 'Save and withdraw anytime',
      minAmount: '₦1,000',
      interestRate: '3% p.a.',
      icon: 'account-balance-wallet',
      color: '#4caf50',
    },
    {
      id: 4,
      name: 'Group Savings',
      description: 'Save with friends & family',
      minAmount: '₦10,000',
      interestRate: '4% p.a.',
      icon: 'group',
      color: '#9c27b0',
    },
  ];

  const onSubmitCreatePlan = async (data) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setShowCreateModal(false);
      reset();
      
      Toast.show({
        type: 'success',
        text1: 'Savings Plan Created',
        text2: `${data.planName} has been created successfully`,
      });
    }, 1500);
  };

  const renderSavingsPlan = (plan) => (
    <TouchableOpacity key={plan.id} style={styles.planCard}>
      <View style={styles.planHeader}>
        <View style={[styles.planIcon, { backgroundColor: plan.color + '20' }]}>
          <Icon name={plan.icon} size={24} color={plan.color} />
        </View>
        <View style={styles.planInfo}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planDuration}>{plan.duration} • {plan.frequency}</Text>
        </View>
        <TouchableOpacity>
          <Icon name="more-vert" size={24} color={Colors.textLight} />
        </TouchableOpacity>
      </View>

      <View style={styles.planProgress}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressCurrent}>₦{plan.currentAmount.toLocaleString()}</Text>
          <Text style={styles.progressTarget}>of ₦{plan.targetAmount.toLocaleString()}</Text>
        </View>
        <Text style={styles.progressPercentage}>{plan.percentage}%</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${plan.percentage}%`, backgroundColor: plan.color }]} />
      </View>

      <View style={styles.planFooter}>
        <View style={styles.footerItem}>
          <Icon name="trending-up" size={16} color={Colors.textLight} />
          <Text style={styles.footerText}>{plan.interestRate}% p.a.</Text>
        </View>
        <View style={styles.footerItem}>
          <Icon name="event" size={16} color={Colors.textLight} />
          <Text style={styles.footerText}>Next: {plan.nextDeposit}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSavingsOption = (option) => (
    <TouchableOpacity key={option.id} style={styles.optionCard}>
      <View style={[styles.optionIcon, { backgroundColor: option.color + '20' }]}>
        <Icon name={option.icon} size={32} color={option.color} />
      </View>
      <Text style={styles.optionName}>{option.name}</Text>
      <Text style={styles.optionDescription}>{option.description}</Text>
      <View style={styles.optionDetails}>
        <Text style={styles.optionDetail}>{option.minAmount} minimum</Text>
        <Text style={styles.optionRate}>{option.interestRate}</Text>
      </View>
    </TouchableOpacity>
  );

  const totalSaved = savingsPlans.reduce((sum, plan) => sum + plan.currentAmount, 0);
  const totalTarget = savingsPlans.reduce((sum, plan) => sum + plan.targetAmount, 0);
  const overallProgress = ((totalSaved / totalTarget) * 100).toFixed(1);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Savings</Text>
        <TouchableOpacity onPress={() => setShowCreateModal(true)}>
          <Icon name="add" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Savings</Text>
          <Text style={styles.summaryValue}>₦{totalSaved.toLocaleString()}</Text>
          <View style={styles.summaryProgress}>
            <View style={styles.summaryProgressInfo}>
              <Text style={styles.summaryProgressText}>
                {overallProgress}% of target
              </Text>
            </View>
            <Icon name="trending-up" size={20} color={Colors.white} />
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Savings Plans</Text>
          {savingsPlans.map(renderSavingsPlan)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Start Saving Today</Text>
          <View style={styles.optionsGrid}>
            {savingsOptions.map(renderSavingsOption)}
          </View>
        </View>

        <View style={styles.tipsCard}>
          <Icon name="lightbulb" size={24} color={Colors.warning} />
          <View style={styles.tipsContent}>
            <Text style={styles.tipsTitle}>Savings Tips</Text>
            <Text style={styles.tipsText}>
              • Set realistic goals{'\n'}
              • Automate your savings{'\n'}
              • Start small and increase gradually{'\n'}
              • Review and adjust regularly
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Create Savings Plan Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Savings Plan</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Icon name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Controller
                control={control}
                name="planName"
                rules={{ required: 'Plan name is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Plan Name"
                    placeholder="e.g. Emergency Fund"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.planName?.message}
                    leftIcon="flag"
                  />
                )}
              />

              <Controller
                control={control}
                name="targetAmount"
                rules={{ required: 'Target amount is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Target Amount (₦)"
                    placeholder="Enter target amount"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.targetAmount?.message}
                    keyboardType="numeric"
                    leftIcon="account-balance-wallet"
                  />
                )}
              />

              <Controller
                control={control}
                name="duration"
                rules={{ required: 'Duration is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Duration (months)"
                    placeholder="e.g. 12"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.duration?.message}
                    keyboardType="numeric"
                    leftIcon="schedule"
                  />
                )}
              />

              <Button
                title="Create Plan"
                onPress={handleSubmit(onSubmitCreatePlan)}
                loading={isLoading}
                style={styles.modalButton}
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
  summaryCard: {
    borderRadius: 16,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: Spacing.xs,
  },
  summaryValue: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  summaryProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryProgressInfo: {
    flex: 1,
  },
  summaryProgressText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.white,
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
  planCard: {
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
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 2,
  },
  planDuration: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  planProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.xs,
  },
  progressInfo: {
    flex: 1,
  },
  progressCurrent: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },
  progressTarget: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  progressPercentage: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  planFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginLeft: 4,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  optionName: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
  },
  optionDetails: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.xs,
  },
  optionDetail: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: 2,
  },
  optionRate: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.warningLight,
    padding: Spacing.md,
    borderRadius: 8,
  },
  tipsContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  tipsTitle: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 4,
  },
  tipsText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.text,
    lineHeight: 18,
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
  modalButton: {
    marginTop: Spacing.md,
  },
});

export default SavingsScreen;