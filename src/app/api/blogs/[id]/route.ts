import { NextResponse, NextRequest } from "next/server";
import { Types } from "mongoose";

import Blogs from "../../../lib/models/blogs";
import connect from "../../../lib/db";

export const GET = async (request: NextRequest) => {
  try {
    const { pathname } = request.nextUrl;
    const blogId = pathname.split("/").pop();

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse("Invalid Blog ID", { status: 400 });
    }

    await connect();

    const blog = await Blogs.findById(new Types.ObjectId(blogId)).lean();

    if (!blog) {
      return new NextResponse("Blog not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(blog), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Internal Server Error: " + error.message, {
      status: 500,
    });
  }
};
