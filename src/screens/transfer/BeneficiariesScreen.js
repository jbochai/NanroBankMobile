import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import SecureStorage from '../../utils/storage';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing, BorderRadius } from '../../styles/spacing';

const BeneficiariesScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  const loadBeneficiaries = async () => {
    setLoading(true);
    try {
      // Load beneficiaries from secure storage or API
      const saved = await SecureStorage.getBeneficiaries();
      setBeneficiaries(saved || []);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load beneficiaries',
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBeneficiaries();
    setRefreshing(false);
  };

  const handleAddBeneficiary = () => {
    navigation.navigate('AddBeneficiary');
  };

  const handleBeneficiaryPress = (beneficiary) => {
    navigation.navigate('Transfer', {
      beneficiary: {
        accountNumber: beneficiary.account_number,
        accountName: beneficiary.account_name,
        bankName: beneficiary.bank_name,
        bankCode: beneficiary.bank_code,
      },
    });
  };

  const handleDeletePress = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setShowDeleteDialog(true);
  };

  const handleDeleteBeneficiary = async () => {
    setShowDeleteDialog(false);
    setLoading(true);

    try {
      await SecureStorage.removeBeneficiary(selectedBeneficiary.account_number);
      
      Toast.show({
        type: 'success',
        text1: 'Beneficiary Removed',
        text2: 'Beneficiary has been removed successfully',
      });
      
      await loadBeneficiaries();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to remove beneficiary',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredBeneficiaries = beneficiaries.filter((beneficiary) =>
    beneficiary.account_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    beneficiary.account_number?.includes(searchQuery) ||
    beneficiary.bank_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBeneficiaryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.beneficiaryItem}
      onPress={() => handleBeneficiaryPress(item)}
      activeOpacity={0.7}>
      <View style={styles.beneficiaryIcon}>
        <Icon name="person" size={24} color={Colors.primary} />
      </View>

      <View style={styles.beneficiaryDetails}>
        <Text style={styles.beneficiaryName}>{item.account_name}</Text>
        <Text style={styles.beneficiaryAccount}>
          {item.account_number} • {item.bank_name}
        </Text>
        {item.nickname && (
          <Text style={styles.beneficiaryNickname}>"{item.nickname}"</Text>
        )}
      </View>

      <View style={styles.beneficiaryActions}>
        <TouchableOpacity
          onPress={() => handleBeneficiaryPress(item)}
          style={styles.actionButton}>
          <Icon name="send" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeletePress(item)}
          style={styles.actionButton}>
          <Icon name="delete-outline" size={20} color={Colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="person-add" size={80} color={Colors.textMuted} />
      <Text style={styles.emptyTitle}>No Beneficiaries</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? 'No beneficiaries match your search'
          : 'Add beneficiaries to transfer money quickly'}
      </Text>
      {!searchQuery && (
        <Button
          title="Add Beneficiary"
          onPress={handleAddBeneficiary}
          gradient
          icon="add"
          style={styles.emptyButton}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header
        title="Beneficiaries"
        showBack={true}
        rightComponent={
          <TouchableOpacity onPress={handleAddBeneficiary}>
            <Icon name="person-add" size={24} color={Colors.primary} />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        {/* Search Bar */}
        {beneficiaries.length > 0 && (
          <Input
            placeholder="Search beneficiaries..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            icon="search"
            style={styles.searchInput}
          />
        )}

        {/* Beneficiaries Count */}
        {filteredBeneficiaries.length > 0 && (
          <View style={styles.countContainer}>
            <Text style={styles.countText}>
              {filteredBeneficiaries.length} Beneficiar{filteredBeneficiaries.length === 1 ? 'y' : 'ies'}
            </Text>
          </View>
        )}

        {/* Beneficiaries List */}
        <FlatList
          data={filteredBeneficiaries}
          renderItem={renderBeneficiaryItem}
          keyExtractor={(item) => item.account_number}
          contentContainerStyle={styles.beneficiariesList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={renderEmptyState}
        />

        {/* Quick Add Button */}
        {beneficiaries.length > 0 && !searchQuery && (
          <Button
            title="Add New Beneficiary"
            onPress={handleAddBeneficiary}
            icon="add"
            gradient
            style={styles.addButton}
          />
        )}
      </View>

      {/* Delete Confirmation */}
      <Alert
        visible={showDeleteDialog}
        type="warning"
        title="Remove Beneficiary"
        message={`Are you sure you want to remove ${selectedBeneficiary?.account_name} from your beneficiaries?`}
        confirmText="Remove"
        cancelText="Cancel"
        showCancel={true}
        onConfirm={handleDeleteBeneficiary}
        onClose={() => setShowDeleteDialog(false)}
      />

      <Loader visible={loading && !refreshing} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  searchInput: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
  },
  countContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  countText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textLight,
  },
  beneficiariesList: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
  beneficiaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    marginBottom: 1,
  },
  beneficiaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  beneficiaryDetails: {
    flex: 1,
    marginRight: Spacing.md,
  },
  beneficiaryName: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 4,
  },
  beneficiaryAccount: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: 2,
  },
  beneficiaryNickname: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  beneficiaryActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl * 2,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  emptyButton: {
    minWidth: 200,
  },
  addButton: {
    margin: Spacing.lg,
  },
});

export default BeneficiariesScreen;
