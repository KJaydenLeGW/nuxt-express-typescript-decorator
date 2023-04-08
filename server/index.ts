

import { UserController } from './Controllers/UserControllers';

import App from './app';
const app = new App([UserController])
app.listen()

