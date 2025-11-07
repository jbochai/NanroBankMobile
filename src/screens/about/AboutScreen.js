import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const AboutScreen = () => {
  const navigation = useNavigation();

  const appVersion = '1.0.0';
  const buildNumber = '100';

  const features = [
    {
      icon: 'account-balance',
      title: 'Secure Banking',
      description: 'Bank-grade security with 256-bit encryption',
    },
    {
      icon: 'flash-on',
      title: 'Instant Transfers',
      description: 'Send and receive money in seconds',
    },
    {
      icon: 'receipt',
      title: 'Bill Payments',
      description: 'Pay all your bills in one place',
    },
    {
      icon: 'savings',
      title: 'Smart Savings',
      description: 'Automated savings and investments',
    },
  ];

  const socialLinks = [
    {
      id: 1,
      name: 'Facebook',
      icon: 'facebook',
      url: 'https://facebook.com/nanrobank',
      color: '#1877f2',
    },
    {
      id: 2,
      name: 'Twitter',
      icon: 'alternate-email',
      url: 'https://twitter.com/nanrobank',
      color: '#1da1f2',
    },
    {
      id: 3,
      name: 'Instagram',
      icon: 'camera-alt',
      url: 'https://instagram.com/nanrobank',
      color: '#e4405f',
    },
    {
      id: 4,
      name: 'LinkedIn',
      icon: 'business',
      url: 'https://linkedin.com/company/nanrobank',
      color: '#0077b5',
    },
  ];

  const legalLinks = [
    { title: 'Terms of Service', url: 'https://nanrobank.com/terms' },
    { title: 'Privacy Policy', url: 'https://nanrobank.com/privacy' },
    { title: 'Cookie Policy', url: 'https://nanrobank.com/cookies' },
    { title: 'Licenses', screen: null },
  ];

  const renderFeature = (feature, index) => (
    <View key={index} style={styles.featureCard}>
      <View style={styles.featureIcon}>
        <Icon name={feature.icon} size={28} color={Colors.primary} />
      </View>
      <Text style={styles.featureTitle}>{feature.title}</Text>
      <Text style={styles.featureDescription}>{feature.description}</Text>
    </View>
  );

  const renderSocialLink = (link) => (
    <TouchableOpacity
      key={link.id}
      style={[styles.socialButton, { backgroundColor: link.color }]}
      onPress={() => Linking.openURL(link.url)}>
      <Icon name={link.icon} size={24} color={Colors.white} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.logoSection}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Nanro Bank</Text>
          <Text style={styles.tagline}>Your Financial Partner</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>Version {appVersion} ({buildNumber})</Text>
          </View>
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>About Nanro Bank</Text>
          <Text style={styles.aboutText}>
            Nanro Bank is a leading digital banking platform in Nigeria, providing 
            secure, fast, and convenient financial services to millions of customers. 
            Our mission is to make banking accessible to everyone, anywhere, anytime.
            {'\n\n'}
            With cutting-edge technology and a customer-first approach, we're 
            revolutionizing the way Nigerians bank, save, invest, and manage their finances.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featuresGrid}>
            {features.map(renderFeature)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connect With Us</Text>
          <View style={styles.socialLinks}>
            {socialLinks.map(renderSocialLink)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.legalLinks}>
            {legalLinks.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={styles.legalLink}
                onPress={() => {
                  if (link.url) {
                    Linking.openURL(link.url);
                  } else if (link.screen) {
                    navigation.navigate(link.screen);
                  }
                }}>
                <Text style={styles.legalLinkText}>{link.title}</Text>
                <Icon name="chevron-right" size={20} color={Colors.textLight} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.contactCard}>
          <Icon name="support-agent" size={24} color={Colors.primary} />
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>Need Help?</Text>
            <Text style={styles.contactText}>
              Email: support@nanrobank.com{'\n'}
              Phone: +234 800 123 4567
            </Text>
          </View>
        </View>

        <View style={styles.licenseCard}>
          <Icon name="verified" size={20} color={Colors.success} />
          <Text style={styles.licenseText}>
            Licensed by the Central Bank of Nigeria (CBN){'\n'}
            License No: CBN/MMB/2024/001
          </Text>
        </View>

        <Text style={styles.copyright}>
          © 2024 Nanro Bank. All rights reserved.{'\n'}
          Powered by Starcode Technology
        </Text>
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
  logoSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: Spacing.lg,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: Spacing.md,
  },
  appName: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: Spacing.md,
  },
  versionBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
  },
  versionText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  aboutCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  aboutTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  aboutText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    lineHeight: 22,
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
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  featureTitle: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 16,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    margin: Spacing.xs,
  },
  legalLinks: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  legalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  legalLinkText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
  contactCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  contactContent: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  contactTitle: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 4,
  },
  contactText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    lineHeight: 18,
  },
  licenseCard: {
    flexDirection: 'row',
    backgroundColor: Colors.successLight,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  licenseText: {
    flex: 1,
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.text,
    marginLeft: Spacing.sm,
    lineHeight: 16,
  },
  copyright: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default AboutScreen;