'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [trips, setTrips] = useState([]);
  const [newTrip, setNewTrip] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    const response = await fetch('/api/trips');
    const data = await response.json();
    setTrips(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/trips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTrip),
    });
    if (response.ok) {
      setNewTrip({ name: '', startDate: '', endDate: '' });
      fetchTrips();
    }
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="cyber-header">
        <h1 className="text-center">TRAVEL EXPENSE SPLITTER</h1>
        <p className="highlight-secondary text-center">Efficiently manage and split travel expenses</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="pixel-card">
          <h2>CREATE TRIP</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block">Trip Name:</label>
              <input
                type="text"
                value={newTrip.name}
                onChange={(e) => setNewTrip({...newTrip, name: e.target.value})}
                required
                className="pixel-input w-full"
                placeholder="Enter trip name"
              />
            </div>
            <div className="space-y-2">
              <label className="block">Start Date:</label>
              <input
                type="date"
                value={newTrip.startDate}
                onChange={(e) => setNewTrip({...newTrip, startDate: e.target.value})}
                required
                className="pixel-input w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="block">End Date:</label>
              <input
                type="date"
                value={newTrip.endDate}
                onChange={(e) => setNewTrip({...newTrip, endDate: e.target.value})}
                required
                className="pixel-input w-full"
              />
            </div>
            <button type="submit" className="pixel-button w-full">CREATE TRIP</button>
          </form>
        </div>

        <div className="pixel-card">
          <h2>TRIP LIST</h2>
          {trips.length === 0 ? (
            <p className="status-neutral">No trips created yet</p>
          ) : (
            <ul className="space-y-2">
              {trips.map((trip) => (
                <li key={trip.id} className="pixel-borders-thin">
                  <Link href={`/trips/${trip.id}`} className="block p-3 hover:bg-pink-500/10 transition-colors">
                    <span className="highlight-primary block">{trip.name}</span>
                    <span className="highlight-secondary text-sm">
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
