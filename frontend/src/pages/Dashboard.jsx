import { useState, useEffect } from 'react';
import api from '../api';
import { DollarSign, Percent, ArrowUpRight, ArrowDownLeft, Users, Landmark, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({
    balance: 0,
    totalCommissions: 0,
    owedToMe: 0,
    iOwe: 0,
    clientSummaries: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/dashboard');
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate Net Worth / Projected Liquidity
  // balance now represents the Cash Liquidity Grand Total from the backend
  const projectedLiquidity = Number(stats.balance) + Number(stats.owedToMe) - Number(stats.iOwe);

  const statCards = [
    { 
      title: 'Current Cash Balance', 
      subtitle: 'From Cash Liquidity',
      value: stats.balance, 
      icon: <DollarSign className="text-primary" />, 
      color: 'text-primary',
      link: '/cash-balance'
    },
    { 
      title: 'Total Commissions', 
      subtitle: 'Accumulated',
      value: stats.totalCommissions, 
      icon: <Percent className="text-success" />, 
      color: 'text-success' 
    },
    { 
      title: 'Clients Owe Me', 
      subtitle: 'Receivables',
      value: stats.owedToMe, 
      icon: <ArrowUpRight className="text-warning" />, 
      color: 'text-warning' 
    },
    { 
      title: 'I Owe Clients', 
      subtitle: 'Payables',
      value: stats.iOwe, 
      icon: <ArrowDownLeft className="text-danger" />, 
      color: 'text-danger' 
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Welcome back, Admin</h1>
          <p style={{ color: 'var(--text-muted)' }}>Here's your business overview based on actual cash on hand.</p>
        </div>

        {/* Projected Liquidity Card */}
        <div className="card" style={{ padding: '1rem 2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)', border: '1px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <Landmark size={18} className="text-primary" />
            <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Net Worth Position</h3>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
            ${projectedLiquidity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Actual Cash + Net Debt</p>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, i) => (
          <div key={i} className="card stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{stat.title}</h3>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>{stat.subtitle}</p>
              </div>
              {stat.icon}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className={`value ${stat.color}`} style={{ fontSize: '1.5rem' }}>
                ${Number(stat.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              {stat.link && (
                <Link to={stat.link} style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', fontSize: '0.8rem', textDecoration: 'none' }}>
                  Manage <ChevronRight size={14} />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Users size={20} className="text-primary" /> Active Client Debt Ledger
        </h3>
        <table>
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Owed To Me</th>
              <th>I Owe Them</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.clientSummaries.map(client => (
              <tr key={client.id}>
                <td style={{ fontWeight: 500 }}>{client.name}</td>
                <td className="text-warning">${Number(client.owed_to_me).toLocaleString()}</td>
                <td className="text-danger">${Number(client.i_owe).toLocaleString()}</td>
                <td>
                  {Number(client.owed_to_me) > Number(client.i_owe) ? (
                    <span className="badge badge-unpaid">Receivable</span>
                  ) : (
                    <span className="badge badge-withdrawal">Payable</span>
                  )}
                </td>
              </tr>
            ))}
            {stats.clientSummaries.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No active debts to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
