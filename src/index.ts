import * as pendo from "pendo-server-sdk";
import { createApp } from "./app.js";

// Pendo Agent Analytics for the Tripwise Assistant (POST /api/assistant/chat). Set PENDO_DISABLED=true to turn it off.
pendo.init({
  apiKey: "d5a259bc-1779-476f-9e64-593e68cb69e9",
  agentId: "7NO7M6iYEWEBt_CLtPamWbcQpUo",
  endpoint: "https://app.pendo-dev.pendo-dev.com",
  autoPatch: true,
});

const port = Number(process.env.PORT) || 3001;
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

const server = createApp(corsOrigin).listen(port, () => {
  console.log(`Tripwise API on port ${port}, allowing ${corsOrigin}`);
});

// Send the last buffered Pendo events before the server goes away.
server.on("close", () => {
  void pendo.shutdown();
});

async function stop(): Promise<void> {
  await pendo.shutdown();
  process.exit(0);
}

process.on("SIGINT", () => void stop());
process.on("SIGTERM", () => void stop());
