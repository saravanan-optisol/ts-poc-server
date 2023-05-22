import express, { Request, Response } from "express";
const router = express.Router();
import gravator from 'gravatar';
import User from "../../models/User";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import { check, validationResult } from "express-validator";
import { IRequest } from "../../interface/type";
import { IUser } from "../../interface/models/IUser";

// @route POST api/User
// @desc Register User
// @access public

router.post(
  '/',
  [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'please enter valid email').isEmail(),
    check('password', 'give the password').isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      let user: IUser = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'email already exists' }] });
      }

      const avatar = gravator.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      //return json webtoken
      //res.send('User ruote -Registerd');
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 360000 },
        (err: any, token: string) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err: any) {
      console.log(err.message);
      return res.status(500).send('server Error, <api/user.js>' + err.message);
    }
  }
);

module.exports = router;
