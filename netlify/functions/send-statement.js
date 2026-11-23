/**
 * Netlify Function: email a processing statement from the "Get in touch" form.
 *
 * The contact form posts JSON here when the visitor attaches a statement. The
 * function checks the file, then emails it, with the visitor's details, to a
 * fixed internal address through Resend (https://resend.com/docs/api-reference/emails/send-email).
 * Replies go to the visitor.
 *
 * Environment variables (set in Netlify → Site configuration → Environment variables):
 *   RESEND_API_KEY        – Resend API key with permission to send
 *   STATEMENT_FROM_EMAIL  – sender, on a domain verified in Resend, e.g. "MerchantHaus <statements@merchant.haus>"
 *   STATEMENT_TO_EMAIL    – where statements are delivered, e.g. "support@merchanthaus.io"
 *
 * The recipient comes only from the environment, never from the request, so the
 * form can't be used to send mail anywhere else.
 */

// Base64 adds a third, and Netlify caps a synchronous function's request at 6 MB.
const MAX_FILE_BYTES = 4 * 1024 * 1024;

// Accepted types, each checked against the file's first bytes, not just its declared type.
const FILE_TYPES = {
  "application/pdf": { extension: "pdf", magic: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  "image/png": { extension: "png", magic: [0x89, 0x50, 0x4e, 0x47] },
  "image/jpeg": { extension: "jpg", magic: [0xff, 0xd8, 0xff] },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const respond = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

/* Single-line text: no line breaks (they would let a value add mail headers), trimmed and capped. */
const line = (value, max) =>
  typeof value === "string" ? value.replace(/[\r\n\t]+/g, " ").trim().slice(0, max) : "";

const paragraph = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return respond(405, { error: "Method not allowed" });
  }

  const { RESEND_API_KEY, STATEMENT_FROM_EMAIL, STATEMENT_TO_EMAIL } = process.env;
  if (!RESEND_API_KEY || !STATEMENT_FROM_EMAIL || !STATEMENT_TO_EMAIL) {
    console.error("send-statement: RESEND_API_KEY, STATEMENT_FROM_EMAIL and STATEMENT_TO_EMAIL must all be set");
    return respond(500, { error: "Statement uploads aren't set up yet. Please email your statement instead." });
  }

  let body;
  try {
    const raw = event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString("utf8") : event.body;
    body = JSON.parse(raw || "{}");
  } catch {
    return respond(400, { error: "Invalid request" });
  }

  // Honeypot: real visitors never see or fill this field.
  if (line(body.website, 200)) {
    return respond(200, { ok: true });
  }

  const name = line(body.name, 200);
  const email = line(body.email, 320);
  const phone = line(body.phone, 50);
  const company = line(body.company, 200);
  const message = paragraph(body.message, 5000);

  if (!name || !EMAIL_PATTERN.test(email)) {
    return respond(400, { error: "Please enter your name and a valid email address." });
  }

  const file = body.file || {};
  const fileType = FILE_TYPES[file.type];
  if (!fileType || typeof file.data !== "string") {
    return respond(400, { error: "Please attach a PDF, JPG or PNG file." });
  }

  const bytes = Buffer.from(file.data, "base64");
  if (bytes.length === 0 || bytes.length > MAX_FILE_BYTES) {
    return respond(400, { error: "The file must be 4 MB or smaller." });
  }
  if (!fileType.magic.every((byte, index) => bytes[index] === byte)) {
    return respond(400, { error: "That file doesn't look like a PDF, JPG or PNG." });
  }

  const baseName = line(file.name, 100)
    .replace(/\.[^.]*$/, "")
    .replace(/[^\w.-]+/g, "_")
    .replace(/^[._]+|[._]+$/g, "");
  const filename = `${baseName || "statement"}.${fileType.extension}`;

  const text = [
    "A processing statement was sent from the merchanthaus.io contact form.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "-"}`,
    `Company: ${company || "-"}`,
    "",
    "Message:",
    message || "-",
    "",
    `Attachment: ${filename} (${Math.ceil(bytes.length / 1024)} KB)`,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: STATEMENT_FROM_EMAIL,
        to: [STATEMENT_TO_EMAIL],
        reply_to: email,
        subject: `Statement from ${company || name}`,
        text,
        attachments: [{ filename, content: bytes.toString("base64") }],
      }),
    });

    if (!response.ok) {
      console.error("send-statement: Resend returned", response.status, await response.text());
      return respond(502, { error: "We couldn't send your statement. Please try again or email it to us." });
    }
  } catch (error) {
    console.error("send-statement: request to Resend failed", error);
    return respond(502, { error: "We couldn't send your statement. Please try again or email it to us." });
  }

  return respond(200, { ok: true });
};
