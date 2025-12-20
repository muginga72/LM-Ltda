// // src/components/CustomerMessages.jsx
// import { useEffect, useState } from "react";

// const UserListingRoomRequest = () => {
//   const [listingRequests, setListingRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchListingRequests = async () => {
//       try {
//         const res = await fetch("/api/room-listing-request");
//         if (!res.ok) throw new Error("Failed to fetch listing requests");
//         const data = await res.json();
//         setListingRequests(data);
//       } catch (err) {
//         setError(err.listingRequests);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchListingRequests();
//   }, []);

//   return (
//     <div className="container py-5">
//       <h5>User Room Listing Requests</h5>

//       {loading && <p>Loading requests...</p>}
//       {error && <div className="alert alert-danger">{error}</div>}

//       {!loading && !error && listingRequests.length === 0 && <p>No request found.</p>}

//       {!loading && listingRequests.length > 0 && (
//         <table className="table table-bordered table-hover">
//           <thead className="table-light">
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Phone</th>
//               <th>Description</th>
//               <th>Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {listingRequests.map((msg) => (
//               <tr key={msg._id}>
//                 <td>{msg.name}</td>
//                 <td>{msg.email}</td>
//                 <td>{msg.phone}</td>
//                 <td>{msg.description}</td>
//                 <td>{new Date(msg.createdAt).toLocaleString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default UserListingRoomRequest;



// src/components/roomrental/UserListingRoomRequest.jsx
import { useEffect, useState } from "react";

/**
 * UserListingRoomRequest
 *
 * Fetches room listing requests from the backend and displays them in a table.
 * This version is defensive about different API response shapes and surfaces
 * useful error messages for debugging.
 */
const UserListingRoomRequest = () => {
  const [listingRequests, setListingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const normalizeResponse = (data) => {
      // Accept many shapes:
      //  - Array: [...]
      //  - { listingRequests: [...] }
      //  - { data: [...] }
      //  - { requests: [...] }
      //  - single object -> wrap in array
      if (Array.isArray(data)) return data;
      if (!data || typeof data !== "object") return [];
      if (Array.isArray(data.listingRequests)) return data.listingRequests;
      if (Array.isArray(data.data)) return data.data;
      if (Array.isArray(data.requests)) return data.requests;
      // If object looks like a single request (has _id or name/email), wrap it
      if (data._id || data.id || data.name || data.email) return [data];
      return [];
    };

    const fetchListingRequests = async () => {
      try {
        setLoading(true);
        setError(null);

        // NOTE: adjust this endpoint if your backend uses a different path
        const endpoint = "/api/room-listing-request";

        const res = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (!res.ok) {
          // try to get JSON error body, otherwise text
          let bodyText = "";
          try {
            const errBody = await res.json();
            bodyText = JSON.stringify(errBody);
          } catch {
            try {
              bodyText = await res.text();
            } catch {
              bodyText = "";
            }
          }
          throw new Error(`Request failed: ${res.status} ${res.statusText} ${bodyText}`);
        }

        // parse JSON safely
        let data;
        try {
          data = await res.json();
        } catch (parseErr) {
          throw new Error("Failed to parse JSON response from server.");
        }

        const requests = normalizeResponse(data);

        if (isMounted) {
          setListingRequests(requests);
        }
      } catch (err) {
        if (!isMounted) return;
        if (err.name === "AbortError") return;
        console.error("Error fetching listing requests:", err);
        setError(err.message || "An unknown error occurred while fetching requests.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchListingRequests();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div className="container py-5">
      <h5>User Room Listing Requests</h5>

      {loading && <p>Loading requests...</p>}

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {!loading && !error && listingRequests.length === 0 && <p>No request found.</p>}

      {!loading && listingRequests.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {listingRequests.map((msg) => {
                const id = msg._id || msg.id || `${msg.email || "unknown"}-${Math.random().toString(36).slice(2, 9)}`;
                const created = msg.createdAt ? new Date(msg.createdAt) : null;
                const dateString = created && !isNaN(created) ? created.toLocaleString() : "—";

                return (
                  <tr key={id}>
                    <td>{msg.name || "—"}</td>
                    <td>{msg.email || "—"}</td>
                    <td>{msg.phone || "—"}</td>
                    <td style={{ maxWidth: 400, whiteSpace: "normal" }}>{msg.description || "—"}</td>
                    <td>{dateString}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserListingRoomRequest;