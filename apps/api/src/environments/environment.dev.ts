import { Environment } from './types';

const version = process.env['PACKAGE_VERSION'] ?? 'N/A';
const apiBase = process.env['API_BASE'];
if (!apiBase) {
  throw new Error('API Base URL is not set');
}

export const environment: Environment = {
  production: true,
  version,
  date: new Date().toUTCString(),
  apiBase,
};
