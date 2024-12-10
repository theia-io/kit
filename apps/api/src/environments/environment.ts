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
  version,
  apiBase: 'http://ec2-16-170-168-81.eu-north-1.compute.amazonaws.com/api/',
};
