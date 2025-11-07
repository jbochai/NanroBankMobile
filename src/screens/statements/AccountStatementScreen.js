import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const AccountStatementScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      format: 'pdf',
    },
  });

  const statementFormats = [
    { id: 'pdf', name: 'PDF', icon: 'picture-as-pdf', color: '#f44336' },
    { id: 'excel', name: 'Excel', icon: 'table-chart', color: '#4caf50' },
    { id: 'csv', name: 'CSV', icon: 'description', color: '#2196f3' },
  ];

  const [selectedFormat, setSelectedFormat] = useState('pdf');

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

  const onSubmit = async (data) => {
    if (startDate > endDate) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Date Range',
        text2: 'Start date cannot be after end date',
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Statement Generated',
        text2: `Statement sent to ${data.email}`,
      });
    }, 2000);
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
            Generate and download your account statement for any period.
            Statement will be sent to your email address.
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
                onPress={() => setShowStartDate(true)}>
                <Icon name="calendar-today" size={20} color={Colors.textLight} />
                <Text style={styles.dateText}>
                  {startDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateField}>
              <Text style={styles.dateLabel}>End Date</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowEndDate(true)}>
                <Icon name="calendar-today" size={20} color={Colors.textLight} />
                <Text style={styles.dateText}>
                  {endDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {showStartDate && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowStartDate(false);
                if (date) setStartDate(date);
              }}
            />
          )}

          {showEndDate && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowEndDate(false);
                if (date) setEndDate(date);
              }}
            />
          )}

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
                placeholder="Enter email address"
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
            title="Generate Statement"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            style={styles.submitButton}
          />
        </View>

        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Statement Includes:</Text>
          <View style={styles.featureItem}>
            <Icon name="check" size={16} color={Colors.success} />
            <Text style={styles.featureText}>All transactions (credits & debits)</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="check" size={16} color={Colors.success} />
            <Text style={styles.featureText}>Opening and closing balance</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="check" size={16} color={Colors.success} />
            <Text style={styles.featureText}>Transaction descriptions</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="check" size={16} color={Colors.success} />
            <Text style={styles.featureText}>Account details</Text>
          </View>
        </View>
      </ScrollView>
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
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.text,
    marginLeft: Spacing.sm,
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
});

export default AccountStatementScreen;