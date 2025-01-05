import { NextResponse } from "next/server";
import { Types } from "mongoose";

import connect from "@/app/lib/db";
import Blogs from "@/app/lib/models/blogs";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const keyword = searchParams.get("keyword");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "2");

    const skip = (page - 1) * limit;

    await connect();

    let query = {};

    if (keyword) {
      query = { $text: { $search: keyword } };
    }

    if (startDate && endDate) {
      query = {
        ...query,
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    const totalBlogs = await Blogs.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit);

    let blogs = await Blogs.find(query)
      // .populate("user")
      .skip(skip)
      .limit(limit);

    blogs = blogs.sort(
      (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
    );

    return new NextResponse(JSON.stringify({ blogs, totalPages, page }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Error while fetching blogs: " + error, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();
    const blog = new Blogs(body);
    await blog.save();

    return new NextResponse(
      JSON.stringify({ message: "User is created", blog }),
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return new NextResponse("Error creating a new user" + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const body = await request.json();
    const { blogId } = body;

    if (!blogId) {
      return new NextResponse("Blog ID is required", {
        status: 400,
      });
    }

    await connect();

    const deletedBlog = await Blogs.findByIdAndDelete(
      new Types.ObjectId(blogId)
    );

    if (!deletedBlog) {
      return new NextResponse("User not found", { status: 404 });
    }

    return new NextResponse(
      "Deletion Successful" + JSON.stringify(deletedBlog),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error deleting the blog " + error.message, {
      status: 500,
    });
  }
};
