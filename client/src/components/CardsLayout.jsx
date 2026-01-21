// client/src/components/CardsLayout.jsx
import React, { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import CardSet from "./CardSet";
import axios from "axios";

const API_FALLBACK = "https://lmltda-api.onrender.com"; 
const API_BASE = process.env.REACT_APP_API_URL?.trim() || API_FALLBACK;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Accept": "application/json",
  },
});

const CardsLayout = () => {
  const [cardSets, setCardSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const fetchCardSetsAndVideos = async () => {
      try {
        const res = await api.get("/api/cards", { signal: controller.signal });

        let data = res?.data;
        if (Array.isArray(data)) {
        } else if (Array.isArray(data?.cardSets)) {
          data = data.cardSets;
        } else if (Array.isArray(data?.data)) {
          data = data.data;
        } else {
          data = [];
        }

        const sets = Array.isArray(data) ? data : [];

        if (sets.length === 0) {
          if (!cancelled) {
            setCardSets([]);
            setLoading(false);
          }
          return;
        }

        // Try to load a global videos index from the frontend static assets (relative to site)
        let videosIndex = null;
        try {
          // videos index is likely hosted on the frontend static site; use relative path
          const idxRes = await fetch("/videos/index.json");
          if (idxRes.ok) {
            const idxJson = await idxRes.json();
            videosIndex = Array.isArray(idxJson) ? idxJson : null;
          } else {
            videosIndex = null;
          }
        } catch (err) {
          videosIndex = null;
        }

        const setsWithVideos = await Promise.all(
          sets.map(async (s) => {
            const setCopy = { ...s };

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

            // Try per-set JSON hosted on the frontend static site
            try {
              const perSetRes = await fetch(`/videos/${s.id}.json`);
              if (perSetRes.ok) {
                const perSetJson = await perSetRes.json();
                if (Array.isArray(perSetJson)) {
                  setCopy.left = {
                    ...setCopy.left,
                    videos: perSetJson,
                  };
                  return setCopy;
                }
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
        // Provide clearer logging for debugging
        console.error("Failed to fetch card sets or videos:", err?.message ?? err, err);
        if (!cancelled) {
          setCardSets([]);
          setLoading(false);
        }
      }
    };

    fetchCardSetsAndVideos();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return (
    <Container className="px-3 px-md-5 py-4">
      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        cardSets.map((set) => (
          <div key={set.id ?? set._id ?? Math.random()} className="mb-4 mb-md-5">
            <CardSet set={set} />
          </div>
        ))
      )}
    </Container>
  );
};

export default CardsLayout;