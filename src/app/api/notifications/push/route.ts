/**
 * Push Notification API Endpoint using Web Push
 * Sends browser push notifications to subscribed clients
 */

import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';

// Configure web-push with VAPID keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidEmail = process.env.VAPID_EMAIL || 'mailto:admin@radar-system.com';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    vapidEmail,
    vapidPublicKey,
    vapidPrivateKey
  );
}

// In-memory storage for push subscriptions (use DB in production)
const pushSubscriptions: PushSubscription[] = [];

export async function POST(request: NextRequest) {
  try {
    const { title, body, icon, badge, data, subscription } = await request.json();

    // Validate input
    if (!title || !body) {
      return NextResponse.json(
        { error: 'Missing required fields: title, body' },
        { status: 400 }
      );
    }

    // Check if Web Push is configured
    if (!vapidPublicKey || !vapidPrivateKey) {
      console.warn('Web Push not configured - Push will be simulated');
      
      // Simulate push notification in development
      console.log(`🔔 [SIMULATED PUSH NOTIFICATION]`);
      console.log(`Title: ${title}`);
      console.log(`Body: ${body}`);
      console.log(`Icon: ${icon || 'default'}`);
      
      return NextResponse.json({
        success: true,
        simulated: true,
        message: 'Push notification simulated (VAPID keys not configured)',
        sent: 0,
      });
    }

    // Get all subscriptions (from DB in production)
    const subscriptionsToSend = subscription ? [subscription] : pushSubscriptions;

    if (subscriptionsToSend.length === 0) {
      return NextResponse.json({
        success: true,
        sent: 0,
        message: 'No push subscriptions found',
      });
    }

    // Prepare notification payload
    const payload = JSON.stringify({
      title,
      body,
      icon: icon || '/icons/radar-alert.png',
      badge: badge || '/icons/badge.png',
      data: data || {},
      timestamp: Date.now(),
    });

    // Send push notifications to all subscriptions
    const results = await Promise.allSettled(
      subscriptionsToSend.map(sub =>
        webpush.sendNotification(sub as any, payload)
      )
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`🔔 Push notifications sent: ${successful} successful, ${failed} failed`);

    return NextResponse.json({
      success: true,
      simulated: false,
      sent: successful,
      failed: failed,
      total: subscriptionsToSend.length,
    });

  } catch (error: any) {
    console.error('Push Notification Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send push notification',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check push service status
export async function GET() {
  const isConfigured = !!(vapidPublicKey && vapidPrivateKey);
  
  return NextResponse.json({
    service: 'Web Push Notifications',
    configured: isConfigured,
    publicKey: vapidPublicKey ? `${vapidPublicKey.substring(0, 20)}...` : 'Not set',
    subscriptions: pushSubscriptions.length,
    message: isConfigured 
      ? 'Web Push is configured and ready' 
      : 'Web Push not configured - set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in .env. Generate keys using: npx web-push generate-vapid-keys',
  });
}

// Endpoint to register push subscriptions
export async function PUT(request: NextRequest) {
  try {
    const subscription = await request.json();

    // Validate subscription
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Invalid push subscription' },
        { status: 400 }
      );
    }

    // Check if subscription already exists
    const exists = pushSubscriptions.some(
      sub => (sub as any).endpoint === subscription.endpoint
    );

    if (!exists) {
      pushSubscriptions.push(subscription);
      console.log(`✅ Push subscription registered: ${subscription.endpoint}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Push subscription registered',
      total: pushSubscriptions.length,
    });

  } catch (error: any) {
    console.error('Push subscription error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to register push subscription',
      },
      { status: 500 }
    );
  }
}

// Endpoint to unregister push subscriptions
export async function DELETE(request: NextRequest) {
  try {
    const { endpoint } = await request.json();

    const index = pushSubscriptions.findIndex(
      sub => (sub as any).endpoint === endpoint
    );

    if (index !== -1) {
      pushSubscriptions.splice(index, 1);
      console.log(`✅ Push subscription removed: ${endpoint}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Push subscription removed',
      total: pushSubscriptions.length,
    });

  } catch (error: any) {
    console.error('Push unsubscription error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to remove push subscription',
      },
      { status: 500 }
    );
  }
}
