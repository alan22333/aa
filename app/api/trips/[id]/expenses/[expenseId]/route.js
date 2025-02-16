import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const expense = await prisma.expense.findUnique({
      where: {
        id: params.expenseId
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

    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const { description, amount, date, paidById, participantIds } = data;

    // 首先删除现有的参与者记录
    await prisma.participant.deleteMany({
      where: {
        expenseId: params.expenseId
      }
    });

    // 更新费用记录并创建新的参与者记录
    const expense = await prisma.expense.update({
      where: {
        id: params.expenseId
      },
      data: {
        description,
        amount: parseFloat(amount),
        date: new Date(date),
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

export async function DELETE(request, { params }) {
  try {
    // 首先删除所有相关的参与者记录
    await prisma.participant.deleteMany({
      where: {
        expenseId: params.expenseId
      }
    });

    // 然后删除费用记录
    await prisma.expense.delete({
      where: {
        id: params.expenseId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 