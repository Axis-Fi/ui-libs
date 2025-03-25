import { Environment } from "./environment";

export default {
  development: {
    description: "Local",
    url: "http://localhost:4000",
  },
  testing: {
    description: "Testing",
    url: "https://curator-api-staging.up.railway.app",
  },
  staging: {
    description: "Staging",
    url: "https://curator-api-staging.up.railway.app",
  },
  production: {
    description: "Production",
    url: "https://curator-api-production.up.railway.app",
  },
} as Record<Environment, { description: string; url: string }>;
