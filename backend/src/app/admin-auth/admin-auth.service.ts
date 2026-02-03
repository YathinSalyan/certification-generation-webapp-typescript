import { eq } from "drizzle-orm";
import { Tnx, withTransaction } from "../../lib/db/pg/transaction";
import { ApiError } from "../../lib/types/api-error";
import { admins, AdminInsert } from "../../schemas/admin.repository";
import { AdminLogin, AdminRegister } from "./admin-auth.validator";
import { PasswordUtil } from "../../lib/utils/password-util";
import { AccessTokenUtil } from "../../lib/jwt/jwt-token-util";
import { db } from "../../config/db";  // FIXED: Import from config/db

const register = async (tnx: Tnx, body: AdminRegister) => {
    // Check if username already exists
    const existingAdmin = await tnx.query.admins.findFirst({
        where: eq(admins.username, body.username)
    });

    if (existingAdmin) {
        throw ApiError.badRequest("Username already exists");
    }

    // Check if email already exists
    const existingEmail = await tnx.query.admins.findFirst({
        where: eq(admins.email, body.email)
    });

    if (existingEmail) {
        throw ApiError.badRequest("Email already exists");
    }

    const adminData: AdminInsert = {
        username: body.username,
        passwordHash: await PasswordUtil.hashPassword(body.password),
        email: body.email,
        fullName: body.fullName
    };

    const [admin] = await tnx.insert(admins).values(adminData).returning();

    if (!admin) throw ApiError.internalServerError("Error while creating admin");

    const accessToken = AccessTokenUtil.generateToken({ 
        userId: admin.adminId, 
        role: "admin" 
    });

    // Prevent hashed password from leaking to client
    const { passwordHash, ...adminDetail } = admin;

    return { accessToken, admin: adminDetail };
}

const login = async (body: AdminLogin) => {
    const admin = await db.query.admins.findFirst({
        where: eq(admins.username, body.username)
    });

    if (!admin) throw ApiError.notFound("Invalid credentials");

    const isPasswordMatch = await PasswordUtil.comparePasswords(body.password, admin.passwordHash);
    
    if (!isPasswordMatch) throw ApiError.badRequest("Invalid credentials");

    const accessToken = AccessTokenUtil.generateToken({ 
        userId: admin.adminId, 
        role: "admin" 
    });

    // Prevent hashed password from leaking to client
    const { passwordHash, ...adminDetail } = admin;

    return { accessToken, admin: adminDetail };
}

const getProfile = async (adminId: string) => {
    const admin = await db.query.admins.findFirst({
        where: eq(admins.adminId, adminId),
        columns: {
            passwordHash: false
        }
    });

    if (!admin) throw ApiError.notFound("Admin not found");

    return { admin };
}

export const AdminAuthService = {
    register: withTransaction(register),
    login,
    getProfile
}