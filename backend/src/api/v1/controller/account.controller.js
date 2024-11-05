import Account from "../models/account.js"; // Adjust the path as needed
import User from "../models/user.js"; // Adjust the path as needed
import Role from "../models/role.js";

// Get account details by ID
export const getAccountDetailsHandler = async (req, res) => {
  const accountId = req.params.id;

  try {
    // Find the account by ID and populate roles only
    const account = await Account.findById(accountId)
      .populate("roles", "name"); // Populate role names

    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found." });
    }

    // Find the user document that references this account
    const user = await User.findOne({ account_id: accountId }, "email phone"); // Select only email and phone fields

    // Build the flattened response structure with account and user details
    return res.status(200).json({
      success: true,
      data: {
        accountId: account._id,
        username: account.username,
        roles: account.roles.map(role => role.name),
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
        email: user ? user.email : null,  // Flattened email
        phone: user ? user.phone : null,  // Flattened phone
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update account details by ID
export const updateAccountDetailsHandler = async (req, res) => {
  const accountId = req.params.id;
  const updateData = { ...req.body }; // Create a copy for modification

  try {
    // Find the account by ID
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found." });
    }

    // Check if the user is authorized to update this account
    if (req.account_id.toString() !== accountId) {
      return res.status(403).json({ success: false, message: "You are not authorized to update this account." });
    }

    // Optional: Remove fields that shouldn't be updated
    delete updateData.roles; // Do not allow role updates through this endpoint
    delete updateData.password; // Do not allow password updates through this endpoint

    // Check if email or phone is being updated, and retrieve user associated with the account
    const user = await User.findOne({ account_id: accountId });

    if (user) {
      // Include email and phone in the updateData if provided
      if (req.body.email) {
        updateData.email = req.body.email;
      }
      if (req.body.phone) {
        updateData.phone = req.body.phone;
      }

      // Update the user document
      await User.findByIdAndUpdate(user._id, { email: updateData.email, phone: updateData.phone }, { new: true, runValidators: true });
    }

    // Update the account document
    const updatedAccount = await Account.findByIdAndUpdate(accountId, updateData, { new: true, runValidators: true });

    return res.status(200).json({
      success: true,
      data: {
        accountId: updatedAccount._id,
        username: updatedAccount.username,
        createdAt: updatedAccount.createdAt,
        updatedAt: updatedAccount.updatedAt,
        email: user ? user.email : null,  // Flattened email
        phone: user ? user.phone : null,  // Flattened phone
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Delete account by ID
export const deleteAccountHandler = async (req, res) => {
  const accountId = req.params.id;

  try {
    // Find the account by ID
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found." });
    }

    // Optionally delete associated user data if necessary
    const deletedUsers = await User.deleteMany({ account_id: accountId });

    // Delete the account
    await Account.findByIdAndDelete(accountId);
    
    // Return the deleted account information
    return res.status(200).json({
      success: true,
      message: "Account deleted successfully.",
      data: {
        accountId: account._id,
        username: account.username,
      },
      deletedUsers: deletedUsers.deletedCount // Return count of deleted users, if needed
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// List all accounts
export const listOrSearchAccountsHandler = async (req, res) => {
  const { username, page = 1, limit = 10 } = req.query; // Get username for search and pagination parameters
  const skip = (page - 1) * limit; // Calculate the number of documents to skip

  try {
    const query = {};
    if (username) {
      query.username = { $regex: username, $options: "i" }; // Case-insensitive search
    }

    const accounts = await Account.find(query)
      .populate("roles", "name")
      .skip(skip)
      .limit(parseInt(limit)) // Use the limit from query, parsed to integer
      .exec();

    const totalAccounts = await Account.countDocuments(query); // Count total documents matching the query

    // Retrieve user data for the accounts
    const userIds = accounts.map(account => account._id); // Get account IDs to find corresponding users
    const users = await User.find({ account_id: { $in: userIds } }, "account_id email phone"); // Get all users for the accounts

    // Map users to a dictionary for quick access
    const userMap = users.reduce((acc, user) => {
      acc[user.account_id] = user; // Create a mapping of account_id to user object
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      total: totalAccounts, // Total number of accounts
      count: accounts.length, // Number of accounts in the current response
      totalPages: Math.ceil(totalAccounts / limit), // Total number of pages
      currentPage: parseInt(page), // Current page
      data: accounts.map(account => ({
        accountId: account._id,
        username: account.username,
        roles: account.roles.map(role => role.name),
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
        email: userMap[account._id] ? userMap[account._id].email : null,  // Flattened email
        phone: userMap[account._id] ? userMap[account._id].phone : null,  // Flattened phone
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



// Manage account roles
export const manageAccountRolesHandler = async (req, res) => {
  const accountId = req.params.id;
  const { add, remove } = req.body; // Using "add" and "remove" for single purpose

  try {
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found." });
    }

    // Fetch the admin role from the roles collection
    const adminRole = await Role.findOne({ name: "admin" }); // Get the admin role
    const adminRoleId = adminRole ? adminRole._id : null;

    // Add the admin role if specified
    if (add && adminRoleId && !account.roles.includes(adminRoleId)) {
      account.roles.push(adminRoleId); // Add the admin role if not already present
    }

    // Remove the admin role if specified
    if (remove && adminRoleId) {
      account.roles = account.roles.filter(roleId => !roleId.equals(adminRoleId)); // Remove the admin role
    }

    await account.save();

    // Fetch the role names based on the updated roles
    const roles = await Role.find({ _id: { $in: account.roles } }); // Find roles by their IDs
    const roleNames = roles.map(role => role.name); // Extract role names

    return res.status(200).json({
      success: true,
      data: {
        accountId: account._id,
        roles: roleNames, // Return the names of the roles
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

