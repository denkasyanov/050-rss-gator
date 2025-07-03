import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { readConfig } from "../../config.js";
import * as schema from "./schema.js";

const config = readConfig();
const connection = postgres(config.dbUrl);
export const db = drizzle(connection, { schema });
