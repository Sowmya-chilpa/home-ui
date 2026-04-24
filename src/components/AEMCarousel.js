import { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const AEM_HOST = "https://katrina-nonmonogamous-pseudofamously.ngrok-free.dev";
const ENDPOINT = `${AEM_HOST}/content/cq:graphql/TDTraining/endpoint.json`;

function AEMImage({ src, alt }) {
    const [objectUrl, setObjectUrl] = useState(null);

    useEffect(() => {
        let url;
        fetch(src, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                Authorization: "Basic " + btoa("admin:admin"),
            },
        })
            .then((res) => res.blob())
            .then((blob) => {
                url = URL.createObjectURL(blob);
                setObjectUrl(url);
            })
            .catch(console.error);

        return () => { if (url) URL.revokeObjectURL(url); };
    }, [src]);

    if (!objectUrl) return <div style={{ width: "100%", height: "50vw", maxHeight: "500px", background: "#eee" }} />;
    return <img src={objectUrl} alt={alt} style={{ width: "100%", height: "50vw", maxHeight: "500px", objectFit: "cover" }} />;
}

function AEMCarousel() {
    const [slides, setSlides] = useState([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + btoa("admin:admin"),
                "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify({
                query: `{
          carouselModelList {
            items {
              title
              image { ... on ImageRef { _path } }
              description { plaintext }
            }
          }
        }`,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setSlides(data.data.carouselModelList.items);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
    if (error) return <p style={{ textAlign: "center", color: "red" }}>Error: {error}</p>;

    const renderArrowPrev = (clickHandler) => (
        <button
            onClick={clickHandler}
            disabled={current === 0}
            style={{
                position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
                zIndex: 10, background: "white", border: "none", borderRadius: "50%",
                width: 40, height: 40, fontSize: 18, cursor: current === 0 ? "not-allowed" : "pointer",
                opacity: current === 0 ? 0.3 : 1,
            }}
        >
            ‹
        </button>
    );

    const renderArrowNext = (clickHandler) => (
        <button
            onClick={clickHandler}
            disabled={current === slides.length - 1}
            style={{
                position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                zIndex: 10, background: "white", border: "none", borderRadius: "50%",
                width: 40, height: 40, fontSize: 18, cursor: current === slides.length - 1 ? "not-allowed" : "pointer",
                opacity: current === slides.length - 1 ? 0.3 : 1,
            }}
        >
            ›
        </button>
    );

    return (
        <div style={{ maxWidth: "100%", margin: "20px auto", padding: "0 16px" }}>
            <Carousel
                infiniteLoop={false}
                autoPlay={false}
                showThumbs={false}
                showStatus={false}
                swipeable={true}
                emulateTouch={true}
                selectedItem={current}
                onChange={(index) => setCurrent(index)}
                renderArrowPrev={renderArrowPrev}
                renderArrowNext={renderArrowNext}
            >
                {slides.map((slide, index) => (
                    <div key={index} style={{ position: "relative" }}>
                        <AEMImage src={`${AEM_HOST}${slide.image._path}`} alt={slide.title} />
                        <div style={{
                            position: "absolute", bottom: 0, left: 0, right: 0,
                        }}>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}

export default AEMCarousel;