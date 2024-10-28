export default () => ({ env }) => ({
    'import-export-entries': {
        enabled: true,
        config: {
            // See `Config` section.
        },
    },
    'upload': {
        enabled: true,
        config: {
            provider: 'local',
            providerOptions: {
                sizeLimit: 1000000, // Set size limit for uploads (in bytes)
            },
            actionOptions: {
                upload: {
                    // Restrict file types to photos only
                    mimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
                },
                delete: {},
            },
        },
    },
});