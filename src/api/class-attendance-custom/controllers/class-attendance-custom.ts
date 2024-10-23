/**
 * A set of functions called "actions" for `class-custom`
 */

export default {
  recurring: async (ctx, next) => {
    try {
      const data = await strapi
        .service("api::class-attendance-custom.class-attendance-custom")
        .recurringService();

      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  }
};
