import { IsEnum, IsMongoId, IsNotEmpty, IsString, validate } from "class-validator";
import { RolesEnum } from "../enums";
import { Type } from "../types/type.interface";
export class NewMessage {
    @IsMongoId()
    @IsNotEmpty()
    channelId!: string;

    @IsString()
    @IsNotEmpty()
    message!: string;
}

export class Member {
    @IsMongoId()
    @IsNotEmpty()
    userId!: string

    @IsNotEmpty()
    @IsEnum(RolesEnum)
    role!: RolesEnum;
}

export class NewGroup {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsNotEmpty()
    members!: string[];
}

export class NewChat {
    @IsNotEmpty()
    @IsMongoId()
    member!: string;
}

export function validatePayload<T>(payload: any, classRef: Type<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        const payloadInstance = Object.assign(Object.assign({}, new classRef()), payload);
        validate(payloadInstance).then((errors) => {
            if (errors.length > 0) {
                reject(errors);
            } else {
                resolve(payloadInstance);
            }
        });
    });
}