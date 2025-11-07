import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';

import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { Colors, Gradients } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing, BorderRadius } from '../../styles/spacing';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - Spacing.lg * 2;

const CardsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showActionDialog, setShowActionDialog] = useState(false);

  // Mock data - replace with actual API call
  const mockCards = [
    {
      id: '1',
      type: 'physical',
      cardNumber: '5399 8312 4567 8901',
      cardHolder: 'JOHN DOE',
      expiryDate: '12/25',
      cvv: '123',
      brand: 'Mastercard',
      status: 'active',
      balance: 50000,
    },
    {
      id: '2',
      type: 'virtual',
      cardNumber: '4532 1234 5678 9012',
      cardHolder: 'JOHN DOE',
      expiryDate: '08/24',
      cvv: '456',
      brand: 'Visa',
      status: 'active',
      balance: 25000,
    },
  ];

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setLoading(true);
    try {
      // Load cards from API
      // const result = await dispatch(fetchCards()).unwrap();
      setCards(mockCards);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to load cards',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCardPress = (card) => {
    setSelectedCard(card);
    setShowActionDialog(true);
  };

  const handleBlockCard = async () => {
    setShowActionDialog(false);
    setLoading(true);

    try {
      // Block card API call
      // await dispatch(blockCard(selectedCard.id)).unwrap();
      
      Toast.show({
        type: 'success',
        text1: 'Card Blocked',
        text2: 'Your card has been blocked successfully',
      });
      
      loadCards();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to block card',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCard = () => {
    navigation.navigate('RequestCard');
  };

  const getCardGradient = (brand) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return ['#1A1F71', '#2A3F9E'];
      case 'mastercard':
        return ['#EB001B', '#F79E1B'];
      default:
        return Gradients.primary;
    }
  };

  const renderCardItem = ({ item, index }) => (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 100}
      duration={600}
      style={styles.cardContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleCardPress(item)}>
        <LinearGradient
          colors={getCardGradient(item.brand)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.creditCard}>
          
          {/* Card Type Badge */}
          <View style={styles.cardTypeBadge}>
            <Text style={styles.cardTypeText}>
              {item.type === 'virtual' ? 'Virtual' : 'Physical'}
            </Text>
          </View>

          {/* Card Chip */}
          <View style={styles.cardChip}>
            <Icon name="credit-card" size={32} color={Colors.white} />
          </View>

          {/* Card Number */}
          <Text style={styles.cardNumber}>{item.cardNumber}</Text>

          {/* Card Details */}
          <View style={styles.cardDetails}>
            <View>
              <Text style={styles.cardLabel}>CARD HOLDER</Text>
              <Text style={styles.cardValue}>{item.cardHolder}</Text>
            </View>
            <View>
              <Text style={styles.cardLabel}>EXPIRES</Text>
              <Text style={styles.cardValue}>{item.expiryDate}</Text>
            </View>
          </View>

          {/* Card Brand */}
          <View style={styles.cardBrand}>
            <Text style={styles.brandText}>{item.brand}</Text>
          </View>

          {/* Card Status */}
          {item.status !== 'active' && (
            <View style={styles.cardStatusOverlay}>
              <Text style={styles.cardStatusText}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          )}

          {/* Decorative circles */}
          <View style={styles.cardCircle1} />
          <View style={styles.cardCircle2} />
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );

  const cardActions = [
    { id: 'view', label: 'View Details', icon: 'visibility' },
    { id: 'transactions', label: 'View Transactions', icon: 'receipt' },
    { id: 'block', label: 'Block Card', icon: 'block', color: Colors.error },
    { id: 'settings', label: 'Card Settings', icon: 'settings' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header 
        title="My Cards" 
        rightComponent={
          <TouchableOpacity onPress={handleRequestCard}>
            <Icon name="add-circle" size={28} color={Colors.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.scrollView}>
        {cards.length > 0 ? (
          <FlatList
            data={cards}
            renderItem={renderCardItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.cardsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Icon name="credit-card-off" size={80} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No Cards Yet</Text>
            <Text style={styles.emptySubtitle}>
              Request a virtual or physical card to start making payments
            </Text>
            <Button
              title="Request Card"
              onPress={handleRequestCard}
              gradient
              icon="add"
              style={styles.requestButton}
            />
          </View>
        )}

        {/* Features Section */}
        {cards.length > 0 && (
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Card Features</Text>
            <Card style={styles.featureCard}>
              <Icon name="security" size={24} color={Colors.success} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Secure Transactions</Text>
                <Text style={styles.featureDescription}>
                  3D Secure protection for all online payments
                </Text>
              </View>
            </Card>
            <Card style={styles.featureCard}>
              <Icon name="lock" size={24} color={Colors.primary} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Instant Lock/Unlock</Text>
                <Text style={styles.featureDescription}>
                  Control your card security with one tap
                </Text>
              </View>
            </Card>
            <Card style={styles.featureCard}>
              <Icon name="trending-up" size={24} color={Colors.warning} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Spending Insights</Text>
                <Text style={styles.featureDescription}>
                  Track and manage your card spending
                </Text>
              </View>
            </Card>
          </View>
        )}
      </ScrollView>

      {/* Action Dialog */}
      <Alert
        visible={showActionDialog}
        type="info"
        title="Card Actions"
        message="Choose an action for this card"
        confirmText="Close"
        onClose={() => setShowActionDialog(false)}
        onConfirm={() => setShowActionDialog(false)}
      />

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
  cardsList: {
    padding: Spacing.lg,
  },
  cardContainer: {
    marginBottom: Spacing.lg,
  },
  creditCard: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  cardTypeBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  cardTypeText: {
    fontSize: 10,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
    textTransform: 'uppercase',
  },
  cardChip: {
    marginBottom: Spacing.lg,
  },
  cardNumber: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.white,
    letterSpacing: 2,
    marginBottom: Spacing.lg,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 9,
    fontFamily: Fonts.regular,
    color: Colors.white,
    opacity: 0.7,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
  },
  cardBrand: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
  },
  brandText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  cardStatusOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardStatusText: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  cardCircle1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -30,
    right: -30,
  },
  cardCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -20,
    left: -20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl * 2,
    marginTop: Spacing.xl * 3,
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
  requestButton: {
    minWidth: 200,
  },
  featuresSection: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    lineHeight: 16,
  },
});

export default CardsScreen;
