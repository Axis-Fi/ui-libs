import { Environment } from "./environment";

export default {
  development: {
    description: "Local",
    url: "http://localhost:4000",
  },
  testing: {
    description: "Testing",
    url: "https://ui-libs-staging.up.railway.app",
  },
  staging: {
    description: "Staging",
    url: "https://ui-libs-staging.up.railway.app",
  },
  production: {
    description: "Production",
    url: "https://axisfi-ipfs-api.onrender.com",
  },
} as Record<Environment, { description: string; url: string }>;
