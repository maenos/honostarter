
// config/corsOptions.ts

// Options CORS pour l'environnement de développement
export const corsOptionsDev = {
    origin: '*', // Autoriser toutes les origines en développement (à ajuster selon vos besoins)
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
};

// Options CORS pour l'environnement de production
export const corsOptionsProd = {
    origin: 'https://votre-domaine-de-production.com', // Remplacez par votre domaine de production réel
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
};

// Fonction pour obtenir les options CORS en fonction de l'environnement
export const getCorsOptions = () => {
    if (process.env.NODE_ENV === 'production') {
        return corsOptionsProd;
    } else {
        return corsOptionsDev;
    }
};