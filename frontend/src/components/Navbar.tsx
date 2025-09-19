import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">MindWell</h1>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-sm">Welcome, {user.name}</span>
              <span className="text-sm bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                {user.role}
              </span>
              <Button variant="secondary" onClick={logout} className="text-sm">
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;