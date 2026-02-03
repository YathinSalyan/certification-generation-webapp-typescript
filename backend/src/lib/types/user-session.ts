import { UserRoles } from "../db/pg/schema";
import { StringUtils } from "../utils/string-util";
import { ApiError } from "./api-error";

export class Session {

    private userId: string;
    private role: UserRoles;

    private constructor(userId: string, role: UserRoles) {
        this.userId = userId;
        this.role = role;
    }

    static setAuth(userId: string | number, role: UserRoles | string) {

        // Normalize userId
        const normalizedUserId = String(userId);

        if (StringUtils.isEmpty(normalizedUserId)) {
            throw ApiError.internalServerError("BAD USER ID!");
        }

        if (role !== "admin" && role !== "user") {
            throw ApiError.internalServerError("BAD USER ROLE!");
        }

        return new Session(normalizedUserId, role as UserRoles);
    }

    getUserId(): string {
        return this.userId;
    }

    getUserRole(): UserRoles {
        return this.role;
    }
}
