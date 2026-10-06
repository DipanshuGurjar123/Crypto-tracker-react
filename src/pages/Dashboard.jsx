import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
    const [cryptoData, setCryptoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // MERN Stack approach: Axios inside useEffect
    const fetchMarketData = () => {
        axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd')
            .then((response) => {
                setCryptoData(response.data);
                setLoading(false);
                setError(null);
            })
            .catch((err) => {
                console.error("API Fetching Error:", err);
                setError("Rate limit exceed ya network error! Thodi der baad try karein.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchMarketData();

        // ⏱️ Auto-refresh background updates every 20 seconds
        const interval = setInterval(fetchMarketData, 20000);
        return () => clearInterval(interval);
    }, []);

    // 🔄 Loading State UI
    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                <p className="text-slate-400 font-medium">Live prices load ho rhi hain...</p>
            </div>
        );
    }

    // ⚠️ Error State UI
    if (error) {
        return (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-center">
                {error}
            </div>
        );
    }


    return (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100">🔥 Live Crypto Markets</h2>
                    <p className="text-sm text-slate-400 mt-1">Prices automatically 20 seconds mein refresh hoti hain.</p>
                </div>
                <button
                    onClick={() => { setLoading(true); fetchMarketData(); }}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-semibold transition"
                >
                    🔄 Refresh Now
                </button>
            </div>

            {/* 📊 Responsive Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-700/60">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-sm font-semibold">
                            <th className="py-3.5 px-4">Coin</th>
                            <th className="py-3.5 px-4">Symbol</th>
                            <th className="py-3.5 px-4 text-right">Current Price</th>
                            <th className="py-3.5 px-4 text-right">24h Change</th>
                            <th className="py-3.5 px-4 text-right">Market Cap</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {cryptoData.map((coin) => (
                            <tr key={coin.id} className="hover:bg-slate-750/30 transition duration-150">
                                <td className="py-4 px-4 flex items-center gap-3 font-medium text-slate-200">
                                    <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                                    {coin.name}
                                </td>
                                <td className="py-4 px-4 text-slate-400 uppercase text-sm font-semibold">{coin.symbol}</td>
                                <td className="py-4 px-4 text-right font-mono text-slate-200">\${coin.current_price.toLocaleString()}</td>
                                <td className={`py-4 px-4 text-right font-semibold ${coin.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {coin.price_change_percentage_24h >= 0 ? '▲ +' : '▼ '}{coin.price_change_percentage_24h?.toFixed(2)}%
                                </td>
                                <td className="py-4 px-4 text-right text-slate-400 font-mono text-sm">\${coin.market_cap.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Dashboard