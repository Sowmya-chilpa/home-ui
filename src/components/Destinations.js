import { useEffect, useState, useRef } from "react";
import DestinationCard from "./DestinationCard";
import "./Destinations.css";

const AEM_HOST = "https://katrina-nonmonogamous-pseudofamously.ngrok-free.dev";
const ENDPOINT = `${AEM_HOST}/content/cq:graphql/TDTraining/endpoint.json`;

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa("admin:admin"),
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
        query: `
          {
            destinationList {
              items {
                destinationName
                slug
                tagLine
                heroImage {
                  ... on ImageRef {
                    _path
                  }
                }
                isfeatured
              }
            }
          }
        `,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const all = data?.data?.destinationList?.items || [];
        const featured = all.filter((item) => item.isfeatured === true);
        setDestinations(featured);
      })
      .catch(console.error);
  }, []);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    scrollRef.current.style.cursor = "grab";
  };

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div className="destinationsContainer">
      <h2 className="sectionTitle">Don't Know where to go? Explore here</h2>

      <div
        className="scrollContainer"
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {destinations.map((item) => (
          <DestinationCard key={item.slug} data={item} />
        ))}
      </div>
    </div>
  );
}

export default Destinations;