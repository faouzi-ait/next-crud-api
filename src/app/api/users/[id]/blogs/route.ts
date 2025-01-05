import { NextResponse } from "next/server";
import connect from "../../../../lib/db";
import Blogs from "../../../../lib/models/blogs";
import { Types } from "mongoose";

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    console.log(id);

    if (!Types.ObjectId.isValid(id)) {
      return new NextResponse("Invalid userId", { status: 400 });
    }

    await connect();

    const blogs = await Blogs.find({ user: id }).lean();

    if (blogs.length === 0) {
      return new NextResponse("No blogs found for this user", { status: 404 });
    }

    return new NextResponse(JSON.stringify(blogs), { status: 200 });
  } catch (error: any) {
    console.error("Error retrieving blogs:", error);
    return new NextResponse("Error retrieving the blogs: " + error.message, {
      status: 500,
    });
  }
};
