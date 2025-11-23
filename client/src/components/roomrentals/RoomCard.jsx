// components/RoomCard.jsx
import React from 'react';
import AdminRoomControls from './AdminRoomControls';
import { Link } from 'react-router-dom';

export default function RoomCard({ room, showControls=false, onEdit }) {
  return (
    <article style={{ border: '1px solid #eee', padding: 12, borderRadius: 6 }}>
      <Link to={`/rooms/${room._id}`}><h3>{room.roomTitle}</h3></Link>
      <div>{room.pricePerNight?.amount} {room.pricePerNight?.currency}</div>
      <div>{room.roomCapacity} guests</div>
      {showControls && <AdminRoomControls roomId={room._id} onEdit={onEdit} />}
    </article>
  );
}