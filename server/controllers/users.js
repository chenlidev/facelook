import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

export const getUserFriends = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {_id, firstName, lastName, occupation, location, picturePath};
            }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
};

/* SEARCH */
export const searchUsers = async (req, res) => {
    try {
        // Extract query parameters for first name and last name
        const { firstName, lastName, email } = req.query;

        // Build search criteria based on presence of query parameters
        let searchCriteria = {};
        if (firstName) searchCriteria.firstName = new RegExp(firstName, 'i');
        if (lastName) searchCriteria.lastName = new RegExp(lastName, 'i');
        if (email) searchCriteria.email = new RegExp(email, 'i');

        // Search for users in the database
        const users = await User.find(searchCriteria); // This assumes you have a User model for Mongoose

        // Return the found users
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error searching for users", error: error });
    }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
        const {id, friendId} = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {_id, firstName, lastName, occupation, location, picturePath};
            }
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
};