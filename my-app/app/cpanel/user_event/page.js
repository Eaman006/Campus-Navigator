"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Trash2 } from "lucide-react";

function Page() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [isLoadingAttendees, setIsLoadingAttendees] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const response = await fetch('http://localhost:5000/user/events/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      console.log('Events data:', data);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch attendees for a specific event
  const fetchAttendees = async (eventId) => {
    setIsLoadingAttendees(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const response = await fetch(`http://localhost:5000/user/events/${eventId}/attendees`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to fetch attendees');
      }

      const data = await response.json();
      setAttendees(data);
      setSelectedEvent(eventId);
    } catch (error) {
      console.error('Error fetching attendees:', error);
      alert(error.message);
    } finally {
      setIsLoadingAttendees(false);
    }
  };

  const handleDelete = async (eventId) => {
    const eventToDelete = events.find(event => event.id === eventId);
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the event "${eventToDelete.title}"?\n\n` +
      `Date: ${eventToDelete.date}\n` +
      `Time: ${eventToDelete.time}\n` +
      `Location: ${eventToDelete.location}\n\n` +
      `This action cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const response = await fetch(`http://localhost:5000/user/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to delete event');
      }

      // Remove the deleted event from the state
      setEvents(events.filter(event => event.id !== eventId));
      alert(`Event "${eventToDelete.title}" has been successfully deleted.`);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <div className="text-red-600 font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="text-black pl-20 p-4">
      <h1 className="text-2xl font-bold mb-6">User Registered Events</h1>
      
      {events.length === 0 ? (
        <div className="text-center text-gray-500">No events found</div>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white p-4 rounded-lg shadow-md relative">
              <button
                onClick={() => handleDelete(event.id)}
                className="absolute top-4 right-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                title="Delete event"
              >
                <Trash2 size={20} />
              </button>
              <div 
                className="cursor-pointer"
                onClick={() => fetchAttendees(event.id)}
              >
                <h2 className="text-xl font-semibold mb-2 pr-8">{event.title}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Date: {event.date}</p>
                    <p className="text-gray-600">Time: {event.time}</p>
                    <p className="text-gray-600">Location: {event.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Capacity: {event.capacity}</p>
                    <p className="text-gray-600">Start Time: {event.start_time}</p>
                    <p className="text-gray-600">End Time: {event.end_time}</p>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{event.description}</p>
              </div>

              {/* Attendees Section */}
              {selectedEvent === event.id && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-semibold mb-2">Attendees</h3>
                  {isLoadingAttendees ? (
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
                    </div>
                  ) : attendees.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="py-2 px-4 border-b text-left">Name</th>
                            <th className="py-2 px-4 border-b text-left">Email</th>
                            <th className="py-2 px-4 border-b text-left">Registration Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendees.map((attendee, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="py-2 px-4 border-b">{attendee.attendee_name}</td>
                              <td className="py-2 px-4 border-b">{attendee.attendee_email}</td>
                              <td className="py-2 px-4 border-b">{new Date(attendee.registration_date).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">No attendees found for this event.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Page;
