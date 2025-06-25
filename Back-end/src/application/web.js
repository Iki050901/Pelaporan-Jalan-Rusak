import express from 'express';
import cors from 'cors';
import {errorMiddleware} from "../middleware/error-middleware.js";
import {publicRouter} from "../routes/public-api.js";
import {usersRouter} from "../routes/users-api.js";
import {puprRouter} from "../routes/pupr-api.js";
import {districtRouter} from "../routes/district-api.js";
import './passport-setup.js';
import passport from "passport";
import path from "path";
import * as process from "node:process"

const corsOptions =  {
    origin: '*',
    method: 'POST,GET,PATCH,DELETE,PUT',
    credentials: false,
}

export const web = express();
web.use(express.json()); // ✅ HARUS sebelum router
web.use(express.urlencoded({ extended: true }));
web.use(cors(corsOptions))
web.use(passport.initialize());
web.use(publicRouter)
web.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
web.use(usersRouter)
web.use(districtRouter)
web.use(puprRouter)
web.use(errorMiddleware)
