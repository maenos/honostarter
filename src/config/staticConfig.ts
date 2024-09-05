import { promises as fs } from 'fs';
import path from 'path';

const resolvePath = (filePath: string) => path.resolve(__dirname, '..', filePath);

const checkIsDir = async (filePath: string) => {
  try {
    const stats = await fs.stat(filePath);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
};

const getContent = async (filePath: string) => {
  try {
    const resolvedPath = resolvePath(filePath);
    const data = await fs.readFile(resolvedPath);
    return data;
  } catch (error) {
    return null; // Retourne null si le fichier n'existe pas
  }
};

export const staticOptions = {

  getContent: async (filePath: string, c: any) => {
    console.log(filePath)
    const content = await getContent(filePath);
    if (content) {
      return new Response(content, {
        headers: { 'Content-Type': 'image/png' },
      });
    }
    return null; // Retourne null pour passer au prochain middleware si le fichier n'existe pas
  },
  pathResolve: resolvePath,
  isDir: checkIsDir,
};
