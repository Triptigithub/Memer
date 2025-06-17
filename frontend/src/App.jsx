import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Home, Plus, Trophy, Zap } from 'lucide-react';

import MemeList from './components/MemeList';
import MemeForm from './components/MemeForm';
import Leaderboard from './components/Leaderboard';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

          {/* Header */}
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
            <nav className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">

                {/* Logo and title */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                   <h1 className="text-2xl font-bold text-gray-900">MemeHustle</h1>
                  
                    <p className="text-xs text-gray-900 mt-1">MEMES AND MONEY TOGETHER</p>
                  </div>
                </div>

                {/* Navigation links */}
                <ul className="flex items-center gap-2">
                  <li>
                    <NavLink
                      to="/"
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                          isActive 
                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md' 
                            : 'text-gray-600 hover:bg-white/60 hover:text-primary-600'
                        }`
                      }
                    >
                      <Home className="w-4 h-4" />
                      <span className="hidden sm:inline">Home</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/create"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                          isActive 
                            ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md' 
                            : 'text-gray-600 hover:bg-white/60 hover:text-accent-600'
                        }`
                      }
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Create</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/leaderboard"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                          isActive 
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md' 
                            : 'text-gray-600 hover:bg-white/60 hover:text-yellow-600'
                        }`
                      }
                    >
                      <Trophy className="w-4 h-4" />
                      <span className="hidden sm:inline">Leaderboard</span>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </nav>
          </header>

          {/* Main content area */}
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<MemeList />} />
              <Route path="/create" element={<MemeForm />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-white/60 backdrop-blur-sm border-t border-white/20">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-600 font-medium">MemeHustle</span>
                </div>
                <p className="text-gray-500 text-sm text-center">
                  © {new Date().getFullYear()} MemeHustle Memes and Money together
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>MADE BY MEMER FOR MEMERS</span>
                </div>
              </div>
            </div>
          </footer>

        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
