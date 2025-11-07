import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing, BorderRadius } from '../../styles/spacing';

const BillPaymentScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const billCategories = [
    {
      id: 'electricity',
      name: 'Electricity',
      icon: 'bolt',
      color: Colors.warning,
      providers: ['AEDC', 'EKEDC', 'IKEDC', 'PHED'],
    },
    {
      id: 'tv',
      name: 'Cable TV',
      icon: 'tv',
      color: Colors.info,
      providers: ['DSTV', 'GOTV', 'StarTimes', 'ShowMax'],
    },
    {
      id: 'internet',
      name: 'Internet',
      icon: 'wifi',
      color: Colors.success,
      providers: ['Spectranet', 'Smile', 'Swift', 'Coollink'],
    },
    {
      id: 'education',
      name: 'Education',
      icon: 'school',
      color: Colors.primary,
      providers: ['WAEC', 'JAMB', 'NECO'],
    },
    {
      id: 'betting',
      name: 'Betting',
      icon: 'sports-soccer',
      color: Colors.error,
      providers: ['Bet9ja', 'SportyBet', 'Betway', '1xBet'],
    },
  ];

  useEffect(() => {
    loadBillCategories();
  }, []);

  const loadBillCategories = async () => {
    setLoading(true);
    try {
      // Load bill categories from API
      // await dispatch(fetchBillCategories()).unwrap();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to load bill categories',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  const handleProviderPress = (provider) => {
    navigation.navigate('BillPaymentDetail', {
      category: selectedCategory,
      provider,
    });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}>
      <View style={[styles.categoryIcon, { backgroundColor: `${item.color}20` }]}>
        <Icon name={item.icon} size={32} color={item.color} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProviderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.providerItem}
      onPress={() => handleProviderPress(item)}
      activeOpacity={0.7}>
      <View style={styles.providerIcon}>
        <Icon name="business" size={24} color={Colors.primary} />
      </View>
      <Text style={styles.providerName}>{item}</Text>
      <Icon name="chevron-right" size={24} color={Colors.textLight} />
    </TouchableOpacity>
  );

  if (selectedCategory) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Header
          title={selectedCategory.name}
          showBack={true}
          onBackPress={() => setSelectedCategory(null)}
        />

        <View style={styles.content}>
          <Input
            placeholder="Search providers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            icon="search"
            style={styles.searchInput}
          />

          <FlatList
            data={selectedCategory.providers}
            renderItem={renderProviderItem}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.providersList}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header title="Pay Bills" showBack={true} />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Select Bill Category</Text>
          <Text style={styles.sectionSubtitle}>
            Choose the type of bill you want to pay
          </Text>

          <FlatList
            data={billCategories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.categoriesGrid}
          />

          <Card style={styles.infoCard}>
            <Icon name="info" size={20} color={Colors.info} />
            <Text style={styles.infoText}>
              All bill payments are processed instantly and you'll receive confirmation via SMS and email
            </Text>
          </Card>
        </View>
      </ScrollView>

      <Loader visible={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: Spacing.lg,
  },
  categoriesGrid: {
    marginBottom: Spacing.lg,
  },
  categoryCard: {
    flex: 1,
    margin: Spacing.xs,
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    textAlign: 'center',
  },
  searchInput: {
    marginBottom: Spacing.md,
  },
  providersList: {
    paddingBottom: Spacing.lg,
  },
  providerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  providerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  providerName: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.infoLight,
    gap: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.info,
    lineHeight: 18,
  },
});

export default BillPaymentScreen;
