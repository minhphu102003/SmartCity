import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const accountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },
    otpExpiration: {
      type: Date,
    },
    otpVerified: { 
      type: Boolean,
      default: false,
    },
    tokens: [{ type: Object }],
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

accountSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

accountSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword);
};

accountSchema.pre("save", async function (next) {
  const account = this;
  if (!account.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(account.password, 10);
  account.password = hash;
  next();
})

accountSchema.methods.setOTP = async function() {
  this.otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry

  await this.save();
  return this.otp;
};

accountSchema.methods.validateOTP = async function( enteredOTP) {
  if (!this.otp || !this.otpExpiration) return false;

  const isOtpValid = this.otp === enteredOTP && this.otpExpiration > Date.now();

  if (isOtpValid) {
    this.otp= null;
    this.otpExpiration = null;
    await this.save();
  }

  return isOtpValid;
};

export default mongoose.model("Account", accountSchema);
