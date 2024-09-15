
import { RegisterDTO } from "../dtos/auth.dto";
import { createUserDTO } from "../dtos/user.dto";
import Role from "../models/Role.model";
import User from "../models/User.model";
import { UserType } from "../utils/enums.util";
import { IResult, IUserDoc } from "../utils/interface.util";

class UserService {

    constructor(){

    }
    /**
     * @name checkEmail
     * @param email 
     * @returns {boolean}
     */
    public checkEmail(email: string): boolean{

        const regexMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        return regexMail.test(email)   
    }


    /**
     * @name checkPassword
     * @param password 
     * @returns {boolean}
     */
    public checkPassword(password: string): boolean{

        const regexPass = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/
        return regexPass.test(password)       
    }

/**
 * @name createUser
 * @param data 
 * @description creates users in the db and assigns roles
 * @returns
 */
    public async createUser(data: createUserDTO): Promise<IUserDoc>{
        const {email, password, username, phoneNumber, firstName, lastName , phoneCode, userType } = data;

        const user = await User.create({
            email:  email,
            password: password,
            firstName: firstName ? firstName : '',
            lastName: lastName  ? lastName : '',
            username:  username  ? username : '',
            phoneNumber: phoneNumber ? phoneNumber : '',
            phoneCode: phoneCode ? phoneCode : '+234'
            
        });

        // attach role
        await this.attachRole(user, userType);

        return user;

    }

    /**
     * attachRole
     * @param user
     * @description attach each role to the users of the app
     * @param type
     * 
     */
    public async attachRole(user: IUserDoc, type: string): Promise<void> {

        const userRole = await Role.findOne({name: UserType.USER})
        const role = await Role.findOne({ name: type })

        if(type === UserType.ADMIN && userRole && role){

            user.roles.push(userRole._id)
            user.roles.push(role._id)

            await  user.save()

        }
            

        if(type === UserType.BUSINESS && userRole && role){
            user.roles.push(userRole._id)
            user.roles.push(role._id)

            await  user.save()
    }
        
    }

}

export default new UserService()