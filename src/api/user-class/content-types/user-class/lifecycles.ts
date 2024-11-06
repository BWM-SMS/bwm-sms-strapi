/**
 * https://docs.strapi.io/dev-docs/backend-customization/models#available-lifecycle-events
 */

export default {
    async beforeUpdate(event) {
        const { data, where, select, populate } = event.params;

        // Set the editedBy field to the current user
        const ctx = strapi.requestContext.get();
        data.editedBy =  ctx.state.user.id;
    }
};