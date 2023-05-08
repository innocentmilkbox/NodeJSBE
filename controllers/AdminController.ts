import { Request, Response, NextFunction} from 'express';
import { CreateVandorInput } from '../dto';
import { Vandor } from '../models';
import { GeneratePassword, GenerateSalt } from '../utility';


export const FindVandor = async(id: string | undefined, email?: string) => {
    if(email){
        return  await Vandor.findOne({email});        
    }else{
        return await Vandor.findById(id);
    }
}

export const CreateVandor = async (req: Request, res: Response, next: NextFunction) => {
    const {name, address, pincode, foodType, email, password, ownerName, phone} = <CreateVandorInput>req.body;

    const existingVandor = await FindVandor("", email);
    if(existingVandor != null){
        return res.json({"message": "email already exist"});
    }

    //generate a salt
    const salt = await GenerateSalt();
    //encrypt the password using the salt
    const hashedPassword = await GeneratePassword(password, salt);

    const createdVandor = await Vandor.create({
        name,
        address,
        pincode,
        foodType,
        email,
        password: hashedPassword,
        ownerName,
        phone,
        salt,
        rating: 0,
        serviceAvailable: false,
        coverImages: []
    })

    return res.json(createdVandor);
}

export const GetVandors = async (req: Request, res: Response, next: NextFunction) => {
    const vandors = await Vandor.find();

    if(vandors !== null){
        return res.json(vandors);
    };
    return res.json({"message": "vandors data not available"});
}

export const GetVandorById = async (req: Request, res: Response, next: NextFunction) => {
    const vandorId = req.params.id;
    const vandor = await FindVandor(vandorId);
    if(vandor !== null){
        return res.json(vandor);
    }
    return res.json({"message": "cannot find vandor with this id"});
}