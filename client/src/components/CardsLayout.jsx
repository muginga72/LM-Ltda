// client/src/components/CardsLayout.jsx
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import CardSet from "./CardSet";
import axios from "axios";

const CardsLayout = () => {
  const [cardSets, setCardSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchCardSetsAndVideos = async () => {
      try {
        const res = await axios.get("/api/cards");
        const data = Array.isArray(res.data) ? res.data : res.data.cardSets;
        const sets = Array.isArray(data) ? data : [];

        if (sets.length === 0) {
          if (!cancelled) {
            setCardSets([]);
            setLoading(false);
          }
          return;
        }

        let videosIndex = null;
        try {
          const idxRes = await axios.get("/videos/index.json");
          videosIndex = Array.isArray(idxRes.data) ? idxRes.data : null;
        } catch (err) {
          videosIndex = null;
        }

        const setsWithVideos = await Promise.all(
          sets.map(async (s) => {
            const setCopy = { ...s };

            // prefer videos from index.json when available
            if (videosIndex) {
              const match = videosIndex.find((v) => String(v.setId) === String(s.id));
              if (match && Array.isArray(match.videos)) {
                setCopy.left = {
                  ...setCopy.left,
                  videos: match.videos,
                };
                return setCopy;
              }
            }

            try {
              const perSetRes = await axios.get(`/videos/${s.id}.json`);
              if (perSetRes && Array.isArray(perSetRes.data)) {
                setCopy.left = {
                  ...setCopy.left,
                  videos: perSetRes.data,
                };
                return setCopy;
              }
            } catch (err) {
              // ignore; no per-set json found
            }

            // final fallback: if left.videos already present in API data, keep it; otherwise empty array
            setCopy.left = {
              ...setCopy.left,
              videos: Array.isArray(setCopy.left?.videos) ? setCopy.left.videos : [],
            };
            return setCopy;
          })
        );

        if (!cancelled) {
          setCardSets(setsWithVideos);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch card sets or videos:", err);
        if (!cancelled) {
          setCardSets([]);
          setLoading(false);
        }
      }
    };

    fetchCardSetsAndVideos();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Container className="px-3 px-md-5 py-4">
      {!loading &&
        cardSets.map((set) => (
          <div key={set.id} className="mb-4 mb-md-5">
            <CardSet set={set} />
          </div>
        ))}
    </Container>
  );
};

export default CardsLayout;
