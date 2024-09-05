import { Hono } from 'hono';
//import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

import { bodyLimit } from 'hono/body-limit';
import { csrf } from 'hono/csrf';
import { secureHeaders } from 'hono/secure-headers';
import { prettyJSON } from 'hono/pretty-json';
import { compress } from 'hono/compress';
//import { serveStatic } from '@hono/serveStatic';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { serve } from 'bun';
import { limiter } from '../config/rateLimiter';
import { getCorsOptions } from '../config/cors';
import { serveStatic } from 'hono/serve-static';
import path from "path";
import fs from "fs";
import { staticOptions } from '../config/staticConfig';
import { HTTPException } from 'hono/http-exception';
import type { Routes } from '../interfaces/routes.interface';
import { swaggerUI } from '@hono/swagger-ui';
import { handlemiddleware } from '../middleware/errorMiddleware';
import { logger } from '../config/logger';


export class App {
    public app: Hono;
    public env: string;
    public port: string | number;
    public http: Server;
    public io: any;

    constructor(routes: any[]) {
        this.app = new Hono();
        this.env = process.env.NODE_ENV || 'development';
        this.port = process.env.PORT || 3000;
        this.http = require('http').createServer(this.app);
        this.io = require('socket.io')(this.http, {
            cors: {
                origin: '*',
            },
        });

        this.setupMiddlewares();
        this.initializeRoutes(routes);
        this.setupSwagger();
        this.app.use(handlemiddleware)
        this.app.notFound((c) => {
            return c.json({ error: { message: 'Route non trouvée', status: 404 } }, 404)
        })
        this.initializeSocket();
    }

    private setupMiddlewares(): void {

       
        // Middleware pour logger les requêtes et les réponses
        this.app.use('*', async (c, next) => {
            logger.logRequest(c.req);
            await next();
            logger.logResponse(c.res);
        });
        this.app.use(limiter);

        this.app.use('*', cors(getCorsOptions()));

        // Secure Headers Middleware
        this.app.use('*', secureHeaders());

        this.app.use('*', prettyJSON());

        this.app.use('*', bodyLimit({
            maxSize: 10 * 1024 * 1024, onError: (c) => {
                throw new HTTPException(413, { message: 'Request Entity Too Large' });
            },
        }));


        this.app.use('/public/*', serveStatic(staticOptions));


    }




    private initializeRoutes(routes: Routes[]): void {
        routes.forEach((route) => {
            this.app.route('/api' + route.path, route.router);
        });
    }

    public listen(): void {
        serve({
            port: this.port,
            fetch: this.app.fetch, // Utilisez la méthode fetch de Hono
        });
        console.log(`=================================`);
        console.log(`🚀 App listening on the port ${this.port}`);
        console.log(`=================================`);
    }


    private initializeSocket(): void {
        this.io.on('connection', (socket: Socket) => {
            console.log('a user connected');

            socket.emit('welcome', 'Welcome to the Socket.io server!');

            socket.on('message', (data: string) => {
                console.log('message received:', data);
                socket.broadcast.emit('message', data);
            });

            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
    }

    public getSocketInstance() {
        return this.io;
    }

    public getServer() {
        return this.http;
    }

    private setupSwagger() {
        this.app.get('/ui', swaggerUI({ url: '/doc' }))

    }
}
