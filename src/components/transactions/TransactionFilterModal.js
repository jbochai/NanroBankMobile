import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

import Button from '../common/Button';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing, BorderRadius } from '../../styles/spacing';

const TransactionFilterModal = ({ visible, filters, onApply, onClear, onClose }) => {
  const [localFilters, setLocalFilters] = useState({
    type: null,
    status: null,
    fromDate: null,
    toDate: null,
  });

  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setLocalFilters(filters);
    }
  }, [visible, filters]);

  const transactionTypes = [
    { label: 'All Types', value: null },
    { label: 'Credit', value: 'credit' },
    { label: 'Debit', value: 'debit' },
    { label: 'Transfer', value: 'transfer' },
    { label: 'Airtime', value: 'airtime' },
    { label: 'Data', value: 'data' },
    { label: 'Bills', value: 'bills' },
    { label: 'Withdrawal', value: 'withdrawal' },
    { label: 'Deposit', value: 'deposit' },
  ];

  const transactionStatuses = [
    { label: 'All Statuses', value: null },
    { label: 'Completed', value: 'completed' },
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Failed', value: 'failed' },
    { label: 'Reversed', value: 'reversed' },
  ];

  const handleTypeSelect = (type) => {
    setLocalFilters((prev) => ({ ...prev, type }));
  };

  const handleStatusSelect = (status) => {
    setLocalFilters((prev) => ({ ...prev, status }));
  };

  const handleFromDateChange = (event, selectedDate) => {
    setShowFromDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
      setLocalFilters((prev) => ({ ...prev, fromDate: formattedDate }));
    }
  };

  const handleToDateChange = (event, selectedDate) => {
    setShowToDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
      setLocalFilters((prev) => ({ ...prev, toDate: formattedDate }));
    }
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleClear = () => {
    setLocalFilters({
      type: null,
      status: null,
      fromDate: null,
      toDate: null,
    });
    onClear();
  };

  const renderOption = (option, isSelected, onPress) => (
    <TouchableOpacity
      key={option.value || 'null'}
      onPress={onPress}
      style={[styles.option, isSelected && styles.optionSelected]}>
      <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
        {option.label}
      </Text>
      {isSelected && <Icon name="check" size={20} color={Colors.primary} />}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filter Transactions</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Icon name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Transaction Type */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Transaction Type</Text>
              <View style={styles.optionsGrid}>
                {transactionTypes.map((type) =>
                  renderOption(
                    type,
                    localFilters.type === type.value,
                    () => handleTypeSelect(type.value)
                  )
                )}
              </View>
            </View>

            {/* Transaction Status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Transaction Status</Text>
              <View style={styles.optionsGrid}>
                {transactionStatuses.map((status) =>
                  renderOption(
                    status,
                    localFilters.status === status.value,
                    () => handleStatusSelect(status.value)
                  )
                )}
              </View>
            </View>

            {/* Date Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Date Range</Text>
              
              {/* From Date */}
              <View style={styles.dateSection}>
                <Text style={styles.dateLabel}>From Date</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowFromDatePicker(true)}>
                  <Icon name="calendar-today" size={20} color={Colors.primary} />
                  <Text style={styles.dateButtonText}>
                    {localFilters.fromDate
                      ? moment(localFilters.fromDate).format('MMM DD, YYYY')
                      : 'Select start date'}
                  </Text>
                  {localFilters.fromDate && (
                    <TouchableOpacity
                      onPress={() =>
                        setLocalFilters((prev) => ({ ...prev, fromDate: null }))
                      }
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Icon name="close" size={18} color={Colors.textLight} />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              </View>

              {/* To Date */}
              <View style={styles.dateSection}>
                <Text style={styles.dateLabel}>To Date</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowToDatePicker(true)}>
                  <Icon name="calendar-today" size={20} color={Colors.primary} />
                  <Text style={styles.dateButtonText}>
                    {localFilters.toDate
                      ? moment(localFilters.toDate).format('MMM DD, YYYY')
                      : 'Select end date'}
                  </Text>
                  {localFilters.toDate && (
                    <TouchableOpacity
                      onPress={() =>
                        setLocalFilters((prev) => ({ ...prev, toDate: null }))
                      }
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Icon name="close" size={18} color={Colors.textLight} />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              </View>

              {/* Quick Date Filters */}
              <View style={styles.quickFilters}>
                <TouchableOpacity
                  style={styles.quickFilterButton}
                  onPress={() => {
                    setLocalFilters((prev) => ({
                      ...prev,
                      fromDate: moment().startOf('day').format('YYYY-MM-DD'),
                      toDate: moment().endOf('day').format('YYYY-MM-DD'),
                    }));
                  }}>
                  <Text style={styles.quickFilterText}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickFilterButton}
                  onPress={() => {
                    setLocalFilters((prev) => ({
                      ...prev,
                      fromDate: moment().startOf('week').format('YYYY-MM-DD'),
                      toDate: moment().endOf('week').format('YYYY-MM-DD'),
                    }));
                  }}>
                  <Text style={styles.quickFilterText}>This Week</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickFilterButton}
                  onPress={() => {
                    setLocalFilters((prev) => ({
                      ...prev,
                      fromDate: moment().startOf('month').format('YYYY-MM-DD'),
                      toDate: moment().endOf('month').format('YYYY-MM-DD'),
                    }));
                  }}>
                  <Text style={styles.quickFilterText}>This Month</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Button
              title="Clear All"
              onPress={handleClear}
              variant="outline"
              style={styles.footerButton}
            />
            <Button
              title="Apply Filters"
              onPress={handleApply}
              gradient
              style={styles.footerButton}
            />
          </View>

          {/* Date Pickers */}
          {showFromDatePicker && (
            <DateTimePicker
              value={localFilters.fromDate ? new Date(localFilters.fromDate) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleFromDateChange}
              maximumDate={new Date()}
            />
          )}

          {showToDatePicker && (
            <DateTimePicker
              value={localFilters.toDate ? new Date(localFilters.toDate) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleToDateChange}
              maximumDate={new Date()}
              minimumDate={localFilters.fromDate ? new Date(localFilters.fromDate) : undefined}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    minWidth: '47%',
    gap: Spacing.xs,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  optionText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    flex: 1,
  },
  optionTextSelected: {
    color: Colors.primary,
  },
  dateSection: {
    marginBottom: Spacing.md,
  },
  dateLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    gap: Spacing.sm,
  },
  dateButtonText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.text,
  },
  quickFilters: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  quickFilterButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
  },
  quickFilterText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.md,
  },
  footerButton: {
    flex: 1,
  },
});

export default TransactionFilterModal;