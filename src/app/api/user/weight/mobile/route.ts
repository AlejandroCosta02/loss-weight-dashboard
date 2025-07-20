import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Verify JWT token and get user
async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    return decoded as { email: string; iat: number; exp: number };
  } catch {
    return null;
  }
}

// GET - Get all weight records for the user (mobile endpoint)
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = await verifyToken(token);
    
    if (!decoded || !decoded.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      include: { userData: true },
    });

    if (!user || !user.userData) {
      return NextResponse.json({ error: "User data not found" }, { status: 404 });
    }

    const dailyWeights = await prisma.dailyWeight.findMany({
      where: { userDataId: user.userData.id },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(dailyWeights);
  } catch (error) {
    console.error('Mobile weight GET error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Add a new weight record (mobile endpoint)
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = await verifyToken(token);
    
    if (!decoded || !decoded.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { date, weight } = body;

    if (!date || !weight) {
      return NextResponse.json({ error: "Date and weight are required" }, { status: 400 });
    }

    if (isNaN(weight) || weight < 30 || weight > 300) {
      return NextResponse.json({ error: "Weight must be between 30 and 300 kg" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      include: { userData: true },
    });

    if (!user || !user.userData) {
      return NextResponse.json({ error: "User data not found" }, { status: 404 });
    }

    // Check if entry already exists for this date
    const existingEntry = await prisma.dailyWeight.findFirst({
      where: {
        userDataId: user.userData.id,
        date: new Date(date + 'T00:00:00'),
      },
    });

    if (existingEntry) {
      return NextResponse.json({ error: "Ya existe un registro para esta fecha" }, { status: 409 });
    }

    // Create new entry
    const dailyWeight = await prisma.dailyWeight.create({
      data: {
        userDataId: user.userData.id,
        date: new Date(date + 'T00:00:00'),
        weight: Number(weight),
      },
    });

    // Update current weight in UserData if this is the latest entry
    const latestEntry = await prisma.dailyWeight.findFirst({
      where: { userDataId: user.userData.id },
      orderBy: { date: 'desc' },
    });

    if (latestEntry && latestEntry.id === dailyWeight.id) {
      await prisma.userData.update({
        where: { id: user.userData.id },
        data: { weight: Number(weight) },
      });
    }

    return NextResponse.json({ success: true, dailyWeight });
  } catch (error) {
    console.error('Mobile weight POST error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
