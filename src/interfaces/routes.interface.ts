import { Hono } from 'hono';

export interface Routes {
  path?: string; // Maintient le chemin optionnel pour la compatibilité
  router: Hono;  // Remplace Router par Hono
}