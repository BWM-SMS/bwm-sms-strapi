/**
 * A set of functions called "actions" for `class-custom`
 */

export default {
  exampleAction: async (ctx, next) => {
    try {
      // Custom logic here
      // const data = await strapi.db.query('api::class.class').findMany();
      const data = await strapi
        .service("api::class-custom.class-custom")
        .findAllBlogs(ctx);
      // console.log("Data", data);
      // ctx.body = ctx.state.user;

      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  }
};
