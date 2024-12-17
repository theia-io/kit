import { Environment } from './types';

export const environment: Environment = {
  production: true,
  version: '${PACKAGE_JSON}',
  apiBase: '${API_BASE}',
};
