// RADAR Multi-Channel Alert System - Service Worker
// Handles push notifications even when browser is closed

self.addEventListener('install', function(event) {
  console.log('✅ Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('✅ Service Worker activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function(event) {
  console.log('📨 Push notification received');

  if (!event.data) {
    console.log('No data in push event');
    return;
  }

  try {
    const data = event.data.json();
    console.log('Push data:', data);

    // Determine icon and color based on severity
    const severityConfig = {
      GREEN: { icon: '✅', color: '#22c55e', requireInteraction: false },
      YELLOW: { icon: '⚠️', color: '#eab308', requireInteraction: false },
      ORANGE: { icon: '🟠', color: '#f97316', requireInteraction: true },
      RED: { icon: '🚨', color: '#ef4444', requireInteraction: true },
    };

    const config = severityConfig[data.severity] || severityConfig.YELLOW;

    const options = {
      body: data.body || data.message || 'RADAR Alert: Vital signs require attention',
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [200, 100, 200, 100, 200],
      tag: `radar-alert-${data.severity}`,
      requireInteraction: config.requireInteraction,
      data: {
        url: '/dashboard',
        severity: data.severity,
        timestamp: data.timestamp || Date.now(),
        patientId: data.patientId,
      },
      actions: [
        {
          action: 'view',
          title: '👁️ View Dashboard',
          icon: '/icons/view.png'
        },
        {
          action: 'acknowledge',
          title: '✅ Acknowledge',
          icon: '/icons/check.png'
        }
      ]
    };

    // Add RED alert specific actions
    if (data.severity === 'RED') {
      options.actions.push({
        action: 'call',
        title: '📞 Call Emergency',
        icon: '/icons/phone.png'
      });
    }

    event.waitUntil(
      self.registration.showNotification(
        data.title || `${config.icon} RADAR ${data.severity} Alert`,
        options
      )
    );

  } catch (error) {
    console.error('Error processing push notification:', error);
    
    // Fallback notification
    event.waitUntil(
      self.registration.showNotification('RADAR Alert', {
        body: 'A new alert has been received',
        icon: '/icon-192x192.png',
        tag: 'radar-fallback'
      })
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'view') {
    // Open dashboard
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(function(clientList) {
          // Check if dashboard is already open
          for (let client of clientList) {
            if (client.url.includes('/dashboard') && 'focus' in client) {
              return client.focus();
            }
          }
          
          // Open new dashboard window
          if (clients.openWindow) {
            return clients.openWindow('/dashboard');
          }
        })
    );

  } else if (event.action === 'acknowledge') {
    // Send acknowledgment to server
    event.waitUntil(
      fetch('/api/notifications/acknowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationId: event.notification.tag,
          timestamp: Date.now(),
          action: 'acknowledged'
        })
      })
      .then(response => {
        console.log('Acknowledgment sent');
      })
      .catch(error => {
        console.error('Failed to send acknowledgment:', error);
      })
    );

  } else if (event.action === 'call') {
    // Open dialer with emergency number
    event.waitUntil(
      clients.openWindow('tel:911')
    );

  } else {
    // Default action: open dashboard
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

self.addEventListener('notificationclose', function(event) {
  console.log('Notification closed:', event.notification.tag);
  
  // Track notification dismissal
  fetch('/api/notifications/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      notificationId: event.notification.tag,
      action: 'dismissed',
      timestamp: Date.now()
    })
  }).catch(error => {
    console.error('Failed to track notification dismissal:', error);
  });
});

// Handle background sync for offline scenarios
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-alerts') {
    event.waitUntil(
      fetch('/api/notifications/sync')
        .then(response => response.json())
        .then(data => {
          console.log('Alerts synced:', data);
        })
        .catch(error => {
          console.error('Failed to sync alerts:', error);
        })
    );
  }
});

// Handle messages from main thread
self.addEventListener('message', function(event) {
  console.log('Service worker received message:', event.data);

  if (event.data && event.data.type === 'TEST_NOTIFICATION') {
    // Show test notification
    self.registration.showNotification('RADAR Test Alert', {
      body: 'This is a test notification from RADAR',
      icon: '/icon-192x192.png',
      tag: 'radar-test'
    });
  }
});

console.log('🚀 RADAR Service Worker loaded');
