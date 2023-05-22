import express, {Request, Response } from "express";
const router = express.Router();
import auth from '../../middleware/auth';
import User from '../../models/User';
import { check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IUser } from "../../interface/models/IUser";
import { IRequest } from "../../interface/type";

// @route GET api/auth
// @desc test route
// @access public
router.get('/', auth, async (req: IRequest, res: Response) => {
  try {
    const user: IUser = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err: any) {
    res.status(500).send('server error');
  }
});

// @route POST api/auth
// @desc Authentication user &get Token
// @access public
router.post(
  '/',
  [
    check('email', 'please enter valid email').isEmail(),
    check('password', 'password is required').exists(),
  ],
  async (req: IRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      let user: IUser = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials0' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials1' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err: any) {
      return res.status(500).send('server Error, <api/user.js>' + err.message);
    }
  }
);

module.exports = router;
