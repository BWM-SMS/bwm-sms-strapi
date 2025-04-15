import type { Core } from '@strapi/strapi';
import lifecycles from './extensions/users-permissions/content-types/user/lifecycles';
import { Encryption } from './utils/encryption';
import { Notification } from './utils/notification';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Add the lifecycle hooks to the user model
    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],
      ...lifecycles,
    });

    // Init Encryption model
    // Encryption.initEncryption()

    // Init Notification model
     Notification.initNotification()
  },
};
