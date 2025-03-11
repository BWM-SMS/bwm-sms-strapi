/**
 * https://docs.strapi.io/dev-docs/backend-customization/models#available-lifecycle-events
 */
import { Encryption } from '../../../../utils/encryption';

export default {
    async beforeCreate(event) {
        const { data, where, select, populate } = event.params;

        // Define the country code prefix
        const countryPrefix = 'S'; // TODO: If going to support Malaysia

        // Determine the year part of the username
        const year = data.joinYear
            ? data.joinYear.toString().slice(-2) // Convert joinYear to string and extract the last two digits
            : new Date().getFullYear().toString().slice(-2); // Default to current year

        // Query for the latest record with the same year prefix
        const latestRecord = await strapi.documents('plugin::users-permissions.user').findFirst({
            filters: {
                username: {
                    $startsWith: `${countryPrefix}${year}`, // Search for usernames that match the year prefix
                },
            },
            sort: "username:desc"
        });

        // Determine the next increment based on the latest record
        let nextIncrement = 1;
        if (latestRecord && latestRecord.username) {
            // Extract and increment the last 5 digits of the latest username for this year
            const lastIncrement = parseInt(latestRecord.username.slice(-5), 10);
            nextIncrement = lastIncrement + 1;
        }

        // Format the increment as a 5-digit string, e.g., '00001'
        const incrementStr = String(nextIncrement).padStart(5, '0');

        // Generate the username
        if (data.username) { } else {
            data.username = `${countryPrefix}${year}${incrementStr}`;
        }

        if (data.password) { } else {
            data.password = 'abc123';
        }

        // if (data.phoneNumber) {
        //     data.phoneNumber = Encryption.encrypt(data.phoneNumber);
        // }

        // if (data.email) {
        //     data.email = Encryption.encrypt(data.email);
        // }
    },
    // async beforeUpdate(event) {
    //     const { data } = event.params;
    //     if (data) {
    //         if (data.phoneNumber) {
    //             data.phoneNumber = Encryption.encrypt(data.phoneNumber);
    //         }

    //         if (data.email) {
    //             data.email = Encryption.encrypt(data.email);
    //         }
    //     }
    // },
    // async afterFindOne(event) {
    //     const { result } = event;
    //     if (result) {
    //         if (result.phoneNumber) {
    //             result.phoneNumber = Encryption.decrypt(result.phoneNumber);
    //         }

    //         if (result.email) {
    //             result.email = Encryption.decrypt(result.email);
    //         }
    //     }
    // },
    // async afterFindMany(event) {
    //     const { result } = event;
    //     result.forEach(result => {
    //         if (result.phoneNumber) {
    //             result.phoneNumber = Encryption.decrypt(result.phoneNumber);
    //         }

    //         if (result.email) {
    //             result.email = Encryption.decrypt(result.email);
    //         }
    //     });
    // }
};