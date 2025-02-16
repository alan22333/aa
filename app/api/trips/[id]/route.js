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

export async function DELETE(request, { params }) {
  try {
    // 首先删除所有相关的 Participant 记录
    await prisma.participant.deleteMany({
      where: {
        expense: {
          tripId: params.id
        }
      }
    });

    // 然后删除所有相关的 Expense 记录
    await prisma.expense.deleteMany({
      where: {
        tripId: params.id
      }
    });

    // 最后删除 Trip 记录
    await prisma.trip.delete({
      where: {
        id: params.id
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 