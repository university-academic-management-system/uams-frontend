import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../services/api';
import { Loader2, X, ChevronDown } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    apiClient.get('/notifications')
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setAnnouncements(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error('Failed to fetch notifications:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return announcements.filter((a) => {
      const date = new Date(a.createdAt);
      if (fromDate && date < new Date(fromDate)) return false;
      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        if (date > to) return false;
      }
      return true;
    });
  }, [announcements, fromDate, toDate]);

  const clearFilters = () => {
    setFromDate('');
    setToDate('');
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Announcement</h1>

        {/* Date Range Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>From</span>
          <div style={{ position: 'relative' }}>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: 500,
                color: '#334155',
                cursor: 'pointer',
                outline: 'none',
              }}
            />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>To</span>
          <div style={{ position: 'relative' }}>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: 500,
                color: '#334155',
                cursor: 'pointer',
                outline: 'none',
              }}
            />
          </div>
          {(fromDate || toDate) && (
            <button
              onClick={clearFilters}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '12px',
                fontWeight: 500,
                color: '#334155',
                cursor: 'pointer',
                outline: 'none',
                display: 'flex',
                alignItems: 'center',
                // color: '#64748b',
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Announcements List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #f1f5f9',
            padding: '60px 20px',
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Loader2 size={20} className="animate-spin" />
            Loading announcements...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #f1f5f9',
            padding: '60px 20px',
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: '14px',
          }}>
            No announcements found
          </div>
        ) : (
          filtered.map((a) => (
            <div
              key={a.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #f1f5f9',
                padding: '24px 32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '24px',
                cursor: 'default',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#cadadeff')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: 900,
                  color: '#1e293b',
                  margin: '0 0 6px 0',
                }}>
                  {a.title}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#69717eff',
                  fontWeight: 400,
                  lineHeight: '1.6',
                  margin: 0,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {a.body}
                </p>
              </div>
              <span style={{
                fontSize: '13px',
                color: '#94a3b8',
                fontWeight: 400,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                paddingTop: '2px',
              }}>
                {formatDate(a.createdAt)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcements;
