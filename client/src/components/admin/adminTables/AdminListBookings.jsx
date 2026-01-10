// // src/components/admin/adminTables/AdminListBookings.jsx
// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import PropTypes from "prop-types";
// import {
//   Tabs,
//   Tab,
//   Table,
//   Spinner,
//   Alert,
//   Pagination,
//   Badge,
//   Row,
//   Col,
// } from "react-bootstrap";
// import { fetchBookingsApi } from "../../../api/fetchBookingsApi";

// export default function AdminListBookings({
//   apiBaseUrl = "",
//   token = null,
//   useCookies = false,
//   onUnauthorized = null,
// }) {
//   const [activeTab, setActiveTab] = useState("all");
//   const [page, setPage] = useState(1);
//   const [bookings, setBookings] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [pages, setPages] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const limit = 50;

//   const resolvedToken = useMemo(() => {
//     if (token) return token;
//     try {
//       return localStorage.getItem("authToken") || null;
//     } catch {
//       return null;
//     }
//   }, [token]);

//   const sliceLast8 = useCallback((val) => {
//     if (val === null || val === undefined || val === "") return "-";
//     const s = String(val);
//     return s.length <= 8 ? s : s.slice(-8);
//   }, []);

//   const renderStatusBadge = useCallback((booking) => {
//     if (!booking || !booking.status) return <Badge bg="primary">Unknown</Badge>;
//     if (booking.status === "paid") return <Badge bg="success">Paid</Badge>;
//     if (booking.status === "pending") return <Badge bg="warning">Pending</Badge>;
//     if (booking.status === "cancelled") return <Badge bg="danger">Cancelled</Badge>;
//     if (booking.status === "archived") return <Badge bg="secondary">Archived</Badge>;
//     return <Badge bg="secondary">{booking.status}</Badge>;
//   }, []);

//   const loadBookings = useCallback(
//     async (tabToLoad, pageToLoad) => {
//       setLoading(true);
//       setError(null);
//       try {
//         const data = await fetchBookingsApi({
//           apiBaseUrl,
//           token: resolvedToken,
//           useCookies,
//           tab: tabToLoad,
//           page: pageToLoad,
//         });

//         // Expect server to return page, limit, total, pages, bookings
//         const fetched = Array.isArray(data.bookings) ? data.bookings : [];
//         setBookings(fetched);
//         setTotal(Number(data.total || fetched.length));
//         setPages(
//           Number(
//             data.pages || Math.max(1, Math.ceil((data.total || fetched.length) / limit))
//           )
//         );
//         setPage(Number(data.page || pageToLoad));
//       } catch (err) {
//         console.error("AdminListBookings load error:", err);
//         const status = err?.status || err?.response?.status;
//         if (status === 401) {
//           setError("Unauthorized. Please sign in with an admin account.");
//           if (typeof onUnauthorized === "function") onUnauthorized();
//         } else if (status === 403) {
//           setError("Forbidden. You do not have permission to view bookings.");
//         } else {
//           setError(err.message || "Failed to load bookings");
//         }
//         setBookings([]);
//         setTotal(0);
//         setPages(1);
//         setPage(1);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [apiBaseUrl, resolvedToken, useCookies, onUnauthorized]
//   );

//   useEffect(() => {
//     setPage(1);
//     loadBookings(activeTab, 1);
//   }, [activeTab, loadBookings]);

//   useEffect(() => {
//     loadBookings(activeTab, page);
//   }, [page, activeTab, loadBookings]);

//   const handleTabSelect = (k) => {
//     if (!k) return;
//     setActiveTab(k);
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > pages) return;
//     setPage(newPage);
//   };

//   // Columns definition: label and renderer function
//   const columns = useMemo(
//     () => [
//       {
//         key: "id",
//         label: "ID",
//         render: (b) => sliceLast8(b._id || b.id || ""),
//       },
//       {
//         key: "roomId",
//         label: "Room ID",
//         render: (b) => {
//           // room may be populated object or a string id
//           const rawRoomId =
//             typeof b.room === "string"
//               ? b.room
//               : (b.room && (b.room._id || b.room.id)) || "";
//           return sliceLast8(rawRoomId);
//         },
//       },
//       {
//         key: "roomTitle",
//         label: "Room Title",
//         render: (b) => {
//           // booking model: room may be populated with roomTitle, title, name
//           if (!b.room) return "-";
//           if (typeof b.room === "string") return "-";
//           // prefer roomTitle, then title, then name
//           return b.room.roomTitle || b.room.title || b.room.name || "-";
//         },
//       },
//       {
//         key: "guest",
//         label: "Guest",
//         render: (b) => b.guest?.name || b.guest?.email || "-",
//       },
//       {
//         key: "guestPhone",
//         label: "Guest Phone",
//         render: (b) => b.guestOnePhone || b.guestPhone || "-",
//       },
//       {
//         key: "host",
//         label: "Host",
//         render: (b) => b.host?.name || b.host?.email || "-",
//       },
//       {
//         key: "start",
//         label: "Start",
//         render: (b) => (b.startDate ? new Date(b.startDate).toLocaleDateString() : "-"),
//       },
//       {
//         key: "end",
//         label: "End",
//         render: (b) => (b.endDate ? new Date(b.endDate).toLocaleDateString() : "-"),
//       },
//       {
//         key: "nights",
//         label: "Nights",
//         render: (b) => (b.nights ?? "-"),
//       },
//       {
//         key: "price",
//         label: "Price",
//         render: (b) =>
//           b.totalPrice ? `${b.totalPrice.currency || "USD"} ${b.totalPrice.amount ?? 0}` : "-",
//       },
//       {
//         key: "status",
//         label: "Status",
//         render: (b) => renderStatusBadge(b),
//       },
//       {
//         key: "created",
//         label: "Created",
//         render: (b) => (b.createdAt ? new Date(b.createdAt).toLocaleString() : "-"),
//       },
//     ],
//     [sliceLast8, renderStatusBadge]
//   );

//   const renderTable = () => {
//     if (loading) {
//       return (
//         <div className="text-center py-4">
//           <Spinner animation="border" />
//         </div>
//       );
//     }

//     if (error) {
//       return <Alert variant="danger">{error}</Alert>;
//     }

//     if (!bookings.length) {
//       return <div className="p-3 text-muted">No bookings found.</div>;
//     }

//     // If server returned pages and total, we use them; otherwise paginate client-side
//     const paginated = bookings.slice((page - 1) * limit, page * limit);

//     return (
//       <>
//         <Table striped bordered hover responsive size="sm" className="mt-2">
//           <thead>
//             <tr>
//               {columns.map((col) => (
//                 <th key={col.key}>{col.label}</th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {paginated.map((b) => (
//               <tr key={b._id || b.id || Math.random()}>
//                 {columns.map((col) => (
//                   <td key={col.key} style={{ wordBreak: "break-all", maxWidth: 240 }}>
//                     {col.render(b)}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </Table>

//         <Row className="align-items-center">
//           <Col className="text-muted">
//             Showing page {page} of {pages} — {total} bookings total
//           </Col>

//           <Col className="d-flex justify-content-end">
//             <Pagination className="mb-0">
//               <Pagination.First onClick={() => handlePageChange(1)} disabled={page === 1} />
//               <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />

//               {(() => {
//                 const maxButtons = 7;
//                 const half = Math.floor(maxButtons / 2);
//                 let start = Math.max(1, page - half);
//                 let end = start + maxButtons - 1;
//                 if (end > pages) {
//                   end = pages;
//                   start = Math.max(1, end - maxButtons + 1);
//                 }
//                 const items = [];
//                 for (let p = start; p <= end; p += 1) {
//                   items.push(
//                     <Pagination.Item key={p} active={p === page} onClick={() => handlePageChange(p)}>
//                       {p}
//                     </Pagination.Item>
//                   );
//                 }
//                 return items;
//               })()}

//               <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === pages} />
//               <Pagination.Last onClick={() => handlePageChange(pages)} disabled={page === pages} />
//             </Pagination>
//           </Col>
//         </Row>
//       </>
//     );
//   };

//   return (
//     <div>
//       <Tabs activeKey={activeTab} onSelect={handleTabSelect} className="mb-3">
//         <Tab eventKey="all" title="All" />
//         <Tab eventKey="paid" title="Paid" />
//         <Tab eventKey="cancelled" title="Cancelled" />
//       </Tabs>

//       {renderTable()}
//     </div>
//   );
// }

// AdminListBookings.propTypes = {
//   apiBaseUrl: PropTypes.string,
//   token: PropTypes.string,
//   useCookies: PropTypes.bool,
//   onUnauthorized: PropTypes.func,
// };

// AdminListBookings.defaultProps = {
//   apiBaseUrl: "",
//   token: null,
//   useCookies: false,
//   onUnauthorized: null,
// };



// src/components/admin/AdminListBookings.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Tabs,
  Tab,
  Table,
  Spinner,
  Alert,
  Pagination,
  Badge,
  Row,
  Col,
} from 'react-bootstrap';
import fetchBookingsApi from '../../../api/fetchBookingsApi';

export default function AdminListBookings({
  apiBaseUrl = '',
  token = null,
  useCookies = false,
  onUnauthorized = null,
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 50;

  const resolvedToken = useMemo(() => {
    if (token) return token;
    try {
      return localStorage.getItem('authToken') || null;
    } catch {
      return null;
    }
  }, [token]);

  const sliceLast8 = useCallback((val) => {
    if (val === null || val === undefined || val === '') return '-';
    const s = String(val);
    return s.length <= 8 ? s : s.slice(-8);
  }, []);

  const renderStatusBadge = useCallback((booking) => {
    if (!booking || !booking.status) return <Badge bg="primary">Unknown</Badge>;
    if (booking.status === 'paid') return <Badge bg="success">Paid</Badge>;
    if (booking.status === 'pending') return <Badge bg="warning">Pending</Badge>;
    if (booking.status === 'cancelled') return <Badge bg="danger">Cancelled</Badge>;
    if (booking.status === 'archived') return <Badge bg="secondary">Archived</Badge>;
    return <Badge bg="secondary">{booking.status}</Badge>;
  }, []);

  const loadBookings = useCallback(
    async (tabToLoad, pageToLoad) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBookingsApi({
          apiBaseUrl,
          token: resolvedToken,
          useCookies,
          tab: tabToLoad,
          page: pageToLoad,
        });

        // Normalize response: server may return { bookings: [...], total, pages, page }
        const fetched = Array.isArray(data) ? data : Array.isArray(data.bookings) ? data.bookings : [];
        setBookings(fetched);

        const totalCount = Number(data.total ?? fetched.length);
        setTotal(totalCount);

        const pagesCount = Number(data.pages ?? Math.max(1, Math.ceil(totalCount / limit)));
        setPages(pagesCount);

        setPage(Number(data.page ?? pageToLoad));
      } catch (err) {
        console.error('AdminListBookings load error:', err);
        const status = err?.status || err?.response?.status || 0;
        if (status === 401) {
          setError('Unauthorized. Please sign in with an admin account.');
          if (typeof onUnauthorized === 'function') onUnauthorized();
        } else if (status === 403) {
          setError('Forbidden. You do not have permission to view bookings.');
        } else if (err.message && err.message.toLowerCase().includes('cors')) {
          setError('CORS error: check server CORS settings (allow http://localhost:3000).');
        } else if (err.message && err.message.toLowerCase().includes('network')) {
          setError('Network error: is the backend running and reachable?');
        } else {
          setError(err.message || 'Failed to load bookings');
        }
        setBookings([]);
        setTotal(0);
        setPages(1);
        setPage(1);
      } finally {
        setLoading(false);
      }
    },
    [apiBaseUrl, resolvedToken, useCookies, onUnauthorized]
  );

  // Reset page when tab changes
  useEffect(() => {
    setPage(1);
    loadBookings(activeTab, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Load when page changes
  useEffect(() => {
    loadBookings(activeTab, page);
  }, [page, activeTab, loadBookings]);

  const handleTabSelect = (k) => {
    if (!k) return;
    setActiveTab(k);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pages) return;
    setPage(newPage);
  };

  const columns = useMemo(
    () => [
      {
        key: 'id',
        label: 'ID',
        render: (b) => sliceLast8(b?._id || b?.id || ''),
      },
      {
        key: 'roomId',
        label: 'Room ID',
        render: (b) => {
          const rawRoomId =
            typeof b?.room === 'string' ? b.room : b?.room?._id || b?.room?.id || '';
          return sliceLast8(rawRoomId);
        },
      },
      {
        key: 'roomTitle',
        label: 'Room Title',
        render: (b) => {
          if (!b?.room) return '-';
          if (typeof b.room === 'string') return '-';
          return b.room.roomTitle || b.room.title || b.room.name || '-';
        },
      },
      {
        key: 'guest',
        label: 'Guest',
        render: (b) => (b?.guest?.name || b?.guest?.email || '-'),
      },
      {
        key: 'guestPhone',
        label: 'Guest Phone',
        render: (b) => b?.guestOnePhone || b?.guestPhone || '-',
      },
      {
        key: 'host',
        label: 'Host',
        render: (b) => (b?.host?.name || b?.host?.email || '-'),
      },
      {
        key: 'start',
        label: 'Start',
        render: (b) => (b?.startDate ? new Date(b.startDate).toLocaleDateString() : '-'),
      },
      {
        key: 'end',
        label: 'End',
        render: (b) => (b?.endDate ? new Date(b.endDate).toLocaleDateString() : '-'),
      },
      {
        key: 'nights',
        label: 'Nights',
        render: (b) => (b?.nights ?? '-'),
      },
      {
        key: 'price',
        label: 'Price',
        render: (b) =>
          b?.totalPrice ? `${b.totalPrice.currency || 'USD'} ${b.totalPrice.amount ?? 0}` : '-',
      },
      {
        key: 'status',
        label: 'Status',
        render: (b) => renderStatusBadge(b),
      },
      {
        key: 'created',
        label: 'Created',
        render: (b) => (b?.createdAt ? new Date(b.createdAt).toLocaleString() : '-'),
      },
    ],
    [sliceLast8, renderStatusBadge]
  );

  const renderTable = () => {
    if (loading) {
      return (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      );
    }

    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }

    if (!bookings.length) {
      return <div className="p-3 text-muted">No bookings found.</div>;
    }

    const paginated = bookings.slice((page - 1) * limit, page * limit);

    return (
      <>
        <Table striped bordered hover responsive size="sm" className="mt-2">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginated.map((b) => {
              const rowKey = b?._id || b?.id || `${b?.roomId || 'r'}-${b?.userId || 'u'}-${b?.startDate || Math.random()}`;
              return (
                <tr key={rowKey}>
                  {columns.map((col) => (
                    <td key={col.key} style={{ wordBreak: 'break-all', maxWidth: 240 }}>
                      {col.render(b)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>

        <Row className="align-items-center">
          <Col className="text-muted">
            Showing page {page} of {pages} - {total} bookings total
          </Col>

          <Col className="d-flex justify-content-end">
            <Pagination className="mb-0">
              <Pagination.First onClick={() => handlePageChange(1)} disabled={page === 1} />
              <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />

              {(() => {
                const maxButtons = 7;
                const half = Math.floor(maxButtons / 2);
                let start = Math.max(1, page - half);
                let end = start + maxButtons - 1;
                if (end > pages) {
                  end = pages;
                  start = Math.max(1, end - maxButtons + 1);
                }
                const items = [];
                for (let p = start; p <= end; p += 1) {
                  items.push(
                    <Pagination.Item key={p} active={p === page} onClick={() => handlePageChange(p)}>
                      {p}
                    </Pagination.Item>
                  );
                }
                return items;
              })()}

              <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === pages} />
              <Pagination.Last onClick={() => handlePageChange(pages)} disabled={page === pages} />
            </Pagination>
          </Col>
        </Row>
      </>
    );
  };

  return (
    <div>
      <Tabs activeKey={activeTab} onSelect={handleTabSelect} className="mb-3">
        <Tab eventKey="all" title="All" />
        <Tab eventKey="paid" title="Paid" />
        <Tab eventKey="cancelled" title="Cancelled" />
      </Tabs>
      {renderTable()}
    </div>
  );
}

AdminListBookings.propTypes = {
  apiBaseUrl: PropTypes.string,
  token: PropTypes.string,
  useCookies: PropTypes.bool,
  onUnauthorized: PropTypes.func,
};

AdminListBookings.defaultProps = {
  apiBaseUrl: '',
  token: null,
  useCookies: false,
  onUnauthorized: null,
};