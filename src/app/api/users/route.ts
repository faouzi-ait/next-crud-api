/* eslint-disable @typescript-eslint/no-explicit-any */

import { Types } from "mongoose";
import { NextResponse } from "next/server";

import User from "../../lib/models/users";
import connect from "../../lib/db";

export const GET = async () => {
  try {
    const users = await User.find();
    await connect();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new NextResponse("Error while fetching users" + error, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();
    const user = new User(body);
    await user.save();

    return new NextResponse(
      JSON.stringify({ message: "User is created", user }),
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

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, username, email } = body;
    await connect();

    if (!userId || !username) {
      return new NextResponse("userId and username are required", {
        status: 400,
      });
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid userId", {
        status: 400,
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: new Types.ObjectId(userId) },
      { username, email },
      { new: true }
    );

    return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error updating the user data " + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return new NextResponse("userId is required", {
        status: 400,
      });
    }

    await connect();

    const deletedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );

    if (!deletedUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    return new NextResponse(
      "Deletion Successful" + JSON.stringify(deletedUser),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error deleting the user data " + error.message, {
      status: 500,
    });
  }
};
