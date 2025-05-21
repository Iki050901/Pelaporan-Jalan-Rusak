import express from 'express';
import cors from 'cors';
import {errorMiddleware} from "../middleware/error-middleware.js";
import {publicRouter} from "../routes/public-api.js";
import {usersRouter} from "../routes/users-api.js";
import {puprRouter} from "../routes/pupr-api.js";
import {districtRouter} from "../routes/district-api.js";

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
web.use(usersRouter)
web.use(districtRouter)
web.use(puprRouter)
web.use(errorMiddleware)
