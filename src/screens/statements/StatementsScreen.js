import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const StatementsScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const statements = [
    {
      id: 1,
      period: 'November 2024',
      dateRange: 'Nov 1 - Nov 30, 2024',
      format: 'PDF',
      size: '2.4 MB',
      status: 'ready',
      generatedDate: '2024-11-30',
    },
    {
      id: 2,
      period: 'October 2024',
      dateRange: 'Oct 1 - Oct 31, 2024',
      format: 'PDF',
      size: '2.1 MB',
      status: 'ready',
      generatedDate: '2024-10-31',
    },
    {
      id: 3,
      period: 'September 2024',
      dateRange: 'Sep 1 - Sep 30, 2024',
      format: 'Excel',
      size: '1.8 MB',
      status: 'ready',
      generatedDate: '2024-09-30',
    },
    {
      id: 4,
      period: 'Q3 2024',
      dateRange: 'Jul 1 - Sep 30, 2024',
      format: 'PDF',
      size: '5.2 MB',
      status: 'ready',
      generatedDate: '2024-09-30',
    },
    {
      id: 5,
      period: 'Custom Statement',
      dateRange: 'Aug 15 - Aug 30, 2024',
      format: 'CSV',
      size: '0.8 MB',
      status: 'processing',
      generatedDate: '2024-08-30',
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getFormatIcon = (format) => {
    switch (format.toLowerCase()) {
      case 'pdf':
        return { name: 'picture-as-pdf', color: '#f44336' };
      case 'excel':
        return { name: 'table-chart', color: '#4caf50' };
      case 'csv':
        return { name: 'description', color: '#2196f3' };
      default:
        return { name: 'description', color: Colors.textLight };
    }
  };

  const renderStatement = (statement) => {
    const formatIcon = getFormatIcon(statement.format);
    
    return (
      <View key={statement.id} style={styles.statementCard}>
        <View style={[styles.formatIcon, { backgroundColor: formatIcon.color + '20' }]}>
          <Icon name={formatIcon.icon} size={28} color={formatIcon.color} />
        </View>
        
        <View style={styles.statementInfo}>
          <Text style={styles.statementPeriod}>{statement.period}</Text>
          <Text style={styles.statementDateRange}>{statement.dateRange}</Text>
          <View style={styles.statementMeta}>
            <Text style={styles.statementSize}>{statement.size}</Text>
            <Text style={styles.statementDot}>•</Text>
            <Text style={styles.statementFormat}>{statement.format}</Text>
          </View>
        </View>

        <View style={styles.statementActions}>
          {statement.status === 'ready' ? (
            <>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="visibility" size={20} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="download" size={20} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="share" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.processingBadge}>
              <Icon name="schedule" size={16} color={Colors.warning} />
              <Text style={styles.processingText}>Processing</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Statements</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AccountStatement')}>
          <Icon name="add" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        
        <TouchableOpacity
          style={styles.generateCard}
          onPress={() => navigation.navigate('AccountStatement')}>
          <View style={styles.generateIcon}>
            <Icon name="add-circle" size={32} color={Colors.primary} />
          </View>
          <View style={styles.generateContent}>
            <Text style={styles.generateTitle}>Generate New Statement</Text>
            <Text style={styles.generateText}>
              Create a custom statement for any period
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color={Colors.textLight} />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Statements</Text>
          {statements.map(renderStatement)}
        </View>

        <View style={styles.infoCard}>
          <Icon name="info" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>
            Statements are generated automatically at the end of each month.
            Custom statements are available for up to 12 months.
          </Text>
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
  generateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  generateIcon: {
    marginRight: Spacing.md,
  },
  generateContent: {
    flex: 1,
  },
  generateTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
    marginBottom: 2,
  },
  generateText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.primary,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  statementCard: {
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
  formatIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  statementInfo: {
    flex: 1,
  },
  statementPeriod: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 2,
  },
  statementDateRange: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: 4,
  },
  statementMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statementSize: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  statementDot: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginHorizontal: 4,
  },
  statementFormat: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: Colors.textLight,
  },
  statementActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: Spacing.xs,
    marginLeft: 4,
  },
  processingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warningLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  processingText: {
    fontSize: 11,
    fontFamily: Fonts.semiBold,
    color: Colors.warning,
    marginLeft: 4,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.text,
    marginLeft: Spacing.sm,
    lineHeight: 18,
  },
});

export default StatementsScreen;