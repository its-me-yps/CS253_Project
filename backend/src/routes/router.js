import express from 'express';
import session from '../controllers/session.js';
import admin from '../controllers/admin.js'
import student from '../controllers/student.js';
import mailer from '../otp/mail.js'
import jwtAuth from '../middlewares/auth.js';

const router = express.Router();

// Session Routes
router.post('/session/admin/login', session.adminLogin);
router.post('/session/user/login', session.userLogin);
router.get('/session/logout', session.logout);

// Register Routes
router.post('/sendAuthCode', mailer.sendOTP);
router.post('/student/register', student.register);

// Authentication Midddleware to access other routes
router.use(jwtAuth);

// Admin Routes
router.post('/admin/washerman/register', admin.registerWasherman);
router.post('/admin/addHallData', admin.addHallData);

export default router;