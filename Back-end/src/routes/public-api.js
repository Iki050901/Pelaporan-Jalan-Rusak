import express from "express";
import authController from "../controller/auth-controller.js";
import passport from "passport";
import reportController from "../controller/report-controller.js";

const publicRouter = new express.Router();

// Auth API
publicRouter.post("/api/users/register", authController.register);
publicRouter.post("/api/users/login", authController.login);

publicRouter.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
)

publicRouter.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.FRONTEND_URL}/login`,
        session: false
    }), authController.loginGoogle)

publicRouter.get('/api/report/dashboard', reportController.reportDashboard)
publicRouter.get('/api/report/dashboard/by-level', reportController.reportDashboardByDamageLevel)

publicRouter.get('/api/reverse-geocode', reportController.getLocation)
publicRouter.get('/api/location-district', reportController.getLocationDistrict)

export {
    publicRouter
}