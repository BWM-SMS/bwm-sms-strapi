const webpush = require('web-push');

function initNotification() {
  const email = `mailto:${process.env.VAPID_EMAIL}`;
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!email || !publicKey || !privateKey) {
    throw new Error('VAPID keys and email must be set in environment variables');
  }

  webpush.setVapidDetails(email, publicKey, privateKey);
}

function pushNotification(subscription: any, title: string, body: string) {
  const payload = JSON.stringify({ notification: { title, body } });
  webpush.sendNotification(subscription, payload).catch((error: any) => {
    console.error('Error sending notification:', error);
  });
}

const Notification = {
  initNotification,
  pushNotification
};

export { Notification };
