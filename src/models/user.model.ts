import { Schema, model } from "mongoose"

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  emailConfirmed: {
    type: Boolean,
    default: false,
  },

  emailConfirmationCode: {
    type: String,
    default: null,
  },

  resetPasswordPermissionCode: {
    type: String,
    default: null,
  },

  resetPasswordExpiredAt: {
    type: Date,
    default: null,
  },

  verificationCode: {
    type: String,
    default: null,
  },

  verificationCodeExpiredAt: {
    type: Date,
    default: null,
  },

  refreshToken: {
    type: [String],
    default: [],
  },
})

export const User = model("User", UserSchema)
