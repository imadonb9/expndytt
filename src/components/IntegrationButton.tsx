"use client";

import { ConnectButton } from "@openint/connect";
import { useEffect, useState } from "react";

export function IntegrationsButton({
  className,
  onPrompt,
}: {
  className?: string;
  onPrompt: (prompt: string) => void;
}) {
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
      <p className="mb-2 text-base text-gray-600">Suggestions</p>
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
        onEvent={(event) => {
          if (event.name === "connect.connection-connected") {
            const prompt = event?.prompt;
            if (prompt) {
              onPrompt(prompt);
            }
          }
        }}
        className={className + " mb-2"}
      />
    </div>
  );
}
