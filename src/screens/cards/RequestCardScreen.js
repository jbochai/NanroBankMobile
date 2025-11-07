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
import Toast from 'react-native-toast-message';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const RequestCardScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState('pickup');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: '',
      city: '',
      state: '',
      phone: '',
    },
  });

  const cardTypes = [
    {
      id: 1,
      type: 'virtual',
      name: 'Virtual Card',
      description: 'Instant digital card for online payments',
      fee: 'Free',
      features: ['Instant activation', 'Online payments only', 'No physical card'],
      icon: 'credit-card',
      color: '#2196f3',
    },
    {
      id: 2,
      type: 'debit',
      name: 'Debit Card',
      description: 'Physical Visa/Mastercard for all transactions',
      fee: '₦1,000',
      features: ['ATM withdrawals', 'POS payments', 'Online payments', '7-14 days delivery'],
      icon: 'payment',
      color: Colors.primary,
    },
    {
      id: 3,
      type: 'premium',
      name: 'Premium Card',
      description: 'Premium card with exclusive benefits',
      fee: '₦5,000',
      features: ['Higher limits', 'Airport lounge access', 'Cashback rewards', '5-7 days delivery'],
      icon: 'workspace-premium',
      color: '#ff9800',
    },
  ];

  const deliveryOptions = [
    {
      id: 'pickup',
      title: 'Branch Pickup',
      description: 'Collect from nearest branch',
      fee: 'Free',
      icon: 'store',
    },
    {
      id: 'delivery',
      title: 'Home Delivery',
      description: 'Delivered to your address',
      fee: '₦500',
      icon: 'local-shipping',
    },
  ];

  const onSubmit = async (data) => {
    if (!selectedCardType) {
      Toast.show({
        type: 'error',
        text1: 'Card Type Required',
        text2: 'Please select a card type',
      });
      return;
    }

    if (selectedCardType.type !== 'virtual' && selectedDelivery === 'delivery') {
      if (!data.address || !data.city || !data.state) {
        Toast.show({
          type: 'error',
          text1: 'Address Required',
          text2: 'Please provide delivery address',
        });
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Card Request Submitted',
        text2: selectedCardType.type === 'virtual' 
          ? 'Your virtual card is ready!' 
          : 'We will process your request within 24 hours',
      });
      navigation.goBack();
    }, 2000);
  };

  const renderCardType = (card) => (
    <TouchableOpacity
      key={card.id}
      style={[
        styles.cardTypeCard,
        selectedCardType?.id === card.id && styles.cardTypeCardSelected,
      ]}
      onPress={() => setSelectedCardType(card)}>
      <View style={[styles.cardTypeIcon, { backgroundColor: card.color + '20' }]}>
        <Icon name={card.icon} size={32} color={card.color} />
      </View>
      <Text style={styles.cardTypeName}>{card.name}</Text>
      <Text style={styles.cardTypeDescription}>{card.description}</Text>
      <View style={styles.cardTypeFee}>
        <Text style={styles.cardTypeFeeText}>{card.fee}</Text>
      </View>
      <View style={styles.cardTypeFeatures}>
        {card.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Icon name="check" size={14} color={Colors.success} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
      {selectedCardType?.id === card.id && (
        <View style={styles.selectedBadge}>
          <Icon name="check-circle" size={24} color={Colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderDeliveryOption = (option) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.deliveryCard,
        selectedDelivery === option.id && styles.deliveryCardSelected,
      ]}
      onPress={() => setSelectedDelivery(option.id)}>
      <View style={styles.deliveryLeft}>
        <Icon 
          name={option.icon} 
          size={24} 
          color={selectedDelivery === option.id ? Colors.primary : Colors.textLight} 
        />
        <View style={styles.deliveryContent}>
          <Text style={[
            styles.deliveryTitle,
            selectedDelivery === option.id && styles.deliveryTitleSelected,
          ]}>
            {option.title}
          </Text>
          <Text style={styles.deliveryDescription}>{option.description}</Text>
        </View>
      </View>
      <View style={styles.deliveryFee}>
        <Text style={[
          styles.deliveryFeeText,
          selectedDelivery === option.id && styles.deliveryFeeTextSelected,
        ]}>
          {option.fee}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Card</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.infoCard}>
          <Icon name="info" size={24} color={Colors.primary} />
          <Text style={styles.infoText}>
            Choose the card that best suits your needs. All cards come with secure 
            chip technology and fraud protection.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Card Type</Text>
          <View style={styles.cardsGrid}>
            {cardTypes.map(renderCardType)}
          </View>
        </View>

        {selectedCardType && selectedCardType.type !== 'virtual' && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Delivery Method</Text>
              {deliveryOptions.map(renderDeliveryOption)}
            </View>

            {selectedDelivery === 'delivery' && (
              <View style={styles.form}>
                <Text style={styles.formTitle}>Delivery Address</Text>
                
                <Controller
                  control={control}
                  name="address"
                  rules={{ required: 'Address is required' }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Street Address"
                      placeholder="Enter your street address"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.address?.message}
                      leftIcon="location-on"
                    />
                  )}
                />

                <View style={styles.formRow}>
                  <View style={styles.formHalf}>
                    <Controller
                      control={control}
                      name="city"
                      rules={{ required: 'City is required' }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          label="City"
                          placeholder="City"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          error={errors.city?.message}
                          leftIcon="location-city"
                        />
                      )}
                    />
                  </View>

                  <View style={styles.formHalf}>
                    <Controller
                      control={control}
                      name="state"
                      rules={{ required: 'State is required' }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          label="State"
                          placeholder="State"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          error={errors.state?.message}
                          leftIcon="map"
                        />
                      )}
                    />
                  </View>
                </View>

                <Controller
                  control={control}
                  name="phone"
                  rules={{ required: 'Phone number is required' }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Phone Number"
                      placeholder="Enter phone number"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.phone?.message}
                      keyboardType="phone-pad"
                      leftIcon="phone"
                    />
                  )}
                />
              </View>
            )}
          </>
        )}

        {selectedCardType && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Card Type</Text>
              <Text style={styles.summaryValue}>{selectedCardType.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Card Fee</Text>
              <Text style={styles.summaryValue}>{selectedCardType.fee}</Text>
            </View>
            {selectedCardType.type !== 'virtual' && (
              <>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery</Text>
                  <Text style={styles.summaryValue}>
                    {deliveryOptions.find(d => d.id === selectedDelivery)?.title}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery Fee</Text>
                  <Text style={styles.summaryValue}>
                    {deliveryOptions.find(d => d.id === selectedDelivery)?.fee}
                  </Text>
                </View>
              </>
            )}
            <View style={[styles.summaryRow, styles.summaryTotal]}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>
                {selectedCardType.type === 'virtual' 
                  ? 'Free' 
                  : `₦${
                    (parseInt(selectedCardType.fee.replace(/[^0-9]/g, '')) || 0) +
                    (selectedDelivery === 'delivery' ? 500 : 0)
                  }`
                }
              </Text>
            </View>
          </View>
        )}

        <Button
          title={selectedCardType?.type === 'virtual' ? 'Get Virtual Card' : 'Request Card'}
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={!selectedCardType}
          style={styles.submitButton}
        />
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
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardTypeCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  cardTypeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  cardTypeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTypeName: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  cardTypeDescription: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
  },
  cardTypeFee: {
    backgroundColor: Colors.successLight,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: Spacing.sm,
  },
  cardTypeFeeText: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.success,
  },
  cardTypeFeatures: {
    marginTop: Spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginLeft: Spacing.xs,
  },
  selectedBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },
  deliveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  deliveryCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  deliveryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deliveryContent: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 2,
  },
  deliveryTitleSelected: {
    color: Colors.primary,
  },
  deliveryDescription: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  deliveryFee: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deliveryFeeText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: Colors.success,
  },
  deliveryFeeTextSelected: {
    color: Colors.primary,
  },
  form: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  formTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formHalf: {
    width: '48%',
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  summaryValue: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
  },
  summaryTotalLabel: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  summaryTotalValue: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  submitButton: {
    marginBottom: Spacing.md,
  },
});

export default RequestCardScreen;