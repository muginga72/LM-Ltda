// components/RoomCard.jsx
import React from 'react';
import AdminRoomControls from './AdminRoomControls';
import { Link } from 'react-router-dom';

export default function RoomCard({ room, showControls = false, onEdit }) {
  const img = room?.roomImages && room.roomImages.length ? room.roomImages[0] : null;

  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 12,
        border: '1px solid #eee',
        padding: 12,
        borderRadius: 6,
        alignItems: 'stretch',
        minHeight: 120,
        background: '#fff'
      }}
    >
      {/* Image column */}
      <div
        style={{
          flex: '0 0 160px',
          width: 160,
          height: '100%',
          borderRadius: 6,
          overflow: 'hidden',
          background: '#f6f6f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {img ? (
          <img
            src={img}
            alt={room.roomTitle || 'room image'}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ color: '#999', fontSize: 13, padding: 8, textAlign: 'center' }}>No image</div>
        )}
      </div>

      {/* Content column */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Link to={`/rooms/${room._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: 18 }}>{room.roomTitle}</h3>
            </Link>
            <p style={{ margin: 0, color: '#555', fontSize: 14, lineHeight: '1.3' }}>
              {room.roomDescription ? (room.roomDescription.length > 220 ? `${room.roomDescription.slice(0, 220)}…` : room.roomDescription) : 'No description'}
            </p>
          </div>

          {/* Admin controls (optional) */}
          {showControls && (
            <div style={{ marginLeft: 8 }}>
              <AdminRoomControls roomId={room._id} onEdit={onEdit} />
            </div>
          )}
        </div>

        {/* Meta row */}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ color: '#333', fontWeight: 600 }}>
            {room.pricePerNight?.amount ?? '-'} <span style={{ fontWeight: 400 }}>{room.pricePerNight?.currency ?? ''}</span>
          </div>

          <div style={{ color: '#666', fontSize: 13 }}>
            {room.roomCapacity} guest{room.roomCapacity > 1 ? 's' : ''} • {room.bedrooms ?? 0} bd • {room.bathrooms ?? 0} ba
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <Link to={`/rooms/${room._id}`} style={{ marginRight: 8, textDecoration: 'none' }} className="btn btn-sm btn-outline-secondary">
              Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}