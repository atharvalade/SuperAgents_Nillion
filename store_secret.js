const { SecretVaultWrapper } = require('@nillion/client-vms');
const fs = require('fs').promises;
require('dotenv').config();

// Load organization configuration
const orgConfig = {
  nodes: process.env.NODES.split(','), // Array of node URLs
  orgCredentials: {
    privateKey: process.env.ORG_PRIVATE_KEY,
    publicKey: process.env.ORG_PUBLIC_KEY,
  },
};

// Define the schema ID for your data
const collectionConfig = {
  schemaId: 'your_schema_id', // Replace with your actual schema ID
};

async function storeDataInSecretVault(filePath) {
  try {
    // Initialize the SecretVaultWrapper
    const secretVaultCollection = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials,
      collectionConfig.schemaId
    );
    await secretVaultCollection.init();

    // Read data from the file
    const fileData = await fs.readFile(filePath, 'utf8');

    // Define the data to store
    const dataToStore = {
      fieldName: fileData, // Replace 'fieldName' with your schema's field name
    };

    // Encrypt and upload data to the Secret Vault
    const response = await secretVaultCollection.create(dataToStore);
    console.log('Data successfully stored in Secret Vault:', response);
  } catch (error) {
    console.error('Error storing data in Secret Vault:', error);
  }
}

// Example usage
const filePath = './sec_Data.txt'; // Replace with the path to your file
storeDataInSecretVault(filePath);
