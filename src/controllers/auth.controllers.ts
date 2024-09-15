import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/async.mdw";
import logger from "../utils/logger.util";
import { RegisterDTO } from "../dtos/auth.dto";
import Role from "../models/Role.model";
import ErrorResponse from "../utils/error.util";
import { AppChannel, UserType } from "../utils/enums.util";
import User from "../models/User.model";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import authMapper from "../mappers/auth.mapper";

/**
 * @name register
 * @description Registers a new user for the application
 * @router POST /auth/register
 * @access everyone
 */
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as RegisterDTO;

    const validate = await AuthService.validateRegister(req.body);
    
    if (validate.error) {
        return next(new ErrorResponse('Error', validate.code!, [validate.message]));
    }

    // Validate existing user
    const existUser = await User.findOne({ email: email });
    if (existUser) {
        return next(new ErrorResponse('Error!', 403, ['User already exists, use another email']));
    }

    // Create user
    const user = await UserService.createUser({ 
        email: email,
        password: password, 
        userType: UserType.BUSINESS 
    });

    // Map data 
    const mapped = await authMapper.mapRegisteredUser(user);

    res.status(200).json({
        error: false,
        errors: [],
        data: mapped,
        message: "Successful",     
        status: 200
    });
});
