import React, { useState } from 'react';

function AddAssetModal({ isOpen, onClose, onAssetAdded }) {
  // Form states
  const [coin, setCoin] = useState('bitcoin');
  const [buyPrice, setBuyPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!buyPrice || !quantity) {
      alert("Bhai, saari fields fill karo!");
      return;
    }

    // Naya asset object jo database (localStorage) mein jayega
    const newAsset = {
      id: Date.now().toString(), // Unique ID logic
      coinId: coin,
      name: coin.charAt(0).toUpperCase() + coin.slice(1),
      buyPrice: parseFloat(buyPrice),
      quantity: parseFloat(quantity),
    };

    onAssetAdded(newAsset);
    
    // Form reset aur close logic
    setBuyPrice('');
    setQuantity('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-100">📥 Add New Transaction</h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition text-xl"
          >
            &times;
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Coin Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Select Asset</label>
            <select 
              value={coin} 
              onChange={(e) => setCoin(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="bitcoin">Bitcoin (BTC)</option>
              <option value="ethereum">Ethereum (ETH)</option>
              <option value="solana">Solana (SOL)</option>
              <option value="ripple">Ripple (XRP)</option>
              <option value="cardano">Cardano (ADA)</option>
            </select>
          </div>

          {/* Buy Price Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Buy Price (USD)</label>
            <input 
              type="number" 
              step="any"
              placeholder="e.g. 65000"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Quantity</label>
            <input 
              type="number" 
              step="any"
              placeholder="e.g. 0.5"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="w-1/2 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition text-sm text-slate-300"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl font-semibold transition text-sm text-white shadow-md shadow-indigo-600/20"
            >
              Save Transaction
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddAssetModal;
