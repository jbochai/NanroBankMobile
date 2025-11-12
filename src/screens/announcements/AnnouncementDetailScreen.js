import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const AnnouncementDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Sample announcement data - in real app, this would come from route params or API
  const announcement = route.params?.announcement || {
    id: 1,
    title: 'New Feature: Instant Virtual Cards',
    category: 'Feature Update',
    date: '2024-11-25',
    author: 'Nanro Bank',
    image: null,
    content: `We're excited to announce the launch of Instant Virtual Cards! This new feature allows you to create virtual debit cards instantly for secure online transactions.

Key Features:
- Instant card generation
- Enhanced security for online payments
- Easy card management
- No additional fees

How to Get Started:
1. Open the Nanro Bank app
2. Navigate to Cards section
3. Tap on "Request Card"
4. Select "Virtual Card"
5. Your card is ready to use!

Security Benefits:
Virtual cards provide an extra layer of security for your online transactions. Each card has a unique number that can be frozen or deleted at any time, protecting your primary account details.

Thank you for being a valued Nanro Bank customer. We're committed to providing you with innovative banking solutions that make your financial life easier and more secure.`,
    tags: ['Cards', 'Virtual Cards', 'Security', 'Online Payments'],
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${announcement.title}\n\nRead more on Nanro Bank app`,
        title: announcement.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const relatedAnnouncements = [
    {
      id: 2,
      title: 'Enhanced Security Features',
      date: '2024-11-20',
      category: 'Security',
    },
    {
      id: 3,
      title: 'New Bill Payment Partners',
      date: '2024-11-15',
      category: 'Feature Update',
    },
    {
      id: 4,
      title: 'Holiday Banking Hours',
      date: '2024-11-10',
      category: 'Announcement',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Announcement</Text>
        <TouchableOpacity onPress={handleShare}>
          <Icon name="share" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.categoryBadge}>
          <Icon name="campaign" size={16} color={Colors.primary} />
          <Text style={styles.categoryText}>{announcement.category}</Text>
        </View>

        <Text style={styles.title}>{announcement.title}</Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Icon name="person" size={16} color={Colors.textLight} />
            <Text style={styles.metaText}>{announcement.author}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="calendar-today" size={16} color={Colors.textLight} />
            <Text style={styles.metaText}>
              {new Date(announcement.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        </View>

        {announcement.image && (
          <Image
            source={{ uri: announcement.image }}
            style={styles.featuredImage}
            resizeMode="cover"
          />
        )}

        <View style={styles.contentCard}>
          <Text style={styles.content}>{announcement.content}</Text>
        </View>

        {announcement.tags && announcement.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            <Text style={styles.tagsTitle}>Tags:</Text>
            <View style={styles.tagsWrapper}>
              {announcement.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="bookmark-border" size={24} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Icon name="share" size={24} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="print" size={24} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Print</Text>
          </TouchableOpacity>
        </View>

        {relatedAnnouncements.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>Related Announcements</Text>
            {relatedAnnouncements.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.relatedCard}
                onPress={() => navigation.push('AnnouncementDetail', { announcement: item })}>
                <View style={styles.relatedContent}>
                  <Text style={styles.relatedItemTitle}>{item.title}</Text>
                  <View style={styles.relatedMeta}>
                    <Text style={styles.relatedCategory}>{item.category}</Text>
                    <Text style={styles.relatedDate}>
                      {new Date(item.date).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={24} color={Colors.textLight} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.feedbackCard}>
          <Icon name="feedback" size={24} color={Colors.primary} />
          <View style={styles.feedbackContent}>
            <Text style={styles.feedbackTitle}>Was this helpful?</Text>
            <View style={styles.feedbackButtons}>
              <TouchableOpacity style={styles.feedbackButton}>
                <Icon name="thumb-up" size={20} color={Colors.success} />
                <Text style={styles.feedbackButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.feedbackButton}>
                <Icon name="thumb-down" size={20} color={Colors.error} />
                <Text style={styles.feedbackButtonText}>No</Text>
              </TouchableOpacity>
            </View>
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
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
    marginBottom: Spacing.md,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
    marginLeft: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    lineHeight: 32,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  metaText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginLeft: 4,
  },
  featuredImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: Spacing.lg,
  },
  contentCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  content: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: Colors.text,
    lineHeight: 24,
  },
  tagsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  tagsTitle: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  tagText: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  actionsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginTop: 4,
  },
  relatedSection: {
    marginBottom: Spacing.lg,
  },
  relatedTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  relatedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  relatedContent: {
    flex: 1,
  },
  relatedItemTitle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: 4,
  },
  relatedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  relatedCategory: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.primary,
    marginRight: Spacing.sm,
  },
  relatedDate: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  feedbackCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: Spacing.md,
  },
  feedbackContent: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  feedbackTitle: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  feedbackButtons: {
    flexDirection: 'row',
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    marginRight: Spacing.sm,
  },
  feedbackButtonText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginLeft: 4,
  },
});

export default AnnouncementDetailScreen;