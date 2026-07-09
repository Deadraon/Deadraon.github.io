import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

/**
 * Creates a new GramJS TelegramClient.
 * Call `await client.connect()` before use and `await client.disconnect()` after.
 *
 * @param sessionString - The serialized session string from a prior login (or empty string for a fresh client)
 */
export function createTelegramClient(sessionString = ""): TelegramClient {
  const session = new StringSession(sessionString);
  const apiId = parseInt(process.env.TELEGRAM_API_ID || "0", 10);
  const apiHash = process.env.TELEGRAM_API_HASH || "placeholder_hash";

  const client = new TelegramClient(
    session,
    isNaN(apiId) ? 0 : apiId,
    apiHash,
    {
      connectionRetries: 5,
    }
  );
  return client;
}
