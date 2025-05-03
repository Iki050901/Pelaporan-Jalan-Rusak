import express from 'express';
import cors from 'cors';
import {superAdminRouter} from "../route/superadmin-api.js";
import {publicRouter} from "../route/public-api.js";
import {errorMiddleware} from "../middleware/error-middleware.js";

const corsOptions =  {
    origin: '*',
    method: 'POST,GET,PATCH,DELETE,PUT',
    credentials: false,
}

export const web = express();
web.use(express.json({ limit: '10mb' }));
web.use(express.urlencoded({ extended: true, limit: '10mb' }));
web.use(cors(corsOptions))
web.use(publicRouter)
web.use(superAdminRouter)
web.use(errorMiddleware)
