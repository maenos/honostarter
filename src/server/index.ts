

import { testConnection } from '../database';
import { AuthRoute } from '../routes/auth.router';
import { App } from './app';



const app = new App([
 new  AuthRoute()
])



testConnection();

app.listen()






