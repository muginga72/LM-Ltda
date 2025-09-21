// CardsLayout.jsx
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import CardSet from "./CardSet";
import axios from "axios";

const CardsLayout = () => {
  const [cardSets, setCardSets] = useState([]);

  useEffect(() => {
    axios
      .get("/api/cards")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.cardSets;
        if (Array.isArray(data)) {
          setCardSets(data);
        } else {
          console.error("API did not return an array:", data);
          setCardSets([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch card sets:", err);
        setCardSets([]);
      });
  }, []);

  return (
    <Container className="px-3 px-md-5 py-4">
      {cardSets.map((set) => (
        <div key={set.id} className="mb-4 mb-md-5">
          {" "}
          {/*Responsive vertical spacing */}
          <CardSet set={set} />
        </div>
      ))}
    </Container>
  );
};

export default CardsLayout;
