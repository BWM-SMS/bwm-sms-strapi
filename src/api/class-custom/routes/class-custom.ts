export default {
  routes: [
    {
     method: 'GET',
     path: '/class-custom',
     handler: 'class-custom.exampleAction',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
