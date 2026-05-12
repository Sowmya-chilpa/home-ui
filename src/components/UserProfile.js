import { useEffect, useRef, useState } from "react";
import { FiUser } from "react-icons/fi";

const AEM_HOST = "https://katrina-nonmonogamous-pseudofamously.ngrok-free.dev";
const ENDPOINT = `${AEM_HOST}/content/cq:graphql/TDTraining/endpoint.json`;

function UserProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

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
                    userProfileModelList {
                        items {
                            myProfile
                            myProfileLink
                            logout
                            logoutLink
                            loginLink
                            loginsignup
                        }
                    }
                }`,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setProfile(data.data.userProfileModelList.items[0]);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} style={{ position: "relative" }}>
            <div
                onClick={() => setOpen((prev) => !prev)}
                style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: open ? "rgb(110, 154, 177)" : "#f0f0f0",
                    border: open ? "2px solid white" : "2px solid transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                }}
            >
                <FiUser size={18} color={open ? "white" : "#333"} />
            </div>

            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 10px)",
                        right: 0,
                        minWidth: "200px",
                        width: "max-content",
                        background: "rgb(110 154 177)",
                        borderRadius: "10px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                        zIndex: 200,
                        overflow: "hidden",
                    }}
                >
                    {loading ? (
                        <p style={{ padding: "12px 16px", margin: 0, color: "#888", fontSize: 14 }}>
                            Loading...
                        </p>
                    ) : error ? (
                        <p style={{ padding: "12px 16px", margin: 0, color: "red", fontSize: 14 }}>
                            Error: {error}
                        </p>
                    ) : profile && (
                        <>
                            <a href={profile.myProfileLink} style={dropdownLinkStyle} onClick={() => setOpen(false)}>
                                {profile.myProfile}
                            </a>

                            <a href={profile.logoutLink} style={dropdownLinkStyle} onClick={() => setOpen(false)}>
                                {profile.logout}
                            </a>


                            <a
                                href={profile.loginLink}
                                style={{
                                    ...dropdownLinkStyle,
                                    fontWeight: "bold",
                                    borderBottom: "none",
                                    color: "white",
                                }}
                                onClick={() => setOpen(false)}
                            >
                                {profile.loginsignup}
                            </a>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

const dropdownLinkStyle = {
    display: "block",
    padding: "12px 16px",
    textDecoration: "none",
    color: "white",
    fontSize: 14,
    borderBottom: "1px solid #f0f0f0",
};

export default UserProfile;