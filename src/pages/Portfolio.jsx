import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddAssetModal from '../component/AddAssetModal';

function Portfolio() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myAssets, setMyAssets] = useState([]);
  const [livePrices, setLivePrices] = useState({});
  const [loading, setLoading] = useState(true);

  // 📥 LocalStorage se user ka data fetch karna core mounting par
  useEffect(() => {
    const savedPortfolio = JSON.parse(localStorage.getItem('my_crypto_portfolio')) || [];
    setMyAssets(savedPortfolio);
  }, []);

  // ⏱️ Live prices fetch karna comparison calculations ke liye
  useEffect(() => {
    const fetchLivePrices = () => {
      axios.get('https://coingecko.com')
        .then((res) => {
          setLivePrices(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Price fetch error in portfolio", err);
          setLoading(false);
        });
    };

    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 20000); // Live tracking updates every 20s
    return () => clearInterval(interval);
  }, []);

  // ➕ Naya asset add aur store karne ka logic
  const handleAssetAdded = (newAsset) => {
    const updated = [...myAssets, newAsset];
    setMyAssets(updated);
    localStorage.setItem('my_crypto_portfolio', JSON.stringify(updated));
  };

  // 🗑️ Asset remove karne ka logic
  const handleRemoveAsset = (id) => {
    const updated = myAssets.filter(asset => asset.id !== id);
    setMyAssets(updated);
    localStorage.setItem('my_crypto_portfolio', JSON.stringify(updated));
  };

  // 🧮 Math Calculations Logic
  let totalInvestment = 0;
  let currentPortfolioValue = 0;

  myAssets.forEach((asset) => {
    const currentPrice = livePrices[asset.coinId]?.usd || asset.buyPrice; // Backup price if API fails
    totalInvestment += asset.buyPrice * asset.quantity;
    currentPortfolioValue += currentPrice * asset.quantity;
  });

  const netPnL = currentPortfolioValue - totalInvestment;
  const pnlPercentage = totalInvestment > 0 ? (netPnL / totalInvestment) * 100 : 0;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="text-slate-400 font-medium">Portfolio calculations synchronizing...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 📊 Top Stat Cards Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl shadow-lg">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Invested</p>
          <p className="text-2xl font-bold font-mono mt-2 text-slate-100">\${totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl shadow-lg">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Value</p>
          <p className="text-2xl font-bold font-mono mt-2 text-slate-100">\${currentPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        <div className={`bg-slate-800 border border-slate-700 p-5 rounded-2xl shadow-lg border-l-4 ${netPnL >= 0 ? 'border-l-emerald-500' : 'border-l-rose-500'}`}>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Profit / Loss</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-2xl font-bold font-mono ${netPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {netPnL >= 0 ? '+' : ''}\${netPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`text-xs font-bold ${netPnL >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              ({pnlPercentage.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* 🛠️ Assets Management List Panel */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-100">💼 Assets Holdings</h2>
            <p className="text-xs text-slate-400 mt-1">Aapke manually added buy/sell logs ka real-time output tracker.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20"
          >
            ➕ Add Transaction
          </button>
        </div>

        {myAssets.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/20">
            <p className="text-slate-400 font-medium">Bhai, abhi tak koi transaction add nahi kiya hai!</p>
            <p className="text-xs text-slate-500 mt-1">Upar diye button par click karke holdings enter karein.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-700/60">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Asset</th>
                  <th className="py-3 px-4 text-right">Holdings / Qty</th>
                  <th className="py-3 px-4 text-right">Buy Price</th>
                  <th className="py-3 px-4 text-right">Current Price</th>
                  <th className="py-3 px-4 text-right">P&L Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-sm">
                {myAssets.map((asset) => {
                  const currentPrice = livePrices[asset.coinId]?.usd || asset.buyPrice;
                  const itemPnL = (currentPrice - asset.buyPrice) * asset.quantity;

                  return (
                    <tr key={asset.id} className="hover:bg-slate-750/30 transition duration-150">
                      <td className="py-4 px-4 font-bold text-indigo-400">{asset.name}</td>
                      <td className="py-4 px-4 text-right font-mono text-slate-200">{asset.quantity}</td>
                      <td className="py-4 px-4 text-right font-mono text-slate-300">\${asset.buyPrice.toLocaleString()}</td>
                      <td className="py-4 px-4 text-right font-mono text-slate-300">\${currentPrice.toLocaleString()}</td>
                      <td className={`py-4 px-4 text-right font-semibold font-mono ${itemPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {itemPnL >= 0 ? '+' : ''}\${itemPnL.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button 
                          onClick={() => handleRemoveAsset(asset.id)}
                          className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-md text-xs font-semibold transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🚀 Modal Component Integration */}
      <AddAssetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAssetAdded={handleAssetAdded}
      />

    </div>
  );
}

export default Portfolio;
