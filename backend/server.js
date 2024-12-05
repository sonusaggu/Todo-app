import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import todoRoutes from './routes/todoRoutes.js';  // Correct relative path


dotenv.config();

// Initialize DynamoDB Local endpoint with fake credentials for local use
const client = new DynamoDBClient({
  region: 'us-west-2',  // Any region will do for local DynamoDB
  endpoint: 'http://localhost:8000',  // Local DynamoDB endpoint
  credentials: { accessKeyId: 'fakeAccessKey', secretAccessKey: 'fakeSecretKey' }, // Fake credentials for local DynamoDB
});

const docClient = DynamoDBDocumentClient.from(client);
export { docClient };
const app = express();
const port = 5000;

// Middleware setup
app.use(express.json());
app.use(cors());

// Ensure the Todo table is created if it doesn't already exist
const createTable = async () => {
  const params = {
    TableName: process.env.TODOS_TABLE_NAME || 'Todos',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' },  // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }, // 'S' for string
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  try {
    await client.send(new CreateTableCommand(params));
    console.log('Table created successfully.');
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('Table already exists.');
    } else {
      console.error('Error creating table:', error);
    }
  }
};

// Call createTable when server starts
createTable();

// Use todo routes for all /api/todos requests
app.use('/api/todos', todoRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
