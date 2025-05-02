const Address = require('../models/Address');


// @desc    Create a new address
const createAddress = async (req, res) => {
    try {
        const { street, city, state, postalCode, country } = req.body;

        if (!street || !city || !state || !postalCode || !country) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if the address already exists for the user
        const existingAddress = await Address.findOne({ user: req.user._id, street, city, state, postalCode, country });
        if (existingAddress) {
            return res.status(400).json({ message: 'Address already exists' });
        }

        const address = new Address({
            user: req.user._id,
            street,
            city,
            state,
            postalCode,
            country
        });

        const savedAddress = await address.save();
        res.status(201).json({ message: "Address created successfully", address: savedAddress });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Server error' });
    }
}

// @desc    Get all addresses for a user
const getAllAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user._id });
        res.status(200).json(addresses);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Server error' });
    }
}

// @desc    Update an address
const updateAddress = async (req, res) => {
    try {
        const { street, city, state, postalCode, country } = req.body;

        if (!street || !city || !state || !postalCode || !country) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const address = await Address.findByIdAndUpdate(req.params.id, {
            street,
            city,
            state,
            postalCode,
            country
        }, { new: true });

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.status(200).json({ message: "Address updated successfully", address });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Server error' });
    }
}

// @desc    Delete an address
const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findByIdAndDelete(req.params.id);

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.status(200).json({ message: "Address deleted successfully" });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Server error' });
    }
}

// @desc export all functions
module.exports = {
    createAddress,
    getAllAddresses,
    updateAddress,
    deleteAddress
}