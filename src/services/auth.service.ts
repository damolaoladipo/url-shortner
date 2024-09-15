import { RegisterDTO } from "../dtos/auth.dto";
import { IResult } from "../utils/interface.util";
import UserService from "./user.service";

class AuthService {

    constructor(){}
    /**
     * @name validateRegister
     * @param data @name
     * @returns {IResult} - see IResult
     */


    public async validateRegister(data: RegisterDTO): Promise<IResult>{
        
        let result: IResult = {error: false, message: '' , code: 200, data: {}};     

        
        const {email, password } = data;

        if (!email){
            result.error =true, 
            result.message = 'Email is required'
            result.code = 400
        }else if (!password) {
            result.error =true, 
            result.message = 'password is required'
            result.code = 400
        }else if (!UserService.checkEmail(email)) {
            result.error =true, 
            result.message = 'Email is required'
            result.code = 400
        }else if (!UserService.checkPassword(password)) {
            result.error =true, 
            result.message = 'password length must be grater than or equal to 8 and pasword must contain 1 uppercase letter, 1 lowercase letter, 1 special character, and 1 number'
            result.code = 400
        }else {
            result.error = false,
            result.message = '',
            result.code = 200
        }
          
            
        return result;
    }

}

export default new AuthService()