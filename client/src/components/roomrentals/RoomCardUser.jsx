import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function RoomCardUser({ room, onBook }) {
  return (
    <Card className="h-100">
      {room.roomImages && room.roomImages[0] && (
        <Card.Img variant="top" src={room.roomImages[0]} style={{ objectFit: "cover", height: 180 }} />
      )}
      <Card.Body className="d-flex flex-column">
        <Card.Title style={{ marginBottom: 6 }}>{room.roomTitle}</Card.Title>
        <Card.Text className="flex-grow-1" style={{ fontSize: 14, color: "#444" }}>
          {room.roomDescription?.slice(0, 140)}
        </Card.Text>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong>{room.pricePerNight?.amount}</strong> <small>{room.pricePerNight?.currency}</small>
          </div>
          <div>
            <Badge bg="secondary">{room.roomCapacity} guests</Badge>
          </div>
        </div>

        <div className="d-flex gap-2 mt-3">
          <Button variant="primary" onClick={onBook}>Book</Button>
          <Link className="btn btn-outline-secondary" to={`/rooms/${room._id}`}>Details</Link>
        </div>
      </Card.Body>
    </Card>
  );
}