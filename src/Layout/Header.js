import { useState, useEffect, useRef } from "react";
import { FiSearch, FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";
import UserProfile from "../components/UserProfile";

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

        return () => { if (url) URL.revokeObjectURL(url); };
    }, [src]);

    if (!objectUrl) return <div style={{ width: 60, height: 40, background: "#eee" }} />;
    return <img src={objectUrl} alt={alt} style={style} />;
}

function Header() {
    const [headerData, setHeaderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const timeoutRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileExpandedIndex, setMobileExpandedIndex] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
                    headerModelList {
                        items {
                            logo { ... on ImageRef { _path } }
                            navLinks {
                                ... on NavitemModelModel {
                                    title path
                                    title2 path2
                                    title3 path3
                                    title4 path4
                                    title5 path5
                                    sublinks {
                                        ... on NavitemModelModel { title path }
                                    }
                                }
                            }
                        }
                    }
                }`,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setHeaderData(data?.data?.headerModelList?.items?.[0] || null);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{ padding: 10 }}>Loading header...</div>;
    if (!headerData) return <div>Error loading header</div>;

    const { logo, navLinks } = headerData;

    const navArray = [];
    const rawLinks = Array.isArray(navLinks) ? navLinks : [navLinks];

    rawLinks.forEach((raw) => {
        Object.keys(raw)
            .filter((k) => k.startsWith("title"))
            .forEach((titleKey) => {
                const suffix = titleKey.replace("title", "");
                const pathKey = suffix ? `path${suffix}` : "path";

                if (raw[titleKey] && raw[pathKey]) {
                    navArray.push({
                        title: raw[titleKey],
                        path: raw[pathKey],
                        sublinks: suffix === "" ? raw.sublinks || [] : [],
                    });
                }
            });
    });

    const leftNav = navArray.slice(0, 3);
    const rightNav = navArray.slice(3);

    const linkStyle = {
        textDecoration: "none",
        color: "white",
        fontWeight: "500",
    };

    return (
        <header style={{ fontFamily: "Arial", position: "relative" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 24px",
                backgroundColor: "rgb(110 154 177)",
            }}>

                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <AEMImage src={`${AEM_HOST}${logo._path}`} alt="logo" style={{ height: 50 }} />

                    {!isMobile &&
                        leftNav.map((nav, index) => {
                            const subArray = Array.isArray(nav.sublinks)
                                ? nav.sublinks
                                : nav.sublinks
                                    ? [nav.sublinks]
                                    : [];

                            return (
                                <div
                                    key={index}
                                    style={{ position: "relative" }}
                                    onMouseEnter={() => {
                                        if (timeoutRef.current) clearTimeout(timeoutRef.current);
                                        setHoveredIndex(index);
                                    }}
                                    onMouseLeave={() => {
                                        timeoutRef.current = setTimeout(() => setHoveredIndex(null), 200);
                                    }}
                                >
                                    <Link
                                        to={nav.path}
                                        style={{
                                            textDecoration: "none",
                                            color: "white",
                                            marginRight: 20,
                                            fontWeight: "500",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 4,
                                        }}
                                    >
                                        {nav.title}
                                    </Link>

                                    {hoveredIndex === index && subArray.length > 0 && (
                                        <div
                                            onMouseEnter={() => {
                                                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                                            }}
                                            onMouseLeave={() => {
                                                timeoutRef.current = setTimeout(() => setHoveredIndex(null), 200);
                                            }}
                                            style={{
                                                position: "absolute",
                                                top: "35px",
                                                left: 0,
                                                background: "rgb(110 154 177)",
                                                color: "#000",
                                                borderRadius: 6,
                                                padding: "2px",
                                                minWidth: 60,
                                                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                                zIndex: 10,
                                            }}
                                        >
                                            {subArray.map((sub, i) => (
                                                <Link
                                                    key={i}
                                                    to={`${nav.path}/${sub.path}`}
                                                    style={{
                                                        display: "block",
                                                        padding: "8px 12px",
                                                        textDecoration: "none",
                                                        color: "white",
                                                    }}
                                                >
                                                    {sub.title}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 15 }}>

                    {!isMobile && rightNav.map((nav, index) => (
                        <Link key={index} to={nav.path} style={linkStyle}>
                            {nav.title}
                        </Link>
                    ))}

                    {!isMobile && (
                        <div style={{ position: "relative" }}>
                            <FiSearch size={18} style={{
                                position: "absolute",
                                top: "50%",
                                left: 10,
                                transform: "translateY(-50%)",
                                color: "#555"
                            }} />
                            <input
                                placeholder="Search..."
                                style={{
                                    padding: "6px 10px 6px 32px",
                                    border: "1px solid #ccc",
                                    borderRadius: 4
                                }}
                            />
                        </div>
                    )}

                    <UserProfile />

                    {isMobile && (
                        <button onClick={() => setMenuOpen((prev) => !prev)}
                            style={{ background: "none", border: "none", color: "white" }}>
                            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    )}
                </div>
            </div>

            {isMobile && menuOpen && (
                <div style={{
                    backgroundColor: "#2e5060",
                    color: "white",
                    position: "absolute",
                    width: "100%",
                    zIndex: 100
                }}>
                    {navArray.map((nav, index) => {
                        const isExpanded = mobileExpandedIndex === index;
                        const subArray = nav.sublinks || [];

                        return (
                            <div key={index}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "12px 20px"
                                    }}
                                    onClick={() =>
                                        subArray.length > 0 &&
                                        setMobileExpandedIndex(isExpanded ? null : index)
                                    }
                                >
                                    <Link to={nav.path} style={{ color: "white" }}>
                                        {nav.title}
                                    </Link>

                                    {subArray.length > 0 && (
                                        <FiChevronDown
                                            style={{
                                                transform: isExpanded ? "rotate(180deg)" : ""
                                            }}
                                        />
                                    )}
                                </div>

                                {isExpanded && subArray.length > 0 && (
                                    <div style={{ background: "#243f4d" }}>
                                        {subArray.map((sub, i) => (
                                            <Link
                                                key={i}
                                                to={`${nav.path}/${sub.path}`}
                                                style={{
                                                    display: "block",
                                                    padding: "10px 30px",
                                                    color: "#cce0ea"
                                                }}
                                            >
                                                {sub.title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </header>
    );
}

export default Header;