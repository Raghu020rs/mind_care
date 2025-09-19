import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

const UserDashboard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No upcoming sessions</p>
            <Button className="mt-4">Book Session</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>My Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Track your mental health journey</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Access helpful resources</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default UserDashboard;