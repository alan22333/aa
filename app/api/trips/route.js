import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      orderBy: {
        startDate: 'desc'
      }
    });
    return NextResponse.json(trips);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const trip = await prisma.trip.create({
      data: {
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate)
      }
    });
    return NextResponse.json(trip);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 