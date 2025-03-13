export default ({ env }) => ({
    'strapi-import-export': {
        enabled: true,
        config: {
            // See `Config` section.
        },
    },
    'upload': {
        enabled: true,
        config: {
            provider: 'local',
            sizeLimit: 10000000, // Set size limit for uploads (in bytes), Max 3 MB
            actionOptions: {
                upload: {
                    // Restrict file types to photos only
                    mimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
                },
                delete: {},
            },
        },
    },
    'email': {
        enabled: true,
        config: {
            provider: 'nodemailer',
            providerOptions: {
                host: env('SMTP_HOST', 'smtp.example.com'), // SMTP server host
                port: env.int('SMTP_PORT', 587),            // SMTP server port
                auth: {
                    user: env('SMTP_USERNAME'),               // Your email username
                    pass: env('SMTP_PASSWORD'),               // Your email password
                },
                // Other Nodemailer options can go here, such as `secure`, `tls`, etc.
            },
            settings: {
                defaultFrom: env('EMAIL_FROM', 'no-reply@example.com'),
                defaultReplyTo: env('EMAIL_REPLY_TO', 'support@example.com'),
            },
        }
    }
});