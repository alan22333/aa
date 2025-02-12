import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const expenses = await prisma.expense.findMany({
      where: {
        tripId: params.id
      },
      include: {
        paidBy: true,
        participants: {
          include: {
            user: true
          }
        }
      }
    });
    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const data = await request.json();
    const { description, amount, date, paidById, participantIds } = data;
    
    const expense = await prisma.expense.create({
      data: {
        description,
        amount: parseFloat(amount),
        date: new Date(date),
        tripId: params.id,
        paidById,
        participants: {
          create: participantIds.map(userId => ({
            userId,
            share: parseFloat(amount) / participantIds.length
          }))
        }
      },
      include: {
        paidBy: true,
        participants: {
          include: {
            user: true
          }
        }
      }
    });
    
    return NextResponse.json(expense);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 