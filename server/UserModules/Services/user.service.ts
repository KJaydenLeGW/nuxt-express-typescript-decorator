import { UserInterface } from "../Interfaces/user.interface";

// A post request should not contain an id.
export type UserCreationParams = Pick<UserInterface, "email" | "name" | "phoneNumbers">;

export class UsersService {
    public get(id: number, name?: string): UserInterface {
        return {
            id,
            email: "jane@doe.com",
            name: name ?? "Jane Doe",
            status: "Happy",
            phoneNumbers: [],
        };
    }

    public create(userCreationParams: UserCreationParams): UserInterface {
        return {
            id: Math.floor(Math.random() * 10000), // Random
            status: "Happy",
            ...userCreationParams,
        };
    }
}