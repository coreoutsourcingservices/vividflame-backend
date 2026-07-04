import { Address } from "../model/addresses.js";


// Add Address
export const addAddress = async (req, res) => {
  try {
    const { user, address } = req.body;

    let userAddress = await Address.findOne({ user });

    if (userAddress) {
      userAddress.addresses.push(address);
      await userAddress.save();
    } else {
      userAddress = await Address.create({
        user,
        addresses: [address],
      });
    }

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: userAddress,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get All Addresses
export const getAddresses = async (req, res) => {
  try {
    const { user } = req.params;

    const addresses = await Address.findOne({ user }).populate("user");

    if (!addresses) {
      return res.status(404).json({
        success: false,
        message: "No addresses found",
      });
    }

    return res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Update Address
export const updateAddress = async (req, res) => {
  try {
    const { user, addressId } = req.params;

    const updated = await Address.findOneAndUpdate(
      {
        user,
        "addresses._id": addressId,
      },
      {
        $set: {
          "addresses.$": req.body,
        },
      },
      {
        new: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Delete Address
export const deleteAddress = async (req, res) => {
  try {
    const { user, addressId } = req.params;

    const deleted = await Address.findOneAndUpdate(
      { user },
      {
        $pull: {
          addresses: {
            _id: addressId,
          },
        },
      },
      {
        new: true,
      }
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: deleted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};