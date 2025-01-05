/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse, NextRequest } from "next/server";
import { Types } from "mongoose";

import Blogs from "../../../lib/models/blogs";
import connect from "../../../lib/db";

export const GET = async (
  request: NextRequest,
  context: { params: { id: string } }
) => {
  try {
    const blogId = context.params.id;

    if (!Types.ObjectId.isValid(blogId)) {
      return new NextResponse("Invalid Blog ID", { status: 400 });
    }

    await connect();

    const blog = await Blogs.findById(new Types.ObjectId(blogId)).lean();

    if (!blog) {
      return new NextResponse("User not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(blog), { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};