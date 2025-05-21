import {fileURLToPath} from "url";
import {dirname} from "path";

process.env.NODE_ENV = 'test';

global.filename = fileURLToPath(import.meta.url);
global.__dirname = dirname(filename);