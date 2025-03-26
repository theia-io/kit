import { Environment } from '@kitouch/be-config';

const version = process.env['PACKAGE_VERSION'] ?? 'N/A';
const baseUrl = process.env['BASE_URL'];
const apiPrefix = process.env['API_PREFIX'];
const feUrl = process.env['FE_URL'];
if (!apiPrefix || !baseUrl) {
  throw new Error(`env variable(s) is(are) missing: ${baseUrl},${apiPrefix}`);
}

export const environment: Environment = {
  production: true,
  version,
  baseUrl,
  apiPrefix,
  feUrl,
};
