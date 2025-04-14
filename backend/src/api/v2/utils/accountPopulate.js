export const populateAccountInfo = () => ({
  path: "account_id",
  select: "-password -otp -otpExpiration -otpVerified",
  populate: { path: "roles", select: "name" },
});
