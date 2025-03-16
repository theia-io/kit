// Import the 'fs' module for file system access
import * as fs from 'fs';
import { Environment } from './types';

// Read the package.json file
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

// Access the version property
const version = packageJson.version;

console.log('\n\nmonorepo version (API):', version, '\n\n');

export const environment: Environment = {
  production: false,
  date: new Date().toUTCString(),
  version,
  apiBase: 'http://localhost:3000/api',
};
