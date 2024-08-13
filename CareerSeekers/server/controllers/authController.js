import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 12);
    const user = new User({ username, email, password: hashedPassword });
    try {
        await user.save();
        res.status(201).json('User created successfully!');
    } catch (error) {
        // if response conatain 'E11000 duplicate key error' return email already exists
        if (error.message.includes('E11000 duplicate key error')) {
            return next(errorHandler(400, 'Email already exists!'));
        }
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'User not found'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, 'Wrong email or password'));
        }
        // create a token for the user based on the user id in the database
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        // remove password from the user object
        const { password: pass, ...rest } = validUser._doc;
        // send the token in a cookie
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);

    } catch (error) {
        next(error);
    }
}

export const signout = (req, res, next) => {
    try {
        res.clearCookie('access_token').json('User signed out successfully!');
    } catch (error) {
        next(error);
    }
}

export const google = async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      // if user exists, sign in the user
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = user._doc;
        res
          .cookie('access_token', token, { httpOnly: true })
          .status(200)
          .json(rest);
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({
          username:
            req.body.name.split(' ').join('').toLowerCase() +
            Math.random().toString(36).slice(-4),
          email: req.body.email,
          password: hashedPassword,
          avatar: req.body.photo,
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = newUser._doc;
        res
          .cookie('access_token', token, { httpOnly: true })
          .status(200)
          .json(rest);
      }
    } catch (error) {
      next(error);
    }
  };

  export const forgotPassword = async (req, res, next) => {
    const email = req.body.email;
    try {
      const user = await User.findOne({
        email,
      });
      if (!user) {
        return next(errorHandler(404, 'User not found'));
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '10m',
      });
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
      var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Password Reset',
        html: `
        <h2>Please click on the link below to reset your password</h2>
        <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
        `,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          res.status(200).json('Email sent: ' + info.response);
        }
      });
    }
    catch (error) {
      next(error);
    }
  };

  export const resetPassword = async (req, res, next) => {
    const token = req.params.token;
    const { password } = req.body;
    const id = req.params.id;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.id === id) {
        const hashedPassword = bcryptjs.hashSync(password, 12);
        await User.findByIdAndUpdate(id, { password: hashedPassword });
        res.status(200).json('Password reset successfully!');
      }
    }
    catch (error) {
      next(error);
    }
  }
  

