import { Router } from 'express';
import { check } from 'express-validator';
import {
  change_password,
  demote,
  forgot_password,
  login,
  promote,
  refresh_token,
  resend_otp,
  reset_password,
  signup,
  verify_otp,
  verify_token,
} from '../controllers/auth.js';
import { authorize } from '../middleware/authorize.js';

const authRouter = Router();

authRouter.post(
  '/login',
  [
    check('username').notEmpty().withMessage('username is required'),
    check('password').notEmpty().withMessage('password is required'),
  ],
  login
);

authRouter.post(
  '/signup',
  [
    check('username')
      .isLength({ min: 3 })
      .withMessage('minimum username length is 3'),
    check('username')
      .isLength({ max: 100 })
      .withMessage('maximum username length is 100'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('minimum password length is 6'),
    check('email').notEmpty().withMessage('email is required'),
    check('email').normalizeEmail().isEmail().withMessage('email is invalid'),
    check('role')
      .isIn(['Seller', 'Buyer'])
      .withMessage('Role must be either Seller or Buyer'),
  ],
  signup
);

authRouter.post(
  '/refresh-token',
  check('token').notEmpty().withMessage('token is required'),
  refresh_token
);

authRouter.post(
  '/verify-token',
  check('token').notEmpty().withMessage('token is required'),
  verify_token
);

authRouter.post(
  '/send-otp',
  [
    check('email').notEmpty().withMessage('email cant be empty'),
    check('email').normalizeEmail().isEmail().withMessage('invalid email'),
  ],
  resend_otp
);

authRouter.patch(
  '/verify-otp',
  [
    check('otp').notEmpty().withMessage('otp is required'),
    check('email').notEmpty().withMessage('email is required'),
    check('email').normalizeEmail().isEmail().withMessage('email is invalid'),
  ],
  verify_otp
);

authRouter.patch(
  '/forgot-password',
  [
    check('email').notEmpty().withMessage('email is required'),
    check('email').normalizeEmail().isEmail().withMessage('email is invalid'),
  ],
  forgot_password
);

authRouter.patch(
  '/change-password',
  authorize(['Seller', 'Admin', 'Buyer']),

  [
    check('old_password').notEmpty().withMessage('old_password is required'),
    check('old_password').notEmpty().withMessage('old_password is required'),
    check('new_password')
      .isLength({ min: 6 })
      .withMessage('minimum password length is 6'),
  ],
  change_password
);

authRouter.patch(
  '/reset-password',
  check('new_password')
    .isLength({ min: 6 })
    .withMessage('minimum password length is 6'),
  reset_password
);

authRouter.patch('/promote/:id', authorize(['Admin']), promote);
authRouter.patch('/demote/:id', authorize(['Admin']), demote);

export default authRouter;
