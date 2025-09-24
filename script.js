// Notification Center JavaScript
class NotificationCenter {
    constructor() {
        this.notifications = [];
        this.currentFilter = 'all';
        this.notificationToDelete = null;
        
        this.init();
    }
    
    getIconSvg(type) {
        switch (type) {
            case 'alert':
                return `<img src="images/icon 1.png" alt="Alert icon" width="80" height="80">`;
            case 'announcement':
                return `<img src="images/icon 2.png" alt="Announcement icon" width="80" height="80">`;
            case 'promotion':
                return `<img src="images/icon 3.png" alt="Promotion icon" width="80" height="80">`;
            default:
                return `<img src="images/icon 1.png" alt="Alert icon" width="80" height="80">`;
        }
    }
    
    init() {
        this.setupEventListeners();
        this.generateSampleNotifications();
        this.renderNotifications();
        this.updateCounts();
    }
    
    setupEventListeners() {
        // Filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchFilter(e.target.dataset.filter);
            });
        });
        
        // Back button
        const backButton = document.querySelector('.back-button');
        backButton.addEventListener('click', () => {
            // Handle back navigation
            console.log('Back button clicked');
        });
        
        // Action sheet events
        const actionSheetOverlay = document.getElementById('action-sheet-overlay');
        const cancelDelete = document.getElementById('cancel-delete');
        const confirmDelete = document.getElementById('confirm-delete');
        
        actionSheetOverlay.addEventListener('click', (e) => {
            if (e.target === actionSheetOverlay) {
                this.hideActionSheet();
            }
        });
        
        cancelDelete.addEventListener('click', () => {
            this.hideActionSheet();
        });
        
        confirmDelete.addEventListener('click', () => {
            this.deleteNotification(this.notificationToDelete);
            this.hideActionSheet();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideActionSheet();
            }
        });
    }
    
    generateSampleNotifications() {
        const sampleNotifications = [
            {
                id: 1,
                app: 'Khareef Promotion',
                title: 'Don\'t Miss Out!',
                message: 'Hurry! Just 4 days left redeem \'Khareef Coupon\' to win amazing prizes!',
                time: '28/08/2025 08:02 AM',
                isRead: false,
                type: 'promotion'
            },
            {
                id: 2,
                app: 'Al Maha Plus',
                title: 'Only on Al Maha Plus App',
                message: 'Avail up to 50% off on Consultation, Therapy and Psychology sessions at',
                time: '04/08/2025 09:31 AM',
                isRead: true,
                type: 'announcement'
            },
            {
                id: 3,
                app: 'OMR Promotion',
                title: 'OMR 500 Awaits You! 💸',
                message: 'Fuel up for OMR 5 or more and enter the draw for OMR 500! Redeem Khareef promotion coupon now!',
                time: '20/07/2025 10:55 AM',
                isRead: false,
                type: 'promotion'
            },
            {
                id: 4,
                app: 'Banking App',
                title: 'Transaction Alert',
                message: 'A payment of $89.99 has been processed for your subscription service.',
                time: '19/07/2025 02:15 PM',
                isRead: true,
                type: 'alert'
            },
            {
                id: 5,
                app: 'Weather Alert',
                title: 'Weather Update',
                message: 'Heavy rain expected this evening. Don\'t forget to bring an umbrella when going out!',
                time: '18/07/2025 06:30 AM',
                isRead: false,
                type: 'alert'
            },
            {
                id: 6,
                app: 'Social Media',
                title: 'New Follower',
                message: 'Sarah Johnson and 3 others started following you. Check out their profiles.',
                time: '17/07/2025 11:45 AM',
                isRead: true,
                type: 'announcement'
            }
        ];
        
        this.notifications = sampleNotifications;
    }
    
    switchFilter(filter) {
        this.currentFilter = filter;
        
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        // Render filtered notifications
        this.renderNotifications();
    }
    
    renderNotifications() {
        const notificationsList = document.getElementById('notifications-list');
        const emptyState = document.getElementById('empty-state');
        
        // Filter notifications based on current filter
        let filteredNotifications = this.notifications;
        
        switch (this.currentFilter) {
            case 'unread':
                filteredNotifications = this.notifications.filter(n => !n.isRead);
                break;
            case 'read':
                filteredNotifications = this.notifications.filter(n => n.isRead);
                break;
            default:
                filteredNotifications = this.notifications;
        }
        
        // Clear current notifications
        notificationsList.innerHTML = '';
        
        if (filteredNotifications.length === 0) {
            // Show empty state
            emptyState.style.display = 'flex';
            notificationsList.style.display = 'none';
        } else {
            // Show notifications
            emptyState.style.display = 'none';
            notificationsList.style.display = 'block';
            
            filteredNotifications.forEach((notification, index) => {
                const notificationElement = this.createNotificationElement(notification);
                notificationElement.style.animationDelay = `${index * 0.1}s`;
                notificationElement.classList.add('fade-in');
                notificationsList.appendChild(notificationElement);
            });
        }
    }
    
    createNotificationElement(notification) {
        const notificationItem = document.createElement('div');
        notificationItem.className = `notification-item ${notification.isRead ? 'read' : 'unread'}`;
        notificationItem.dataset.id = notification.id;
        
        // Add click handler to mark as read
        notificationItem.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-button')) {
                this.markAsRead(notification.id);
            }
        });
        
        const iconClass = this.getIconClass(notification.type);
        const iconSvg = this.getIconSvg(notification.type);
        
        notificationItem.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon-container">
                    <div class="notification-icon ${iconClass}">
                        ${iconSvg}
                    </div>
                    ${!notification.isRead ? '<div class="unread-indicator"></div>' : ''}
                </div>
                <div class="notification-details">
                    <div class="notification-header-info">
                        <span class="notification-app">${notification.app}</span>
                    </div>
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${notification.time}</div>
                </div>
                <div class="notification-actions">
                    <button class="delete-button" aria-label="Delete notification" data-id="${notification.id}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        // Add delete button event listener
        const deleteButton = notificationItem.querySelector('.delete-button');
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showDeleteConfirmation(notification.id);
        });
        
        return notificationItem;
    }
    
    getIconClass(type) {
        switch (type) {
            case 'alert':
                return 'alert-icon';
            case 'announcement':
                return 'announcement-icon';
            case 'promotion':
                return 'promotion-icon';
            default:
                return 'alert-icon';
        }
    }
    
    getIconSvg(type) {
        switch (type) {
            case 'alert':
                return `<img src="images/icon 1.png" alt="Alert icon" width="24" height="24">`;
            case 'announcement':
                return `<img src="images/icon 2.png" alt="Announcement icon" width="24" height="24">`;
            case 'promotion':
                return `<img src="images/icon 3.png" alt="Promotion icon" width="24" height="24">`;
            default:
                return `<img src="images/icon 1.png" alt="Alert icon" width="24" height="24">`;
        }
    }
    
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification && !notification.isRead) {
            notification.isRead = true;
            
            // Update the UI
            const notificationElement = document.querySelector(`[data-id="${notificationId}"]`);
            if (notificationElement) {
                notificationElement.classList.remove('unread');
                notificationElement.classList.add('read');
                
                // Remove unread indicator
                const unreadIndicator = notificationElement.querySelector('.unread-indicator');
                if (unreadIndicator) {
                    unreadIndicator.style.opacity = '0';
                    unreadIndicator.style.transform = 'scale(0)';
                    setTimeout(() => {
                        unreadIndicator.remove();
                    }, 200);
                }
            }
            
            this.updateCounts();
            
            // If we're viewing unread only, re-render to remove this notification
            if (this.currentFilter === 'unread') {
                setTimeout(() => {
                    this.renderNotifications();
                }, 300);
            }
        }
    }
    
    showDeleteConfirmation(notificationId) {
        this.notificationToDelete = notificationId;
        const actionSheet = document.getElementById('action-sheet-overlay');
        actionSheet.classList.add('show');
        
        // Focus management
        setTimeout(() => {
            document.getElementById('cancel-delete').focus();
        }, 100);
    }
    
    hideActionSheet() {
        const actionSheet = document.getElementById('action-sheet-overlay');
        actionSheet.classList.remove('show');
        this.notificationToDelete = null;
    }
    
    deleteNotification(notificationId) {
        if (!notificationId) return;
        
        const notificationElement = document.querySelector(`[data-id="${notificationId}"]`);
        
        if (notificationElement) {
            // Add removing animation
            notificationElement.classList.add('removing');
            
            setTimeout(() => {
                // Remove from data
                this.notifications = this.notifications.filter(n => n.id !== notificationId);
                
                // Re-render notifications
                this.renderNotifications();
                this.updateCounts();
                
                // Show feedback
                this.showToast('Notification deleted');
            }, 300);
        }
    }
    
    updateCounts() {
        const totalCount = this.notifications.length;
        const unreadCount = this.notifications.filter(n => !n.isRead).length;
        const readCount = this.notifications.filter(n => n.isRead).length;
        
        document.getElementById('all-count').textContent = totalCount;
        document.getElementById('unread-count').textContent = unreadCount;
        document.getElementById('read-count').textContent = readCount;
        
        // Hide count if zero
        document.querySelectorAll('.notification-count').forEach(countElement => {
            const count = parseInt(countElement.textContent);
            countElement.style.display = count > 0 ? 'flex' : 'none';
        });
    }
    
    showToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    // Method to add new notifications (for testing)
    addNotification(notification) {
        const newNotification = {
            ...notification,
            id: Date.now(),
            time: 'now',
            isRead: false
        };
        
        this.notifications.unshift(newNotification);
        this.renderNotifications();
        this.updateCounts();
        
        // Add new notification animation
        setTimeout(() => {
            const newElement = document.querySelector(`[data-id="${newNotification.id}"]`);
            if (newElement) {
                newElement.classList.add('new');
            }
        }, 100);
    }
}

// Initialize the notification center when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const notificationCenter = new NotificationCenter();
    
    // Make it available globally for testing
    window.notificationCenter = notificationCenter;
    
    // Add some test functions for demonstration
    window.addTestNotification = function() {
        notificationCenter.addNotification({
            app: 'Test App',
            title: 'Test Notification',
            message: 'This is a test notification to demonstrate the functionality.',
            type: 'app',
            icon: '🧪'
        });
    };
    
    // Handle visibility change (when app comes back into focus)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            notificationCenter.updateCounts();
        }
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationCenter;
}