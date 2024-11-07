import { BitwardenClient, ClientSettings, DeviceType, SecretIdentifiersResponse, SecretResponse } from "@bitwarden/sdk-napi";
import { LogLevel } from "@bitwarden/sdk-napi/binding";

export class SecretsManager {
    settings: ClientSettings = {
        apiUrl: "https://vault.bitwarden.com/api",
        identityUrl: "https://vault.bitwarden.com/identity",
        userAgent: "Bitwarden SDK",
        deviceType: DeviceType.SDK,
    };
    accessToken: string | undefined;
    client: BitwardenClient | undefined;
    organizationID: string | undefined;

    constructor() {
        this.accessToken = process.env.BITWARDEN_ACCESS_TOKEN;
        this.organizationID = process.env.BITWARDEN_ORGANIZATION_ID;
    }

    async connect(): Promise<boolean> {
        if (!this.accessToken) {
            return false;
        }
        this.client = new BitwardenClient(this.settings, LogLevel.Warn);
        await this.client.auth().loginAccessToken(this.accessToken);
        return true;
    }

    async list(): Promise<SecretIdentifiersResponse | undefined> {
        if (!this.organizationID || !this.client) {
            return undefined;
        }
        return await this.client.secrets().list(this.organizationID);
    }

    async get(id: string): Promise<SecretResponse | undefined> {
        if (!this.client || !id) {
            return undefined;
        }
        return await this.client.secrets().get(id);
    }

    async getValue(id: string): Promise<string | undefined> {
        const value = await this.get(id);
        if (!value) {
            return undefined;
        }
        return value?.value;
    }
}