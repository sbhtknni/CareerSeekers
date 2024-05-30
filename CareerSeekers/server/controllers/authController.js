import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 12);
    const user = new User({ username, email, password: hashedPassword});
    try {
        await user.save();
        res.status(201).json('User created successfully!');
    }catch(err){
        next(err);
    }
};