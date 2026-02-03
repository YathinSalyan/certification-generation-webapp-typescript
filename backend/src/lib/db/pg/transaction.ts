import { PgTransaction } from "drizzle-orm/pg-core";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { ExtractTablesWithRelations } from "drizzle-orm";
import * as schemas from "./schema";
import { db } from "../../../config/db";  // FIXED: Import from config/db

export type Tnx = PgTransaction<NodePgQueryResultHKT, typeof schemas, ExtractTablesWithRelations<typeof schemas>> 

type FnWithSession<TArgs extends any[], TReturn> = (tnx: Tnx, ...args: TArgs) => Promise<TReturn>;

export const withTransaction = <TArgs extends any[], TReturn>(
    fn: FnWithSession<TArgs, TReturn>
) => {
    return async (...args: TArgs): Promise<TReturn> => {

        try {
            const result = await db.transaction(async (tnx: Tnx) => {
                return await fn(tnx, ...args);
            })

            return result;

        } catch (error) {
            console.error("Transaction failed, aborting:", error);
            throw error;
        }
    };
};