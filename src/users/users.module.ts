import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {User,UserSchema} from "./schema/user.schema";
import {MongooseModule} from "@nestjs/mongoose";

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {
}
