import { Hono } from "hono";
import type { Routes } from "../interfaces/routes.interface";

export class AuthRoute  implements Routes{
    public path = '/auth';
    public router = new Hono(); // Utilisez une instance de Hono au lieu de Router
   // public userController = new UserController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Utilisez .post et .get directement sur le router, en incluant le chemin complet
        this.router.get(`/test`,(c) => c.json('Create Book') );
      
    }
}