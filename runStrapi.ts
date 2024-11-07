import { SecretsManager } from './src/utils/secret-manager';
import 'dotenv/config'
import { spawn } from 'child_process';

async function initSecrets() {
  const secretManager = new SecretsManager();
  const connected = await secretManager.connect();

  if (connected) {
    const secretsList = await secretManager.list();

    for (const secret of secretsList.data) {
      if (secret.key) {
        const secretValue = await secretManager.getValue(secret.id);
        process.env[secret.key] = secretValue || '';
      }
    }
  } else {
    throw new Error("Failed to connect to Secrets Manager");
  }
}

initSecrets().then(() => {
  // Start Strapi after initializing secrets
  const command = process.env.NODE_ENV === 'production' ? 'strapi start' : 'strapi develop';
  const strapiProcess = spawn(command, { stdio: 'inherit', shell: true });

  strapiProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Strapi process exited with code ${code}`);
    }
  });

  strapiProcess.on('exit', (code) => {
    console.log(`Process exited with code ${code}`);
  });

  strapiProcess.on('error', (err) => {
    console.error('Failed to start Strapi process:', err);
  });


}).catch(error => {
  console.error("Error initializing secrets:", error);
});