// Import the 'fs' module for file system access
import { Environment } from '@kitouch/be-config';
import * as fs from 'fs';

// Read the package.json file
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

// Access the version property
const version = packageJson.version;

console.info('\n[ENVIRONMENT local] monorepo version (API) %s', version);

export const environment: Environment = {
  production: false,
  version,
  baseUrl: 'http://localhost:3000',
  apiPrefix: '/api',
  feUrl: 'http://localhost:4200',
};
