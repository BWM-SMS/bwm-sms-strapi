/**
 * A set of functions called "actions" for `class-cadre`
 */

import { sanitize, validate } from '@strapi/utils';


export default {
  myProfile: async (ctx, next) => {
    // Take the current user attandance based on time
    try {
      const user = ctx.state.user;

      if (!user) {
        return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
      }

      const data = await strapi
        .service("api::bwm-custom.bwm-custom")
        .myProfileService(ctx);

        // TODO: Sanitize the data to exclude password
      ctx.body = data
    } catch (err) {
      ctx.body = err;
    }
  },
};
