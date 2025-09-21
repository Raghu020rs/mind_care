import React, { useState, useEffect } from 'react'; // Added { useState, useEffect }
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../context/AuthContext'; // Added import for useAuth
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import AIChat from '../components/AIChat';



const ProfessionalDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [availability, setAvailability] = useState<string[]>([]);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [newAvailability, setNewAvailability] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'professional') {
      fetchProfessionalBookings();
      fetchAvailability();
    }
  }, [user]);
    const fetchAvailability = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/availability/${user?.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setAvailability(data);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const updateAvailability = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/availability/${user?.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            availability: [...availability, newAvailability].filter(item => item.trim() !== '')
          }),
        }
      );

      if (response.ok) {
        setNewAvailability('');
        setShowAvailabilityModal(false);
        fetchAvailability();
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const removeAvailability = async (slot: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/availability/${user?.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            availability: availability.filter(item => item !== slot)
          }),
        }
      );

      if (response.ok) {
        fetchAvailability();
      }
    } catch (error) {
      console.error('Error removing availability:', error);
    }
  };
  const fetchProfessionalBookings = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/professional/${user?.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        fetchProfessionalBookings(); // Refresh bookings
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading bookings...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{bookings.length}</p>
              <p className="text-muted-foreground">Total Appointments</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                Pending: {bookings.filter((b: any) => b.status === 'pending').length}
              </p>
              <p className="text-sm">
                Confirmed: {bookings.filter((b: any) => b.status === 'confirmed').length}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
  <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <button 
              onClick={() => setShowAvailabilityModal(true)}
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
            >
              Manage Availability
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Support</CardTitle>
          </CardHeader>
          <CardContent>
            <AIChat />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Crisis Hotline:</strong> 988 (Suicide & Crisis Lifeline)</p>
              <p><strong>Text Line:</strong> Text HOME to 741741</p>
              <p><strong>Emergency:</strong> 911 or your local emergency number</p>
              <p className="text-muted-foreground">
                Remember: This AI is for support only, not emergency care.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No appointments scheduled yet
            </p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking: any) => (
                <div key={booking._id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{booking.userId?.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.date).toLocaleString()}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  {booking.status === 'pending' && (
                    <div className="space-x-2">
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                        className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {showAvailabilityModal && (
        <Card>
          <CardHeader>
            <CardTitle>Manage Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Current Availability:</h4>
              {availability.length === 0 ? (
                <p className="text-muted-foreground">No availability set</p>
              ) : (
                <div className="space-y-1">
                  {availability.map((slot, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                      <span>{slot}</span>
                      <button
                        onClick={() => removeAvailability(slot)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Add Time Slot</label>
              <Input
                type="text"
                placeholder="e.g., Monday 9:00 AM - 12:00 PM"
                value={newAvailability}
                onChange={(e) => setNewAvailability(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={updateAvailability}>
                Add Slot
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAvailabilityModal(false)}
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default ProfessionalDashboard;