import { OpenAPI } from 'routing-controllers-openapi'
import { Controller, Get } from 'routing-controllers'



import { Container } from 'typedi'
import { UserService } from '../services/user.service'


@Controller()
export class UserController {


    @Get('/getAllUsers')
    @OpenAPI({ summary: 'Return a list of users' })
    async getAllUsers() {
        try {
            // const userService = Container.get<UserService>('UserService')
            const userService: UserService = Container.get('UserService')
            const users = await userService.getAllUsers()

            return users
        } catch (err) {
            return "Error"
        }
    }

    // @Post('/dedupSqlQuery')
    // @OpenAPI({ summary: 'Return a list SqlMessageRecord' })
    // async dedupdemo(@Res() res: Response) {

    //     try {

    //     } catch (error) {
    //         console.log(error)

    //         return 'Error'
    //     }
    // }
}
