import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { HTTPResponseError } from 'hono/types';
import { logger } from '../config/logger';


// Middleware pour gérer l'exception
export const handlemiddleware = async (c: any, next: () => any) => {
    try {
        await next()
    } catch (error) {
      
        if (error instanceof HTTPException) {
            logger.logError(error)
            return c.json({
                error: {
                    message: error.message,
                    status: error.status
                }
            }, error.status)
        }

      
        return c.json({
            error: {
                message: "Une erreur inattendue s'est produite",
                status: 500
            }
        }, 500)
    }
};


