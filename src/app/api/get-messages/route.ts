import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(request: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the user session
    const session = await getServerSession(authOptions);

    console.log('Session:', session); // Debug log to check session data

    if (!session || !session.user) {
      console.log('Session or user not found');
      return new Response(
        JSON.stringify({ success: false, message: 'Not authenticated' }),
        { status: 401 }
      );
    }

    const _user: User = session.user;
    console.log('Authenticated User:', _user);

    // Convert the user's ID to a MongoDB ObjectId
    const userId = new mongoose.Types.ObjectId(_user._id);
    console.log('User ID:', userId); // Debug log to check if the ID is valid

    // Aggregate messages for the user
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } },
    ]).exec();

    if (!user || user.length === 0) {
      console.log('User not found in database');
      return new Response(
        JSON.stringify({ success: false, message: 'User not found' }),
        { status: 404 }
      );
    }

    // Log the fetched user data
    console.log('User data:', user);

    // Return the user's messages
    return new Response(
      JSON.stringify({ success: true, messages: user[0].messages }),
      { status: 200 }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500 }
    );
  }
}
