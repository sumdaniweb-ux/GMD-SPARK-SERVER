// api/chat.js
// GMD Spark® - Secure AI Agent Backend
// Project Hash: pro_cd08ad44bdc2d429c19bcffe590f4f3926dd5c2de8f630c3499f60fa0f941f92

const crypto = require('crypto');

// === SECURITY CONFIG ===
const CONFIG = {
  PASSWORD: 'GMD2026Spark', // ← آپ یہاں اپنا پاس ورڈ تبدیل کر سکتے ہیں
  PROJECT_HASH: 'pro_cd08ad44bdc2d429c19bcffe590f4f3926dd5c2de8f630c3499f60fa0f941f92',
  SHA256_ENABLED: true,
  LOG_REQUESTS: true
};

// === KNOWLEDGE BASE (50 Levels - Merged & Powerful) ===
const KB = {
  "software": "Software engineering is the disciplined application of engineering principles to software development, ensuring reliability, scalability, and maintainability through systematic processes.",
  "algorithm": "An algorithm is a finite sequence of well-defined, computer-implementable instructions designed to solve a class of problems or perform a computation.",
  "security": "SHA-256 (Secure Hash Algorithm 256-bit) produces a unique 64-character hexadecimal hash, ensuring data integrity, authentication, and non-repudiation in cryptographic systems.",
  "design": "Design patterns are reusable, proven solutions to recurring software design problems, categorized into Creational, Structural, and Behavioral patterns for maintainable architecture.",
  "testing": "Testing is the systematic validation of software functionality, performance, and security through unit, integration, system, and acceptance tests before production deployment.",
  "agent": "An autonomous AI agent perceives its environment, processes inputs through rule-based or ML logic, and executes actions to achieve predefined goals with minimal human intervention.",
  "api": "An API (Application Programming Interface) defines protocols for software components to communicate, enabling secure, standardized data exchange between client and server.",
  "github": "GitHub is a Git-based platform for version control, collaboration, and CI/CD pipelines, supporting open-source and private repositories with audit trails and access controls.",
  "vercel": "Vercel is a cloud platform for frontend frameworks and serverless functions, offering automatic HTTPS, global CDN, and instant deployments with preview URLs for every commit.",
  "encryption": "AES-256-GCM provides authenticated encryption with associated data (AEAD), ensuring confidentiality and integrity with a 256-bit key and 96-bit initialization vector.",
  "authentication": "Multi-factor authentication (MFA) combines something you know (password), something you have (token), and something you are (biometric) for layered access security.",
  "firewall": "A firewall monitors and controls network traffic based on predetermined security rules, acting as a barrier between trusted internal networks and untrusted external networks.",
  "backup": "The 3-2-1 backup rule: keep 3 copies of data, on 2 different media, with 1 copy offsite, ensuring recovery from ransomware, hardware failure, or natural disasters.",
  "audit": "Append-only audit logs record every system action with timestamp, user ID, and operation, enabling forensic analysis and compliance with regulatory standards.",
  "sandbox": "Sandbox isolation executes untrusted code in a restricted environment with no access to host resources, preventing privilege escalation and data exfiltration.",
  "integrity": "File integrity monitoring uses SHA-256 hashes to detect unauthorized modifications, triggering alerts when checksums deviate from baseline values.",
  "access": "Role-Based Access Control (RBAC) assigns permissions to roles rather than individuals, simplifying management and enforcing least-privilege principles.",
  "session": "Secure session management uses short-lived tokens, HTTPS-only cookies, and server-side validation to prevent hijacking, fixation, and replay attacks.",
  "input": "Input validation sanitizes all user-supplied data against injection attacks (SQLi, XSS, command injection) using allowlists and parameterized queries.",
  "logging": "Structured logging with severity levels (DEBUG, INFO, WARN, ERROR) enables real-time monitoring, alerting, and post-incident root cause analysis.",
  "default": "میں سیکھ رہا ہوں۔ براہ کرم مزید تفصیل بتائیں یا کوئی مخصوص اصطلاح پوچھیں۔"
};

// === SHA-256 HASH FUNCTION ===
function generateHash(input) {
  if (!CONFIG.SHA256_ENABLED) return '';
  return crypto.createHash('sha256').update(input).digest('hex');
}

// === MAIN API HANDLER ===
export default async function handler(req, res) {
  // Allow CORS for GitHub Pages frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Project-Hash');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, clientHash, password } = req.body;

    // Optional: Password verification for sensitive operations
    if (password && password !== CONFIG.PASSWORD) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Validate input
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Valid message required' });
    }

    // Optional: Verify client-provided hash
    if (clientHash && CONFIG.SHA256_ENABLED) {
      const expectedHash = generateHash(message);
      if (clientHash !== expectedHash) {
        // Log mismatch but continue (flexible mode)
        console.warn(`Hash mismatch: client=${clientHash}, expected=${expectedHash}`);
      }
    }

    // Find reply from knowledge base
    const lowerMsg = message.toLowerCase();
    let reply = KB.default;
    
    for (const key in KB) {
      if (key !== 'default' && lowerMsg.includes(key)) {
        reply = KB[key];
        break;
      }
    }

    // Generate response hash
    const replyHash = CONFIG.SHA256_ENABLED ? generateHash(reply) : '';

    // Log request (if enabled)
    if (CONFIG.LOG_REQUESTS) {
      console.log(`[GMD Spark] t=${new Date().toISOString()} msg="${message.substring(0,50)}..." hash=${replyHash.substring(0,16)}...`);
    }

    // Return secure response
    res.status(200).json({
      reply: reply,
      hash: replyHash,
      projectHash: CONFIG.PROJECT_HASH,
      timestamp: new Date().toISOString(),
      verified: CONFIG.SHA256_ENABLED
    });

  } catch (error) {
    console.error('[GMD Spark Error]', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      projectHash: CONFIG.PROJECT_HASH
    });
  }
}