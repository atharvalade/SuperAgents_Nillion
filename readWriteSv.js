import { SecretVaultWrapper } from 'secretvaults';
import { v4 as uuidv4 } from 'uuid';
import { orgConfig } from './orgConfig.js';

const SCHEMA_ID = '6df6fd2a-7174-4630-b001-6c939a6da807';

const web3ExperienceSurveyData = [
    {
    //   _id: uuidv4(), // Required field from schema
      ticker: { '%share': 'AAPL' }, // Encrypted field
      address: { '%share': '0x123...' }, // Encrypted field
      recommendation: { '%share': 'BUY' }, // Encrypted field
      responses: [
        { rating: 5, question_number: 1 },
        { rating: 3, question_number: 2 },
      ], // Plaintext array of responses
    },
];

async function main() {
    try {
      const collection = new SecretVaultWrapper(
        orgConfig.nodes,
        orgConfig.orgCredentials,
        SCHEMA_ID
      );
      await collection.init();
  
      const dataWritten = await collection.writeToNodes(web3ExperienceSurveyData);
      console.log('dataWritten', dataWritten);
  
      const newIds = [
        ...new Set(dataWritten.map((item) => item.data.created).flat()),
      ];
      console.log('created ids:', newIds);
  
      const dataRead = await collection.readFromNodes({});
      console.log('📚 total records:', dataRead.length);
      console.log(
        '📚 Read new records:',
        dataRead.slice(0, web3ExperienceSurveyData.length)
      );
    } catch (error) {
      console.error('❌ Failed to use SecretVaultWrapper:', error.message);
      process.exit(1);
    }
  }
  
  main();