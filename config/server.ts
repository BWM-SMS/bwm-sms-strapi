export default ({ env }) => ({
  host: env('HOST', '192.168.23.3'), /*previously the IP was 0.0.0.0*/ 
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
