import apiClient from './client';

class NotificationService {
  /**
   * Get all notifications
   * @param {Object} params - Query parameters (type, page, limit)
   * @returns {Promise<Object>}
   */
  getNotifications = async (params = {}) => {
    try {
      console.log('📬 Fetching notifications...');

      const response = await apiClient.get('/notifications', { params });

      if (response.data?.success) {
        // Handle paginated response - notifications are in data.data
        const notifications = response.data.data?.data || [];
        const paginationInfo = {
          current_page: response.data.data?.current_page,
          last_page: response.data.data?.last_page,
          per_page: response.data.data?.per_page,
          total: response.data.data?.total,
        };
        
        console.log('✅ Notifications fetched:', notifications.length);
        return {
          success: true,
          data: notifications,
          pagination: paginationInfo,
        };
      }

      return {
        success: false,
        message: response.data?.message || 'Failed to fetch notifications',
        data: [],
      };
    } catch (error) {
      console.error('❌ Get notifications error:', error.response?.data || error.message);
      
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred while fetching notifications',
        data: [],
      };
    }
  };

  /**
   * Get notification types
   * @returns {Promise<Object>}
   */
  getNotificationTypes = async () => {
    try {
      const response = await apiClient.get('/notifications/types');

      if (response.data?.success) {
        return {
          success: true,
          data: response.data.data,
        };
      }

      return {
        success: false,
        message: response.data?.message || 'Failed to fetch notification types',
      };
    } catch (error) {
      console.error('❌ Get notification types error:', error.response?.data || error.message);
      
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred',
      };
    }
  };

  /**
   * Get unread notification count
   * @returns {Promise<Object>}
   */
  getUnreadCount = async () => {
    try {
      const response = await apiClient.get('/notifications/unread-count');

      if (response.data?.success) {
        // API returns { success: true, data: { unread_count: 0 } }
        const count = response.data.data?.unread_count ?? 0;
        console.log('📊 Unread count from API:', count);
        return {
          success: true,
          count: count,
        };
      }

      // Fallback: If unread-count endpoint doesn't work, get from notifications
      console.log('⚠️ Unread count endpoint failed, calculating from notifications...');
      const notificationsResponse = await this.getNotifications();
      
      if (notificationsResponse.success) {
        const unreadCount = notificationsResponse.data.filter(n => !n.is_read).length;
        console.log('📊 Calculated unread count:', unreadCount);
        return {
          success: true,
          count: unreadCount,
        };
      }

      return {
        success: false,
        count: 0,
      };
    } catch (error) {
      console.error('❌ Get unread count error:', error.response?.data || error.message);
      
      // Fallback on error: calculate from notifications
      try {
        console.log('⚠️ Error in unread count, trying fallback...');
        const notificationsResponse = await this.getNotifications();
        
        if (notificationsResponse.success) {
          const unreadCount = notificationsResponse.data.filter(n => !n.is_read).length;
          console.log('📊 Fallback unread count:', unreadCount);
          return {
            success: true,
            count: unreadCount,
          };
        }
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
      }
      
      return {
        success: false,
        count: 0,
      };
    }
  };

  /**
   * Get single notification
   * @param {number} id - Notification ID
   * @returns {Promise<Object>}
   */
  getNotification = async (id) => {
    try {
      const response = await apiClient.get(`/notifications/${id}`);

      if (response.data?.success) {
        return {
          success: true,
          data: response.data.data,
        };
      }

      return {
        success: false,
        message: response.data?.message || 'Failed to fetch notification',
      };
    } catch (error) {
      console.error('❌ Get notification error:', error.response?.data || error.message);
      
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred',
      };
    }
  };

  /**
   * Mark notification as read
   * @param {number} id - Notification ID
   * @returns {Promise<Object>}
   */
  markAsRead = async (id) => {
    try {
      console.log('✅ Marking notification as read:', id);

      const response = await apiClient.post(`/notifications/${id}/mark-read`);

      if (response.data?.success) {
        return {
          success: true,
          message: response.data.message || 'Notification marked as read',
        };
      }

      return {
        success: false,
        message: response.data?.message || 'Failed to mark notification as read',
      };
    } catch (error) {
      console.error('❌ Mark as read error:', error.response?.data || error.message);
      
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred',
      };
    }
  };

  /**
   * Mark all notifications as read
   * @returns {Promise<Object>}
   */
  markAllAsRead = async () => {
    try {
      console.log('✅ Marking all notifications as read...');

      const response = await apiClient.post('/notifications/mark-all-read');

      if (response.data?.success) {
        return {
          success: true,
          message: response.data.message || 'All notifications marked as read',
        };
      }

      return {
        success: false,
        message: response.data?.message || 'Failed to mark all as read',
      };
    } catch (error) {
      console.error('❌ Mark all as read error:', error.response?.data || error.message);
      
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred',
      };
    }
  };

  /**
   * Delete notification
   * @param {number} id - Notification ID
   * @returns {Promise<Object>}
   */
  deleteNotification = async (id) => {
    try {
      console.log('🗑️ Deleting notification:', id);

      const response = await apiClient.delete(`/notifications/${id}`);

      if (response.data?.success) {
        return {
          success: true,
          message: response.data.message || 'Notification deleted',
        };
      }

      return {
        success: false,
        message: response.data?.message || 'Failed to delete notification',
      };
    } catch (error) {
      console.error('❌ Delete notification error:', error.response?.data || error.message);
      
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred',
      };
    }
  };

  /**
   * Clear all notifications
   * @returns {Promise<Object>}
   */
  clearAll = async () => {
    try {
      console.log('🗑️ Clearing all notifications...');

      const response = await apiClient.delete('/notifications/clear-all');

      if (response.data?.success) {
        return {
          success: true,
          message: response.data.message || 'All notifications cleared',
        };
      }

      return {
        success: false,
        message: response.data?.message || 'Failed to clear notifications',
      };
    } catch (error) {
      console.error('❌ Clear all error:', error.response?.data || error.message);
      
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred',
      };
    }
  };

  /**
   * Create notification (Admin only)
   * @param {Object} data - Notification data
   * @returns {Promise<Object>}
   */
  createNotification = async (data) => {
    try {
      console.log('📝 Creating notification...');

      const response = await apiClient.post('/notifications', data);

      if (response.data?.success) {
        return {
          success: true,
          message: response.data.message || 'Notification created',
          data: response.data.data,
        };
      }

      return {
        success: false,
        message: response.data?.message || 'Failed to create notification',
      };
    } catch (error) {
      console.error('❌ Create notification error:', error.response?.data || error.message);
      
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred',
      };
    }
  };
}

export default new NotificationService();