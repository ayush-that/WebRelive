import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(
  "postgresql://neondb_owner:Mf6pW7ZmoFxl@ep-still-boat-a563nj9o.us-east-2.aws.neon.tech/neondb?sslmode=require"
);

export const db = drizzle(sql, { schema });
