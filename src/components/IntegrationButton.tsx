"use client";

import { ConnectButton } from "@openint/connect";
import { useEffect, useState } from "react";

export function IntegrationsButton({ className }: { className?: string }) {
  const [token, setToken] = useState<string | null>();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch("/api/integration", {
          method: "POST",
        });
        const data = await res.json();
        if (data.token) {
          setToken(data.token);
        }
      } catch (error) {
        console.error("Error loading the integrations button", error);
      }
    };

    fetchToken();
  }, []);

  if (!token) {
    // if the backend does not return a token its most likely because an OPENINT_API_KEY is not set, so don't render the button
    console.warn(
      "No token returned from backend, not rendering integrations button"
    );
    return null;
  }

  return (
    <div>
      <p
        style={{
          marginBottom: "0.5rem",
          fontSize: "1rem", // Increased font size
          color: "#4b5563", // Darker gray text color
        }}
      >
        Suggestions
      </p>
      <ConnectButton
        token={token}
        text={"Manage Integrations"}
        buttonStyle={
          {
            borderRadius: "9999px",
            padding: "0.5rem 1rem",
            border: "none", // Remove border
            backgroundColor: "white", // Set background to white
          } as any
        }
        className={className + " mb-2"}
        // baseURL="http://localhost:4000/connect"
      />
    </div>
  );
}
