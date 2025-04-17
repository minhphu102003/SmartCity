import {
  createAccountReportReview,
  getAccountReportReviews,
  deleteAccountReportReview,
  getAccountReportReviewById,
  updateAccountReportReview,
} from "../services/accountReportReview.service.js";

export const createAccountReportReviewController = async (req, res, next) => {
  try {
    const { accountReport_id, reason } = req.body;

    const newReview = await createAccountReportReview({
      accountReport_id,
      reason,
      account_id: req.account_id,
    });

    return res.status(201).json({
      success: true,
      message: "Account report review created successfully",
      data: newReview,
    });
  } catch (error) {
    console.error("Error creating account report review:", error);
    next(error);
  }
};

export const getAccountReportReviewsController = async (req, res, next) => {
  try {
    const { reviewed_by, status, page = 1, limit = 10 } = req.query;

    const { reviews, totalReports } = await getAccountReportReviews(
      { reviewed_by, status },
      parseInt(page),
      parseInt(limit)
    );

    const formattedReviews = reviews.map((review) => ({
      _id: review._id,
      accountReport_id: review.accountReport_id,
      reason: review.reason,
      status: review.status,
      reviewed_by: review.reviewed_by,
      reviewed_at: review.reviewed_at,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      total: totalReports,
      count: formattedReviews.length,
      totalPages: Math.ceil(totalReports / limit),
      currentPage: parseInt(page),
      data: formattedReviews,
    });
  } catch (error) {
    console.error("Error fetching account report reviews:", error);
    next(error);
  }
};

export const getAccountReportReviewByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await getAccountReportReviewById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Account report review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account report review fetched successfully",
      data: review,
    });
  } catch (error) {
    console.error("Error fetching account report review:", error);
    next(error);
  }
};

export const updateAccountReportReviewController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason, status } = req.body;

    const updatedReview = await updateAccountReportReview(id, {
      reason,
      status,
    });

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Account report review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account report review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    console.error("Error updating account report review:", error);
    next(error);
  }
};

export const deleteAccountReportReviewController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedReview = await deleteAccountReportReview(id);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Account report review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account report review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account report review:", error);
    next(error);
  }
};
