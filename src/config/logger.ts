import pino from 'pino';
import { mkdir, access } from 'fs/promises';
import path from 'path';

const logDir = path.join(process.cwd(), 'logs');

// Assurez-vous que le répertoire de logs existe
async function ensureLogDir() {
  try {
    await access(logDir);
  } catch {
    await mkdir(logDir, { recursive: true });
  }
}

await ensureLogDir();

const reqResLogger = pino({
  level: 'info',
  transport: {
    target: 'pino/file',
    options: { destination: path.join(logDir, 'req-res.log') }
  }
});

const errorLogger = pino({
  level: 'error',
  transport: {
    target: 'pino/file',
    options: { destination: path.join(logDir, 'error.log') }
  }
});

export const logger = {
  logRequest: (req: any) => {
    reqResLogger.info({
      type: 'request',
      method: req.method,
      url: req.url,
      headers: req.headers,
    });
  },
  logResponse: (res: any) => {
    reqResLogger.info({
      type: 'response',
      status: res.status,
      headers: res.headers,
    });
  },
  logError: (error: Error) => {
    errorLogger.error({
      type: 'error',
      message: error.message,
      stack: error.stack,
    });
  }
};
