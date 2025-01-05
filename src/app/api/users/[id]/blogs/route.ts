/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { Types } from "mongoose";

import connect from "../../../../lib/db";
import Blogs from "../../../../lib/models/blogs";

export const GET = async (request: NextRequest) => {
  try {
    const { pathname } = request.nextUrl;
    const userId = pathname.split("/").slice(-2, -1)[0];

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid userId", { status: 400 });
    }

    await connect();

    const blogs = await Blogs.find({ user: userId }).lean();

    if (blogs.length === 0) {
      return new NextResponse("No blogs found for this user", { status: 404 });
    }

    return new NextResponse(JSON.stringify(blogs), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error retrieving the blogs: " + error.message, {
      status: 500,
    });
  }
};
