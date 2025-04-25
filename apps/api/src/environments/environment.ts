// Import the 'fs' module for file system access
import { Environment } from '@kitouch/be-config';
import * as fs from 'fs';

// Read the package.json file
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

// Access the version property
const version = packageJson.version;

console.log('\n\nmonorepo version (API):', version, '\n\n');

export const environment: Environment = {
  production: false,
  version,
  baseUrl: 'http://localhost:3000',
  apiPrefix: '/api',
  feUrl: 'http://localhost:4200',
};
