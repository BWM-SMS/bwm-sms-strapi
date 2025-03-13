/**
 * A set of functions called "actions" for `class-custom`
 */

export default {
  myClass: async (ctx, next) => {
    try {
      const user = ctx.state.user;
      
      if (!user) {
        return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
      }

      const data = await strapi
        .service("api::class-custom.class-custom")
        .myClassService(ctx);

      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  },
};
