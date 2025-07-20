import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: "ID token is required" }, { status: 400 });
    }

    // Verify the Google ID token
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    
    if (!response.ok) {
      return NextResponse.json({ error: "Invalid ID token" }, { status: 401 });
    }

    const tokenInfo = await response.json();
    
    // Check if user exists in database
    let user = await prisma.user.findUnique({
      where: { email: tokenInfo.email },
      include: { userData: true },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: tokenInfo.email,
          name: tokenInfo.name || tokenInfo.email,
          image: tokenInfo.picture,
        },
        include: { userData: true },
      });
    }

    // Create or get user data
    if (!user.userData) {
      await prisma.userData.create({
        data: {
          userId: user.id,
          profileImage: user.image || '',
          weight: 0,
          height: 0,
          age: 0,
          gender: 'other',
          activityLevel: 'moderate',
          dietType: 'balanced',
          goal: 'lose_weight',
        },
      });
    }

    // Generate a JWT token for mobile app
    const mobileToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name 
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
      token: mobileToken,
    });

  } catch (error) {
    console.error("Mobile auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
} 