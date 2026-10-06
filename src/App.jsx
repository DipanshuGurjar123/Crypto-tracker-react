import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';

function App() {

  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className='min-h-screen bg-slate-900 text-white'>

      <nav className="bg-slate-800 border-b border-slate-700 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              CRYPTO-TRACKER
            </h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-750 hover:text-white'
                }`}
            >
              📊 Live Market
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === 'portfolio'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-750 hover:text-white'
                }`}
            >
              💼 My Portfolio
            </button>
          </div>
        </div>
      </nav>


      <main className="max-w-6xl mx-auto p-4 md:p-6 mt-4">
        {activeTab === 'dashboard' ? <Dashboard /> : <Portfolio />}
      </main>
    </div>
  )

}

export default App