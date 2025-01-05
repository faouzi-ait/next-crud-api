/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { Types } from "mongoose";

import User from "../../../lib/models/users";
import connect from "../../../lib/db";

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const userId = params.id;

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid userId", { status: 400 });
    }

    await connect();

    const user = await User.findById(new Types.ObjectId(userId)).lean();

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      "Error retrieving the user data: " + error.message,
      {
        status: 500,
      }
    );
  }
};
