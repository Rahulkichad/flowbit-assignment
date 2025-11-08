'use client';
import React, { useState } from 'react';
import axios from 'axios';

export default function ChatWithData() {
  const [q, setQ] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    if (!q.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
      const r = await axios.post(`${apiBase}/chat-with-data`, { query: q }, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setResult(r.data);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to get response from AI');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      send();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Data Assistant</h1>
          <p className="text-slate-600">Ask questions about your data in natural language and get instant insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Query Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900 mb-1">Ask Your Question</h2>
                <p className="text-sm text-slate-600">Type your question in natural language below</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <textarea 
                    id="query"
                    value={q} 
                    onChange={(e) => setQ(e.target.value)} 
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., Show me all invoices from last month, or What is the total spend by vendor?"
                    className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                    rows={4}
                    disabled={loading}
                  />
                  <p className="text-xs text-slate-500 mt-2">💡 Press Ctrl+Enter to send your question</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-500">
                    Try asking about revenue, vendors, or invoice trends
                  </div>
                  <button 
                    onClick={send} 
                    disabled={loading || !q.trim()}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>Analyze Data</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-red-800">
                    <strong>Error:</strong> {error}
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                  <p className="text-sm text-blue-700">Processing your question...</p>
                </div>
              </div>
            )}

            {result && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Query Results</h2>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Success
                      </span>
                      <button className="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {result.rows && result.rows.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                          <tr>
                            {Object.keys(result.rows[0]).map((key) => (
                              <th key={key} className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                          {result.rows.map((row: any, index: number) => (
                            <tr key={index} className="hover:bg-slate-50 transition-colors">
                              {Object.values(row).map((value: any, cellIndex: number) => (
                                <td key={cellIndex} className="px-4 py-3 text-sm text-slate-900">
                                  {typeof value === 'number' ? value.toLocaleString() : String(value)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {result.rows && result.rows.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-slate-500 mb-4">No results found for your query.</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Examples */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Examples</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setQ('Show me total revenue by month for this year')}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="text-sm font-medium text-slate-900">Revenue by Month</div>
                  <div className="text-xs text-slate-600">Monthly revenue trends</div>
                </button>
                <button
                  onClick={() => setQ('Which vendor has the most invoices?')}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="text-sm font-medium text-slate-900">Top Vendors</div>
                  <div className="text-xs text-slate-600">Most active suppliers</div>
                </button>
                <button
                  onClick={() => setQ('Show me the highest invoice amount')}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="text-sm font-medium text-slate-900">Highest Invoice</div>
                  <div className="text-xs text-slate-600">Largest single transaction</div>
                </button>
              </div>
            </div>

            {/* SQL Query */}
            {result?.sql && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900">Generated SQL</h3>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs border border-slate-700">
                  <code>{result.sql}</code>
                </pre>
              </div>
            )}

            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Query Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Total Queries</span>
                  <span className="text-sm font-semibold text-slate-900">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Success Rate</span>
                  <span className="text-sm font-semibold text-green-600">94.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Avg. Response</span>
                  <span className="text-sm font-semibold text-slate-900">2.3s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
