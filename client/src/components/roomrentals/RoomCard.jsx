// // components/RoomCard.jsx
// import React from 'react';
// import AdminRoomControls from './AdminRoomControls';
// import { Link } from 'react-router-dom';

// export default function RoomCard({ room, showControls = false, onEdit }) {
//   const img = room?.roomImages && room.roomImages.length ? room.roomImages[0] : null;

//   return (
//     <article
//       style={{
//         display: 'flex',
//         flexDirection: 'row',
//         gap: 12,
//         border: '1px solid #eee',
//         padding: 12,
//         borderRadius: 6,
//         alignItems: 'stretch',
//         minHeight: 120,
//         background: '#fff'
//       }}
//     >
//       {/* Image column */}
//       <div
//         style={{
//           flex: '0 0 160px',
//           width: 160,
//           height: '100%',
//           borderRadius: 6,
//           overflow: 'hidden',
//           background: '#f6f6f6',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center'
//         }}
//       >
//         {img ? (
//           <img
//             src={img}
//             alt={room.roomTitle || 'room image'}
//             style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
//           />
//         ) : (
//           <div style={{ color: '#999', fontSize: 13, padding: 8, textAlign: 'center' }}>No image</div>
//         )}
//       </div>

//       {/* Content column */}
//       <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
//           <div style={{ flex: 1 }}>
//             <Link to={`/rooms/${room._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
//               <h3 style={{ margin: '0 0 6px 0', fontSize: 18 }}>{room.roomTitle}</h3>
//             </Link>
//             <p style={{ margin: 0, color: '#555', fontSize: 14, lineHeight: '1.3' }}>
//               {room.roomDescription ? (room.roomDescription.length > 220 ? `${room.roomDescription.slice(0, 220)}…` : room.roomDescription) : 'No description'}
//             </p>
//           </div>

//           {/* Admin controls (optional) */}
//           {showControls && (
//             <div style={{ marginLeft: 8 }}>
//               <AdminRoomControls roomId={room._id} onEdit={onEdit} />
//             </div>
//           )}
//         </div>

//         {/* Meta row */}
//         <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
//           <div style={{ color: '#333', fontWeight: 600 }}>
//             {room.pricePerNight?.amount ?? '-'} <span style={{ fontWeight: 400 }}>{room.pricePerNight?.currency ?? ''}</span>
//           </div>

//           <div style={{ color: '#666', fontSize: 13 }}>
//             {room.roomCapacity} guest{room.roomCapacity > 1 ? 's' : ''} • {room.bedrooms ?? 0} bd • {room.bathrooms ?? 0} ba
//           </div>

//           <div style={{ marginLeft: 'auto' }}>
//             <Link to={`/rooms/${room._id}`} style={{ marginRight: 8, textDecoration: 'none' }} className="btn btn-sm btn-outline-secondary">
//               Details
//             </Link>
//           </div>
//         </div>
//       </div>
//     </article>
//   );
// }

// RoomCard.jsx
import React from "react";
import { Card, Badge, Row, Col, ListGroup, Image } from "react-bootstrap";

/**
 * RoomCard
 * Props:
 * - room: room object from MongoDB (structure shown in the prompt)
 * - onEdit (optional): function(room) for admin edit action
 * - onDelete (optional): function(roomId) for admin delete action
 * - showActions (optional): boolean to show edit/delete badges (admin dashboards)
 */
export default function RoomCard({ room, onEdit, onDelete, showActions = false }) {
  if (!room) return null;

  const id = room._id || room.id || null;
  const title = room.roomTitle || "Untitled room";
  const desc = room.roomDescription || "";
  const capacity = room.roomCapacity?.$numberInt ?? room.roomCapacity ?? null;
  const bedrooms = room.bedrooms?.$numberInt ?? room.bedrooms ?? null;
  const bathrooms = room.bathrooms?.$numberInt ?? room.bathrooms ?? null;
  const minNights = room.minNights?.$numberInt ?? room.minNights ?? null;
  const maxNights = room.maxNights?.$numberInt ?? room.maxNights ?? null;
  const instantBook = Boolean(room.instantBook);
  const archived = Boolean(room.archived);
  const priceAmount =
    room.pricePerNight?.amount?.$numberInt ??
    room.pricePerNight?.amount ??
    room.pricePerNight ??
    null;
  const priceCurrency = room.pricePerNight?.currency ?? "USD";
  const location = room.roomLocation || {};
  const amenities = Array.isArray(room.amenities) ? room.amenities : [];
  const rules = Array.isArray(room.rules) ? room.rules : [];
  const images = Array.isArray(room.images) ? room.images : [];
  const host = room.host?._id ?? room.host ?? null;
  const createdAt = room.createdAt?.$date
    ? new Date(Number(room.createdAt.$date.$numberLong || room.createdAt.$date))
    : room.createdAt?.$numberLong
    ? new Date(Number(room.createdAt.$numberLong))
    : room.createdAt
    ? new Date(room.createdAt)
    : null;

  const formattedDate = createdAt ? createdAt.toLocaleString() : "";

  const thumbnail =
    images.length > 0 ? images[0].url || images[0].path || images[0].filename : null;

  return (
    <Card className="mb-3 shadow-sm">
      {thumbnail && (
        <div style={{ maxHeight: 260, overflow: "hidden" }}>
          <Image src={thumbnail} alt={title} fluid style={{ width: "100%", objectFit: "cover" }} />
        </div>
      )}

      <Card.Body>
        <Row>
          <Col md={8}>
            <Card.Title className="d-flex align-items-center justify-content-between">
              <div>
                {title}{" "}
                {archived && (
                  <Badge bg="secondary" className="ms-2">
                    Archived
                  </Badge>
                )}
                {instantBook && (
                  <Badge bg="success" className="ms-2">
                    Instant book
                  </Badge>
                )}
              </div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>
                {priceAmount !== null ? `${priceCurrency} ${priceAmount}` : "—"}
              </div>
            </Card.Title>

            <Card.Text className="text-muted mb-2">{desc}</Card.Text>

            <ListGroup horizontal className="mb-2" style={{ gap: 8 }}>
              {capacity !== null && <Badge bg="light" text="dark">Capacity: {capacity}</Badge>}
              {bedrooms !== null && <Badge bg="light" text="dark">Bedrooms: {bedrooms}</Badge>}
              {bathrooms !== null && <Badge bg="light" text="dark">Bathrooms: {bathrooms}</Badge>}
              {minNights !== null && maxNights !== null && (
                <Badge bg="light" text="dark">
                  Nights: {minNights}–{maxNights}
                </Badge>
              )}
            </ListGroup>

            <div className="mb-2">
              <strong>Location</strong>
              <div className="text-muted">
                {location.address || ""} {location.city ? `, ${location.city}` : ""}{" "}
                {location.country ? `, ${location.country}` : ""}
              </div>
            </div>

            {amenities.length > 0 && (
              <div className="mb-2">
                <strong>Amenities</strong>
                <div style={{ marginTop: 6 }}>
                  {amenities.map((a) => (
                    <Badge key={a} bg="info" text="dark" className="me-2 mb-1">
                      {a}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {rules.length > 0 && (
              <div className="mb-2">
                <strong>Rules</strong>
                <ul className="mb-0 mt-1">
                  {rules.map((r, i) => (
                    <li key={i} style={{ fontSize: 14 }}>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Col>

          <Col md={4}>
            <div className="text-muted mb-2">
              <small>Host</small>
              <div>{host}</div>
            </div>

            <div className="text-muted mb-2">
              <small>Created</small>
              <div>{formattedDate}</div>
            </div>

            {showActions && (
              <div className="mt-3 d-flex flex-column" style={{ gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => onEdit?.(room)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => onDelete?.(id)}
                >
                  Delete
                </button>
              </div>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}