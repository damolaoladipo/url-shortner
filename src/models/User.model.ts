import mongoose, { Schema, Types, Model } from "mongoose";
import slug from "slugify";
import { IUserDoc } from "../utils/interface.util";
import slugify from "slugify";
import bcrypt, { genSalt, compare } from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new Schema(
  {
    avatar: {
      type: String,
      default: "",
    },

    username: {
      type: String,
      unique: [true, "username already exits"],
      maxLength: [12, "username cannot be more than 8 characters"],
    },

    email: {
      type: String,
      unique: [true, "user already exists"],
    },

    password: {
      type: String,
      default: "",
      select: false,
    },

    slug: {
      type: String,
      default: "",
    },

    firstName: {
      type: String,
      default: "",
    },

    lastName: {
      type: String,
      default: "",
    },

    phoneNumber: {
      type: String,
      default: "",
    },
    phoneCode: {
      type: String,
      default: "+234",
    },

    roles: [
      {
        type: Schema.Types.Mixed,
        ref: "Role",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: "_version",
    toJSON: {
      transform(doc: any, ret) {
        ret.id = ret._id;
      },
    },
  }
);

// Enable virtuals and getters for JSON serialization
UserSchema.set("toJSON", { virtuals: true, getters: true });

// Pre-save hook for password hashing and slug generation
UserSchema.pre<IUserDoc>("save", async function (next) {
  
  if (this.isModified("password")) {
    const salt = await genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  this.slug = slugify(this.email, { lower: true, replacement: "-" });

  next();
});

// Method to check if the entered password matches the stored hash
UserSchema.methods.matchPassword = async function (password: string) {
  let result: boolean = false;
  if (this.password && this.password !== "") {
    result = await bcrypt.compare(password, this.password);
  }
  return result;
};

// Method to generate JWT token
UserSchema.methods.getAuthToken = async function () {
  const secret = process.env.JWT_SECRET;
  const expire = process.env.JWT_EXPIRE;
  let token: string = "";

  if (secret) {
    token = jwt.sign(
      { id: this._id, email: this.email, roles: this.roles },
      secret,
      {
        algorithm: "HS512",
        expiresIn: expire,
      }
    );
  }

  return token;
};

// Static method to get all users
UserSchema.statics.getUsers = async () => {
  return await User.find({});
};

// Method to find user by ID
UserSchema.methods.findById = async (id: any) => {
  const user = await User.findOne({ _id: id });
  return User ? User : null;
};

// define the model name
const User: Model<IUserDoc> = mongoose.model<IUserDoc>("User", UserSchema);

export default User;
