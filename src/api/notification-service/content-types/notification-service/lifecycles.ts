import { Notification } from '../../../../utils/notification';

/**
 * https://docs.strapi.io/dev-docs/backend-customization/models#available-lifecycle-events
 */
export default {
  async afterCreate(event) {
    const { result } = event;
    Notification.pushNotification(result.payload, 'Notification', 'Successfully Subscribed to Notification');
  }
};
