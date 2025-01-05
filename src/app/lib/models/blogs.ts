import { Schema, model, models } from "mongoose";

const BlogsSchema = new Schema(
  {
    description: { type: String, required: true },
    title: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Blogs = models.Blogs || model("Blogs", BlogsSchema);

export default Blogs;
