import { IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { RolesEnum } from "../enums";

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