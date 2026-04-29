import { useEffect, useState } from "react";

const AEM_HOST = "https://katrina-nonmonogamous-pseudofamously.ngrok-free.dev";
const ENDPOINT = `${AEM_HOST}/content/cq:graphql/TDTraining/endpoint.json`;

function AEMImage({ src, alt, style }) {
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

        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [src]);

    if (!objectUrl) {
        return <div style={{ height: "100%", background: "#eee" }} />;
    }

    return <img src={objectUrl} alt={alt} style={style} />;
}

function Banner() {
    const [banner, setBanner] = useState(null);
    const [loading, setLoading] = useState(true);

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
        query {
          bannermodelList {
            items {
              title
              description {
                plaintext
              }
              buttonText
              buttonLink
              bannerimage {
                ... on ImageRef {
                  _path
                }
              }
            }
          }
        }
      `,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setBanner(data?.data?.bannermodelList?.items?.[0] || null);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{ padding: 20 }}>Loading banner...</div>;
    if (!banner) return <div>Error loading banner</div>;

    const imageUrl = `${AEM_HOST}${banner.bannerimage?._path}`;

    return (
        <div
            style={{
                position: "relative",
                height: "450px",
                width: "100%",
                overflow: "hidden",
            }}
        >
            {/* Background Image */}
            <AEMImage
                src={imageUrl}
                alt="banner"
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            />

            {/* Overlay */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    color: "white",
                    padding: "20px",
                }}
            >
                <div style={{ maxWidth: "700px" }}>
                    <h1
                        style={{
                            fontSize: "42px",
                            marginBottom: "12px",
                            lineHeight: "1.2",
                        }}
                    >
                        {banner.title}
                    </h1>

                    <p
                        style={{
                            fontSize: "18px",
                            marginBottom: "20px",
                            lineHeight: "1.5",
                        }}
                    >
                        {banner.description?.plaintext}
                    </p>

                    <a href={banner.buttonLink}>
                        <button
                            style={{
                                padding: "12px 28px",
                                background: "#ff6600",
                                border: "none",
                                color: "white",
                                fontSize: "16px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) =>
                                (e.target.style.background = "#e65c00")
                            }
                            onMouseLeave={(e) =>
                                (e.target.style.background = "#ff6600")
                            }
                        >
                            {banner.buttonText}
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Banner;