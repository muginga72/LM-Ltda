// components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminDashboard() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState('');

  useEffect(()=> { fetchServices(); }, []);

  const fetchServices = async () => {
    setLoading(true);
    try { const res = await axios.get(`${API}/api/services`); setServices(res.data); } catch (e) { console.error(e); }
    setLoading(false);
  };

  const openService = async (s) => {
    setSelectedService(s);
    try {
      const r = await axios.get(`${API}/api/services/${s._id}/payments`);
      setPayments(r.data || []);
    } catch (e) { console.error(e); setPayments([]); }
  };

  const confirmPayment = async (paymentId, type) => {
    setActionStatus('Processing...');
    try {
      const res = await axios.patch(`${API}/api/services/${selectedService._id}/confirm-payment`, { paymentId, type, notify: true });
      setActionStatus('Payment confirmed and user notified.');
      // refresh
      await fetchServices();
      await openService(res.data.service);
    } catch (e) { console.error(e); setActionStatus('Confirm failed'); }
    setTimeout(()=> setActionStatus(''), 2000);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* <h3>Admin Dashboard</h3> */}
        <div><small className="text-muted">Admin mode</small></div>
      </div>

      {loading ? <div className="text-center"><Spinner animation="border" /></div> : (
        <div className="row">
          <div className="col-md-6">
            <h5>Payment Services</h5>
            <Table hover bordered size="sm">
              <thead><tr><th>Title</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {services.map(s=> (
                  <tr key={s._id}>
                    <td>{s.title}</td>
                    <td>${(s.price||0).toFixed(2)}</td>
                    <td>{s.status}</td>
                    <td><Button size="sm" onClick={()=> openService(s)}>Open</Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="col-md-6">
            {selectedService ? (
              <>
                <h5>Payments for: {selectedService.title}</h5>
                {actionStatus && <Alert variant="info">{actionStatus}</Alert>}
                <Table size="sm" bordered>
                  <thead><tr><th>Payer</th><th>Email</th><th>Amount</th><th>Status</th><th>Proof</th><th>Actions</th></tr></thead>
                  <tbody>
                    {payments.length === 0 && <tr><td colSpan="6" className="text-center">No payments</td></tr>}
                    {payments.map(p=> (
                      <tr key={p._id}>
                        <td>{p.payerName || '-'}</td>
                        <td>{p.payerEmail}</td>
                        <td>${(p.amountPaid||0).toFixed(2)}</td>
                        <td>{p.status}</td>
                        <td>{p.proofPath ? <a href={p.proofPath} target="_blank" rel="noreferrer">View</a> : '-'}</td>
                        <td>
                          <Button size="sm" variant="success" className="me-1" onClick={()=> confirmPayment(p._id, 'full')}>Confirm Full</Button>
                          <Button size="sm" variant="warning" onClick={()=> confirmPayment(p._id, 'half')}>Confirm Half</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Button variant="secondary" size="sm" onClick={()=> setSelectedService(null)}>Close</Button>
              </>
            ) : (
              <div className="text-muted">Select a service to view payments</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;