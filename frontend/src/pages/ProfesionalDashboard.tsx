import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const ProfessionalDashboard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No appointments scheduled</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Client Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">View client progress</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Manage your schedule</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ProfessionalDashboard;