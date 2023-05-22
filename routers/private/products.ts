import { Request, Response } from "express";
import { IRequest } from "../../interface/type";
import { IProduct, IReview } from "../../interface/models/IProduct";
import { IUser } from "../../interface/models/IUser";

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Product = require('../../models/Products');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const { cloudinary } = require('../../config/cloud');

//add product
router.post(
  '/',
  [
    check('category', 'please enter the category').not().isEmpty(),
    check('name', 'please enter the name').not().isEmpty(),
    check('productName', 'please enter the product name').not().isEmpty(),
    check('brand', 'please enter the brand').not().isEmpty(),
    check('prize', 'please enter the prize').not().isEmpty(),
    check('description', 'please enter the desc').not().isEmpty(),
    check('information', 'please enter the information').not().isEmpty(),
    check('imageFile', 'please enter the imgsrc').not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ errors: [{ msg: errors.array() }] });
    }

    const {
      category,
      name,
      productName,
      brand,
      prize,
      description,
      information,
      offer,
      imageFile,
    } = req.body;

    try {
      const response = await cloudinary.uploader.upload(
        imageFile,
        function (result: any) {
          return result;
        },
        { upload_preset: 'products' }
      );

      const imgsrc = response.secure_url;
      const product: IProduct = new Product({
        category,
        name,
        productName,
        brand,
        prize,
        description,
        information,
        offer,
        imgsrc,
      });

      await product.save();
      res.status(200).json({ errors: [{ msg: 'product added to store' }] });
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('<api/profile.js>server error');
    }
  }
);

//get all products
router.get('/', async (req: Request, res: Response) => {
  try {
    const products: IProduct[] = await Product.find();

    res.json(products);
  } catch (err: any) {
    console.log(err.message);
    res.status(500).send('server errorr');
  }
});
module.exports = router;

//get product by catagory
router.get('/cat/:cato', async (req: Request, res: Response) => {
  try {
    let product: IProduct[] = await Product.find({ category: req.params.cato });

    if (!product) {
      res.status(404).json({ errors: [{ msg: 'category is empty' }] });
    }

    res.json(product);
  } catch (err: any) {
    console.log(err.message);
    res.status(500).send('server errorr');
  }
});

//get product by id
router.get('/:_id', async (req: Request, res: Response) => {
  try {
    let product: IProduct = await Product.findById(req.params._id);

    if (!product) {
      res.status(404).json({ errors: [{ msg: 'product not found' }] });
    }
    res.json(product);
  } catch (err: any) {
    console.log(err.message);
    res.status(500).send('server errorr');
  }
});

//delete product by id
router.delete('/:_id', async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndRemove(req.params._id);

    res.json({ errors: [{ msg: 'product deleted' }] });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

//add review to the product
router.put(
  '/review/add/:p_id',
  [auth, [check('rating', 'rating is required').not().isEmpty()]],
  async (req: IRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    const { rating, comment } = req.body;
    try {
      const user: IUser = await User.findById(req.user.id).select('-password');
      const product: IProduct = await Product.findById(req.params.p_id);

      const newReview: IReview = {
        rating: rating,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      if (comment) {
        newReview.comment = comment;
      }

      product.reviews.unshift(newReview);
      await product.save();
      res.json(product.reviews);
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

//delete review
router.put('/review/remove/:p_id/:r_id', auth, async (req: IRequest, res: Response) => {
  try {
    const product: IProduct = await Product.findById(req.params.p_id);

    // pull out the post
    const review = product.reviews.find(
      (review) => review.id === req.params.r_id
    );

    //Make sure review exists
    if (!review) {
      return res.status(404).json({ msg: 'review deos not exists' });
    }

    //check user
    if (review.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'user not autherized' });
    }

    //get remove index
    const removeIndex = product.reviews
      .map((review) => review._id.toString())
      .indexOf(req.params.r_id);

    product.reviews.splice(removeIndex, 1);
    await product.save();
    res.json(product.reviews);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

router.get('/review/:p_id', async (req: Request, res: Response) => {
  try {
    let product: IProduct = await Product.findById(req.params.p_id);

    if (!product.reviews) {
      res.status(404).json({ msg: 'review not found in this product' });
    }

    res.json(product.reviews);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});
