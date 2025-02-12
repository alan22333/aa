'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function TripDetail() {
  const params = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState(null);
  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [newUser, setNewUser] = useState({ name: '' });
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    date: '',
    paidById: '',
    participantIds: []
  });

  useEffect(() => {
    fetchTripDetails();
    fetchUsers();
    fetchExpenses();
  }, [params.id]);

  const fetchTripDetails = async () => {
    const response = await fetch(`/api/trips/${params.id}`);
    const data = await response.json();
    setTrip(data);
  };

  const fetchUsers = async () => {
    const response = await fetch(`/api/trips/${params.id}/users`);
    const data = await response.json();
    setUsers(data);
  };

  const fetchExpenses = async () => {
    const response = await fetch(`/api/trips/${params.id}/expenses`);
    const data = await response.json();
    setExpenses(data);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/trips/${params.id}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });
    if (response.ok) {
      setNewUser({ name: '' });
      fetchUsers();
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/trips/${params.id}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newExpense),
    });
    if (response.ok) {
      setNewExpense({
        description: '',
        amount: '',
        date: '',
        paidById: '',
        participantIds: []
      });
      fetchExpenses();
    }
  };

  // 添加计算费用统计的函数
  const calculateSettlement = () => {
    // 计算每个人支付的总额
    const paidAmounts = {};
    users.forEach(user => {
      paidAmounts[user.id] = expenses
        .filter(expense => expense.paidById === user.id)
        .reduce((sum, expense) => sum + expense.amount, 0);
    });

    // 计算每个人应付的总额
    const owedAmounts = {};
    users.forEach(user => {
      owedAmounts[user.id] = expenses.reduce((sum, expense) => {
        const participant = expense.participants.find(p => p.userId === user.id);
        return sum + (participant ? participant.share : 0);
      }, 0);
    });

    // 计算每个人的最终余额（正数表示应收，负数表示应付）
    const balances = {};
    users.forEach(user => {
      balances[user.id] = paidAmounts[user.id] - owedAmounts[user.id];
    });

    // 生成结算方案
    const settlements = [];
    const debtors = users.filter(user => balances[user.id] < -0.01)
      .sort((a, b) => balances[a.id] - balances[b.id]);
    const creditors = users.filter(user => balances[user.id] > 0.01)
      .sort((a, b) => balances[b.id] - balances[a.id]);

    let debtorIndex = 0;
    let creditorIndex = 0;

    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
      const debtor = debtors[debtorIndex];
      const creditor = creditors[creditorIndex];
      const debtAmount = -balances[debtor.id];
      const creditAmount = balances[creditor.id];
      const transferAmount = Math.min(debtAmount, creditAmount);

      if (transferAmount > 0.01) {
        settlements.push({
          from: debtor,
          to: creditor,
          amount: transferAmount
        });
      }

      balances[debtor.id] += transferAmount;
      balances[creditor.id] -= transferAmount;

      if (Math.abs(balances[debtor.id]) < 0.01) debtorIndex++;
      if (Math.abs(balances[creditor.id]) < 0.01) creditorIndex++;
    }

    return {
      paidAmounts,
      owedAmounts,
      settlements
    };
  };

  if (!trip) {
    return <div>加载中...</div>;
  }

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <button
          onClick={() => router.push('/')}
          className="pixel-button"
        >
          ← BACK
        </button>
        <div className="text-green-400 font-pixel text-sm">
          ID: {params.id}
        </div>
      </div>

      <div className="cyber-header">
        <h1>{trip.name}</h1>
        <p className="highlight-primary text-center">
          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="pixel-card">
            <h2>ADD MEMBER</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-2">
                <label className="block">Name:</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ name: e.target.value })}
                  required
                  className="pixel-input w-full"
                  placeholder="Enter member name"
                />
              </div>
              <button type="submit" className="pixel-button w-full">ADD MEMBER</button>
            </form>
          </div>

          <div className="pixel-card">
            <h2>MEMBERS</h2>
            <div className="flex flex-wrap gap-2">
              {users.map((user) => (
                <span key={user.id} className="pixel-borders-thin inline-block p-2">
                  {user.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pixel-card">
          <h2>ADD EXPENSE</h2>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div className="space-y-2">
              <label className="block">Description:</label>
              <input
                type="text"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                required
                className="pixel-input w-full"
                placeholder="Enter expense description"
              />
            </div>
            <div className="space-y-2">
              <label className="block">Amount:</label>
              <input
                type="number"
                step="0.01"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                required
                className="pixel-input w-full"
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <label className="block">Date:</label>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                required
                className="pixel-input w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="block">Paid By:</label>
              <select
                value={newExpense.paidById}
                onChange={(e) => setNewExpense({ ...newExpense, paidById: e.target.value })}
                required
                className="pixel-input w-full"
              >
                <option value="">Select payer</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block">Participants:</label>
              <div className="grid grid-cols-2 gap-4">
                {users.map((user) => (
                  <label key={user.id} className="flex items-center gap-2 pixel-borders-thin p-2">
                    <input
                      type="checkbox"
                      checked={newExpense.participantIds.includes(user.id)}
                      onChange={(e) => {
                        const updatedParticipants = e.target.checked
                          ? [...newExpense.participantIds, user.id]
                          : newExpense.participantIds.filter(id => id !== user.id);
                        setNewExpense({ ...newExpense, participantIds: updatedParticipants });
                      }}
                    />
                    {user.name}
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="pixel-button w-full">ADD EXPENSE</button>
          </form>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-8">
        <div className="pixel-card">
          <h2>EXPENSE LIST</h2>
          <ul className="space-y-2">
            {expenses.map((expense) => (
              <li key={expense.id} className="pixel-borders-thin p-3">
                <div className="flex justify-between">
                  <span className="highlight-primary">{expense.description}</span>
                  <span className="highlight-accent">¥{expense.amount}</span>
                </div>
                <div className="text-sm highlight-secondary">
                  Paid by: {users.find(u => u.id === expense.paidById)?.name}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="pixel-card">
          <h2>SETTLEMENT</h2>
          {expenses.length > 0 ? (
            <>
              <div className="mb-6">
                <h3>OVERVIEW</h3>
                <div className="grid gap-4">
                  {users.map(user => {
                    const stats = calculateSettlement();
                    const paid = stats.paidAmounts[user.id] || 0;
                    const owed = stats.owedAmounts[user.id] || 0;
                    const balance = paid - owed;
                    return (
                      <div key={user.id} className="pixel-borders-thin p-3">
                        <div className="highlight-primary font-bold mb-2">{user.name}</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Paid: ¥{paid.toFixed(2)}</div>
                          <div>Owed: ¥{owed.toFixed(2)}</div>
                          <div className="col-span-2">
                            Balance: 
                            <span className={balance > 0 ? 'status-positive' : balance < 0 ? 'status-negative' : 'status-neutral'}>
                              ¥{balance.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3>TRANSFERS</h3>
                <ul className="space-y-2">
                  {calculateSettlement().settlements.map((settlement, index) => (
                    <li key={index} className="pixel-borders-thin p-3">
                      <span className="status-negative">{settlement.from.name}</span>
                      {' '}pays{' '}
                      <span className="highlight-primary">¥{settlement.amount.toFixed(2)}</span>
                      {' '}to{' '}
                      <span className="status-positive">{settlement.to.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="status-neutral">No expenses recorded yet</p>
          )}
        </div>
      </div>
    </main>
  );
} 