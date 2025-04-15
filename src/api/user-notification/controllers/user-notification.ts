/**
 * A set of functions called "actions" for `class-cadre`
 */

export default {
  notifyClassStartSoon: async (ctx, next) => {
    // Notify the user about the class start soon
    try {
      const data = await strapi
        .service("api::user-notification.user-notification")
        .notifyClassStartSoonService();

      ctx.body = data;
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = { message: err.message || 'An unexpected error occurred' };
    }
  },
 
};
