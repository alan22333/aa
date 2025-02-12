import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const trip = await prisma.trip.findUnique({
      where: {
        id: params.id
      },
      include: {
        users: true,
        expenses: {
          include: {
            paidBy: true,
            participants: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 