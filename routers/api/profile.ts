import express, { Request, Response } from 'express'
import { IProfile } from '../../interface/models/IProfile';
import { IProduct } from '../../interface/models/IProduct';
import Product from '../../models/Products';
import { IRequest } from '../../interface/type';
const router = express.Router();
import { check, validationResult } from 'express-validator';
import Profile from '../../models/Profile';
import auth from '../../middleware/auth';

router.post(
  '/',
  [
    auth,
    [
      check('location', 'location is required').not().isEmpty(),
      check('address', 'address is required').not().isEmpty(),
      check('mobile', 'mobile is required').not().isEmpty(),
    ],
  ],
  async (req: IRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: [{ msg: errors.array() }] });
    }
    const {} = req.body;

    //build profiles
    const profileFields: Partial<IProfile> = {};
    profileFields.user = req.user.id;
    profileFields.location = req.body.location;
    profileFields.address = req.body.address;
    profileFields.mobile = req.body.mobile;

    try {
      let profile: Promise<IProfile> = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      //create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      res.status(500).send('<api/profile.js>server error');
    }
  }
);

//get profile by id
router.get('/', auth, async (req: IRequest, res: Response) => {
  try {
    let profile: Promise<IProfile> = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      res.status(404).json({ errors: [{ msg: 'profile not there' }] });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).send('<api/profile.js>server error');
  }
});
//add to cart
router.put('/add/:p_id', auth, async (req: IRequest, res: Response) => {
  try {
    let profile: Promise<IProfile> = await Profile.findOne({ user: req.user.id });
    let product: Promise<IProduct> = await Product.findById(req.params.p_id);

    if (!profile) {
      const profileFields = {
        user: req.user.id,
      };
      profile = new Profile(profileFields);
    }

    //check if the product already in the cart
    if (
      profile.cart.filter((item) => item.product.toString() === req.params.p_id)
        .length > 0
    ) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'product already in the cart' }] });
    }

    const profileFields: Partial<IProfile> = {
      product: req.params.p_id,
      name: product.name,
      imgsrc: product.imgsrc,
      prize: product.prize,
    };
    profile.cart.unshift(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).send('server error');
  }
});

//remove product from cart
router.put('/remove/:p_id', auth, async (req: IRequest, res: Response) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    //check if the product in the cart
    if (
      profile.cart.filter((item) => item._id.toString() === req.params.p_id)
        .length === 0
    ) {
      return res.status(400).json({ errors: [{ msg: 'product not exists' }] });
    }

    //get remvoe index
    const removeIndex = profile.cart
      .map((item) => item._id.toString())
      .indexOf(req.params.p_id);

    profile.cart.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).send('server error');
  }
});

//get all cart products by user id    
router.get('/cart', auth, async (req: IRequest, res: Response): Promise<void> => {
  try {
    let profile: IProfile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      res.status(404).json({ errors: [{ msg: 'product not found' }] });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).send('server error');
  }
});

module.exports = router;
