import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const users = await prisma.user.findMany({
      where: {
        trips: {
          some: {
            id: params.id
          }
        }
      }
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const data = await request.json();
    const user = await prisma.user.create({
      data: {
        name: data.name,
        trips: {
          connect: {
            id: params.id
          }
        }
      }
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 