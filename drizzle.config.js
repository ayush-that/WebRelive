export default {
  dialect: "postgresql",
  schema: "./utils/db/schema.ts",
  out: "./drizzle",

  dbCredentials: {
    url: "postgresql://neondb_owner:Mf6pW7ZmoFxl@ep-still-boat-a563nj9o.us-east-2.aws.neon.tech/neondb?sslmode=require",
    connectionString:
      "postgresql://neondb_owner:Mf6pW7ZmoFxl@ep-still-boat-a563nj9o.us-east-2.aws.neon.tech/neondb?sslmode=require",
  },
};
