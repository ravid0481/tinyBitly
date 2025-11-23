import { sql } from "./db.js";

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

// Validate custom code format
export function validateCodeFormat(code) {
  return CODE_REGEX.test(code);
}

// Generate random 6-character code (A–Z a–z 0–9)
function generateRandomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 6;
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// List all links for dashboard
export async function listLinks() {
  const rows = await sql`
    SELECT code, url, total_clicks, last_clicked, created_at
    FROM links
    ORDER BY created_at DESC
  `;
  return rows;
}

// Retrieve one link (for stats page & API)
export async function getLinkByCode(code) {
  const rows = await sql`
    SELECT code, url, total_clicks, last_clicked, created_at
    FROM links
    WHERE code = ${code}
    LIMIT 1
  `;
  return rows[0] || null;
}

// Create a new link (auto or custom code)
export async function createLink(url, customCode) {
  const maxAttempts = 5; // ✅ THIS WAS MISSING

  // If user provided custom code, validate and ensure uniqueness
  if (customCode) {
    if (!validateCodeFormat(customCode)) {
      const err = new Error("Invalid code format");
      err.code = "INVALID_CODE";
      throw err;
    }

    const existing = await getLinkByCode(customCode);
    if (existing) {
      const err = new Error("Code already exists");
      err.code = "CODE_EXISTS";
      throw err;
    }

    const rows = await sql`
      INSERT INTO links (code, url)
      VALUES (${customCode}, ${url})
      RETURNING code, url, total_clicks, last_clicked, created_at
    `;
    return rows[0];
  }

  // Otherwise generate a random code and insert, retry a few times on collision
  for (let i = 0; i < maxAttempts; i++) {
    const code = generateRandomCode();

    try {
      const rows = await sql`
        INSERT INTO links (code, url)
        VALUES (${code}, ${url})
        RETURNING code, url, total_clicks, last_clicked, created_at
      `;
      return rows[0];
    } catch (err) {
      // Unique violation on "code" column (Postgres error code 23505)
      if (err.code === "23505") {
        // try again with another random code
        continue;
      }
      throw err;
    }
  }

  const err = new Error("Failed to generate unique code");
  err.code = "GENERATION_FAILED";
  throw err;
}

// Delete a link
export async function deleteLink(code) {
  await sql`
    DELETE FROM links
    WHERE code = ${code}
  `;
}

// Redirect: increment count + return target URL
export async function recordClickAndGetUrl(code) {
  const rows = await sql`
    UPDATE links
    SET total_clicks = total_clicks + 1,
        last_clicked = NOW()
    WHERE code = ${code}
    RETURNING url
  `;
  return rows[0]?.url || null;
}
