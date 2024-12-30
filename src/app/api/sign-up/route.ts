import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { username, email, password } = await request.json();

    // Check for existing verified user with the same username
    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUserByUsername) {
      return new Response('Username is already taken', { status: 400 });
    }

    // Check for existing user with the same email
    const existingUserByEmail = await UserModel.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return new Response('User already exists with this email', { status: 400 });
      } else {
        // Update existing user's password and verification code
        existingUserByEmail.password = await bcrypt.hash(password, 10);
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        try {
          await existingUserByEmail.save();
        } catch (error) {
          console.error('Error updating existing user:', error);
          return new Response('Error registering user', { status: 500 });
        }
      }
    } else {
      // Create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      try {
        await newUser.save();
      } catch (error) {
        console.error('Error saving new user:', error);
        return new Response('Error registering user', { status: 500 });
      }
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      console.error('Error sending verification email:', emailResponse.message);
      return new Response('Error sending verification email', { status: 500 });
    }

    return new Response('User registered successfully. Please verify your account.', { status: 201 });
  } catch (error) {
    console.error('Unhandled error:', error);
    return new Response('Error registering user', { status: 500 });
  }
} 