import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function RoomCardUser({ room, onBook }) {
  return (
    <Card className="h-100">
      <Row className="g-0">
        <Col xs={12} md={4} lg={4}>
          {room.roomImages && room.roomImages[0] ? (
            <img
              src={room.roomImages[0]}
              alt={room.roomTitle}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", minHeight: 160, background: "#f0f0f0" }} />
          )}
        </Col>

        <Col xs={12} md={8} lg={8}>
          <Card.Body className="d-flex flex-column h-100">
            <div>
              <Card.Title className="mb-1">{room.roomTitle}</Card.Title>
              <Card.Text className="text-muted small mb-2">
                {room.roomLocation?.city ? `${room.roomLocation.city} • ` : ""}
                {room.roomLocation?.country || ""}
              </Card.Text>
            </div>

            <Card.Text className="flex-grow-1" style={{ fontSize: 14, color: "#444" }}>
              {room.roomDescription ? room.roomDescription.slice(0, 220) + (room.roomDescription.length > 220 ? "…" : "") : ""}
            </Card.Text>

            <div className="d-flex align-items-center justify-content-between mt-2">
              <div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  {room.pricePerNight?.amount ?? "-"} <small style={{ fontWeight: 400 }}>{room.pricePerNight?.currency ?? ""}</small>
                </div>
                <div style={{ fontSize: 13, color: "#666" }}>
                  {room.roomCapacity} guest{room.roomCapacity > 1 ? "s" : ""} • {room.bedrooms ?? 0} bd • {room.bathrooms ?? 0} ba
                </div>
              </div>

              <div className="d-flex gap-2">
                <Button variant="primary" size="sm" onClick={onBook}>Book</Button>
                <Link className="btn btn-outline-secondary btn-sm" to={`/rooms/${room._id}`}>Details</Link>
              </div>
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}

export default RoomCardUser;