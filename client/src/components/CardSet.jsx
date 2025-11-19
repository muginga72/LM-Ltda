// // client/src/components/CardSet.jsx
// import React from "react";
// import { Row, Col, Card, Carousel } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// const CardSet = ({ set }) => {
//   const { t } = useTranslation();

//   const translateTitle = (title, side = "right") => {
//     const keySide = side === "left" ? "card.left." : "card.right.";
//     return t(`${keySide}${title}`, { defaultValue: title });
//   };

//   return (
//     <Row className="gx-3 gy-4">
//       {/* Left tall split: upper ~67% (image + title) and lower ~30% (promo videos carousel) */}
//       <Col xs={12} md={6} className="d-flex flex-column h-100">
//         <div className="d-flex flex-column h-100" style={{ gap: "1rem" }}>
//           {/* Upper part ~67% */}
//           <Card
//             className="d-flex flex-column"
//             style={{
//               flexBasis: "67%",
//               flexGrow: 0,
//               flexShrink: 0,
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 height: "100%",
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//             >
//               <Card.Img
//                 variant="top"
//                 src={set.left.image}
//                 style={{ objectFit: "cover", width: "100%", height: "100%" }}
//               />
//               <Card.Body className="d-flex flex-column text-center">
//                 <Card.Title>
//                   {translateTitle(set.left.title, "left")}
//                 </Card.Title>
//                 <Link to="/services" className="btn btn-outline-primary">
//                   {t("button.explore")}
//                 </Link>
//               </Card.Body>
//             </div>
//           </Card>

//           {/* Lower part ~30%: promotional videos carousel */}
//           <Card
//             className="d-flex flex-column"
//             style={{
//               flexBasis: "30%",
//               flexGrow: 0,
//               flexShrink: 0,
//               overflow: "hidden",
//             }}
//           >
//             <Card.Body className="d-flex flex-column p-2">
//               {Array.isArray(set.left.videos) && set.left.videos.length > 0 ? (
//                 <Carousel
//                   indicators={set.left.videos.length > 1}
//                   controls={set.left.videos.length > 1}
//                   variant="dark"
//                   className="w-100"
//                 >
//                   {set.left.videos.map((video, i) => (
//                     <Carousel.Item key={i}>
//                       {/* video can be an <video> tag or an embed url; adapt as needed */}
//                       {video.type === "video" ? (
//                         <video
//                           src={video.src}
//                           controls
//                           style={{
//                             width: "100%",
//                             height: "200px",
//                             objectFit: "cover",
//                           }}
//                         />
//                       ) : (
//                         <div
//                           style={{
//                             width: "100%",
//                             height: "200px",
//                             background: "#000",
//                           }}
//                         >
//                           <iframe
//                             title={`promo-${i}`}
//                             src={video.src}
//                             frameBorder="0"
//                             allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
//                             allowFullScreen
//                             style={{ width: "100%", height: "100%" }}
//                           />
//                         </div>
//                       )}
//                       {video.caption && (
//                         <Carousel.Caption>
//                           <small>{video.caption}</small>
//                         </Carousel.Caption>
//                       )}
//                     </Carousel.Item>
//                   ))}
//                 </Carousel>
//               ) : (
//                 <div className="d-flex flex-column justify-content-center align-items-center w-100 h-100">
//                   <p className="mb-2 text-center">
//                     {t("promo.noVideos", "No promotional videos")}
//                   </p>
//                 </div>
//               )}

//               <div className="mt-2 d-flex justify-content-center">
//                 {set.left.price !== undefined && (
//                   <div className="me-2 align-self-center">
//                     <strong>{set.left.price}</strong>
//                   </div>
//                 )}
//               </div>
//             </Card.Body>
//           </Card>
//         </div>
//       </Col>

//       {/* Right stacked cards (unchanged) */}
//       <Col xs={12} md={6}>
//         <div className="d-flex flex-column h-100 gap-3">
//           {Array.isArray(set.right) &&
//             set.right.map((item, idx) => (
//               <Card key={idx} className="flex-fill d-flex flex-column">
//                 <Card.Img variant="top" src={item.image} />
//                 <Card.Body className="d-flex flex-column text-center">
//                   <Card.Title>{translateTitle(item.title, "right")}</Card.Title>
//                   {item.price !== undefined && (
//                     <Card.Text>{item.price}</Card.Text>
//                   )}
//                   <Link to="/services" className="btn btn-outline-primary">
//                     {t("button.explore")}
//                   </Link>
//                 </Card.Body>
//               </Card>
//             ))}
//         </div>
//       </Col>
//     </Row>
//   );
// };

// export default CardSet;


// client/src/components/CardSet.jsx
import React from "react";
import { Row, Col, Card, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CardSet = ({ set }) => {
  const { t } = useTranslation();

  const translateTitle = (title, side = "right") => {
    const keySide = side === "left" ? "card.left." : "card.right.";
    return t(`${keySide}${title}`, { defaultValue: title });
  };

  return (
    <Row className="gx-3 gy-4">
      {/* Left tall split: upper ~67% (image + title) and lower ~30% (promo videos carousel) */}
      <Col xs={12} md={6} className="d-flex flex-column h-100">
        <div className="d-flex flex-column h-100" style={{ gap: "1rem" }}>
          {/* Upper part ~60% */}
          <Card
            className="d-flex flex-column"
            style={{
              flexBasis: "60%",
              flexGrow: 0,
              flexShrink: 0,
              overflow: "hidden",
              minHeight: 0,
            }}
          >
            {/* make image take available space and body use space-between so title stays top and action stays bottom */}
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
                <Card.Img
                  variant="top"
                  src={set.left.image}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>

              <Card.Body
                className="d-flex flex-column text-center"
                style={{ justifyContent: "space-between", paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
              >
                <div>
                  <Card.Title style={{ marginBottom: "0.5rem" }}>
                    {translateTitle(set.left.title, "left")}
                  </Card.Title>
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                  <Link to="/services" className="btn btn-outline-primary">
                    {t("button.explore")}
                  </Link>
                </div>
              </Card.Body>
            </div>
          </Card>

          {/* Lower part ~37%: promotional videos carousel */}
          <Card
            className="d-flex flex-column"
            style={{
              flexBasis: "37%",
              flexGrow: 0,
              flexShrink: 0,
              overflow: "hidden",
              minHeight: 0,
            }}
          >
            <Card.Body className="d-flex flex-column p-2" style={{ justifyContent: "space-between" }}>
              <div style={{ flex: 1, minHeight: 0 }}>
                {Array.isArray(set.left.videos) && set.left.videos.length > 0 ? (
                  <Carousel
                    indicators={set.left.videos.length > 1}
                    controls={set.left.videos.length > 1}
                    variant="dark"
                    className="w-100"
                  >
                    {set.left.videos.map((video, i) => (
                      <Carousel.Item key={i}>
                        {video.type === "video" ? (
                          <video
                            src={video.src}
                            controls
                            style={{ width: "100%", height: "200px", objectFit: "cover" }}
                          />
                        ) : (
                          <div style={{ width: "100%", height: "200px", background: "#000" }}>
                            <iframe
                              title={`promo-${i}`}
                              src={video.src}
                              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              style={{ width: "100%", height: "100%" }}
                            />
                          </div>
                        )}
                        {video.caption && (
                          <Carousel.Caption>
                            <small>{video.caption}</small>
                          </Carousel.Caption>
                        )}
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : (
                  <div className="d-flex flex-column justify-content-center align-items-center w-100 h-100">
                    <p className="mb-2 text-center">{t("promo.noVideos", "No promotional videos")}</p>
                  </div>
                )}
              </div>

              <div className="mt-2 d-flex justify-content-center" style={{ gap: "0.5rem" }}>
                {set.left.price !== undefined && (
                  <div className="me-2 align-self-center">
                    <strong>{set.left.price}</strong>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>
      </Col>

      {/* Right stacked cards (unchanged) */}
      <Col xs={12} md={6}>
        <div className="d-flex flex-column h-100 gap-3">
          {Array.isArray(set.right) &&
            set.right.map((item, idx) => (
              <Card key={idx} className="flex-fill d-flex flex-column">
                <Card.Img variant="top" src={item.image} />
                <Card.Body className="d-flex flex-column text-center" style={{ justifyContent: "space-between" }}>
                  <div>
                    <Card.Title>{translateTitle(item.title, "right")}</Card.Title>
                    {item.price !== undefined && <Card.Text>{item.price}</Card.Text>}
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Link to="/services" className="btn btn-outline-primary">
                      {t("button.explore")}
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            ))}
        </div>
      </Col>
    </Row>
  );
};

export default CardSet;