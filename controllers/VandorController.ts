import {Request, Response, NextFunction} from 'express';
import { EditVandorInput, VandorLoginInput, VandorPayload } from '../dto';
import { FindVandor } from './AdminController';
import { GenerateSignature, ValidatePassword } from '../utility';

export const VandorLogin = async (req:Request, res: Response, next: NextFunction) => {
    const {email, password} = <VandorLoginInput>req.body;

    const existingVandor = await FindVandor("",email);

    if(existingVandor !== null){
        const validation = await ValidatePassword(password, existingVandor.password, existingVandor.salt);
        if(validation){
            const signature = GenerateSignature({
                _id: existingVandor._id,
                name: existingVandor.name,
                email: existingVandor.email,
                foodTypes: existingVandor.foodType
            })
            return res.json(signature);
        }else{
            return res.json({"message":"Password is not valid"});
        }
    }
    return res.json({"message":"Login credential is not valid"});
}

export const GetVandorProfile = async (req:Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if(user){
        const existingVandor = await FindVandor(user._id);
        return res.json(existingVandor);
    }
    return res.json({"message": "Vandor information Not Found"})
}

export const UpdateVandorProfile = async (req:Request, res: Response, next: NextFunction) => {
    const {name, phone, address, foodTypes} = <EditVandorInput>req.body;
    const user = req.user;
    if(user){
        const existingVandor = await FindVandor(user._id);
        if(existingVandor !== null){
            existingVandor.name = name;
            existingVandor.phone = phone;
            existingVandor.address = address;
            existingVandor.foodType = foodTypes;

            const savedResult = await existingVandor.save();
            return res.json(savedResult);
        }
        return res.json(existingVandor);
    }
    return res.json({"message": "Vandor information Not Found"})
}

export const UpdateVandorService =async (req:Request, res: Response, next: NextFunction) => {
    const user = 
}