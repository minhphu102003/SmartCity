import Account from "../models/account.js"; // Adjust the path as needed
import User from "../models/user.js"; // Adjust the path as needed

// Get account details by ID
export const getAccountDetailsHandler = async (req, res) => {
  const accountId = req.params.id;

  try {
    const account = await Account.findById(accountId).populate("roles", "name");
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found." });
    }

    return res.status(200).json({
      success: true,
      data: {
        accountId: account._id,
        username: account.username,
        roles: account.roles.map(role => role.name),
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
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
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found." });
    }

    // Optional: Remove fields that shouldn't be updated
    delete updateData.password; // Do not allow password updates through this endpoint

    const updatedAccount = await Account.findByIdAndUpdate(accountId, updateData, { new: true, runValidators: true });

    return res.status(200).json({
      success: true,
      data: {
        accountId: updatedAccount._id,
        username: updatedAccount.username,
        roles: updatedAccount.roles.map(role => role.name),
        createdAt: updatedAccount.createdAt,
        updatedAt: updatedAccount.updatedAt,
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
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found." });
    }

    // Optionally delete associated user data if necessary
    await User.deleteMany({ account_id: accountId });

    await Account.findByIdAndDelete(accountId);
    
    return res.status(200).json({ success: true, message: "Account deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// List all accounts
export const listAccountsHandler = async (req, res) => {
  try {
    const accounts = await Account.find().populate("roles", "name");
    return res.status(200).json({
      success: true,
      data: accounts.map(account => ({
        accountId: account._id,
        username: account.username,
        roles: account.roles.map(role => role.name),
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Search accounts based on query parameters
export const searchAccountsHandler = async (req, res) => {
  const { username } = req.query; // Example: search by username

  try {
    const query = {};
    if (username) {
      query.username = { $regex: username, $options: "i" }; // Case-insensitive search
    }

    const accounts = await Account.find(query).populate("roles", "name");
    
    return res.status(200).json({
      success: true,
      data: accounts.map(account => ({
        accountId: account._id,
        username: account.username,
        roles: account.roles.map(role => role.name),
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Manage account roles
export const manageAccountRolesHandler = async (req, res) => {
  const accountId = req.params.id;
  const { roles } = req.body; // Expected to be an array of role IDs

  try {
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found." });
    }

    account.roles = roles; // Update roles
    await account.save();

    return res.status(200).json({
      success: true,
      data: {
        accountId: account._id,
        roles: account.roles,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
