import HandleError from "../helpers/HandleError.js";
import User from "../models/userModel.js";

// get all users
export const getAdminUsers = async (req, res, next) => {
    const users = await User.find();
    if (!users) return next(new HandleError('No users are found', 400));
    res.status(200).json({ success: true, users });
};

// getting a single user
export const getAdminSingleUser = async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return next(new HandleError(`User doesn't exist`, 400));
    res.status(200).json({ success: true, user });
};

// update user role
export const updateUserRole = async (req, res, next) => {
    const { id } = req.params;
    const { role } = req.body;
    const updatedRole = { role };

    const user = await User.findByIdAndUpdate(id, updatedRole, { returnDocument: 'after' });
    if (!user) return next(new HandleError(`User doesn't exist`, 400));
    res.status(200).json({ success: true, message: 'User role updated successfully', user });
};

// delete user
export const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return next(new HandleError(`User doesn't exist`, 400));
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: `User ${user.name} details deleted successfully` });
};