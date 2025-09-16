const fs = require('fs');
const path = process.argv[2];
if (!fs.existsSync(path)) {
  console.error(`Entry file not found: ${path}`);
  process.exit(1);
}
let src = fs.readFileSync(path, 'utf8');

let changed = false;

// Ensure PORT usage
if (!/process\.env\.PORT/.test(src)) {
  // Replace common patterns of listen(5000) etc; otherwise add a safe snippet near the first listen
  const listenRe = /(app|server)\.listen\(([^,]+)(,|\))/;
  if (listenRe.test(src)) {
    src = src.replace(listenRe, (m, who, portExpr, tail) => {
      return `${who}.listen(process.env.PORT || ${portExpr}${tail}`;
    });
    changed = true;
  } else {
    // No explicit listen found or unusual; append a safe listener if none exists
    if (!/\.listen\(/.test(src)) {
      src += `

const PORT = process.env.PORT || 5000;
if (typeof app !== 'undefined' && app && typeof app.listen === 'function') {
  app.listen(PORT, () => console.log('API listening on', PORT));
}
`;
      changed = true;
    }
  }
}

// Ensure CORS for Pages
if (!/cors\(/.test(src)) {
  // Try to place after express app creation
  // find a likely "const app = express()" line
  const appDecl = src.match(/const\s+app\s*=\s*express\s*\(\s*\)\s*;?/);
  if (appDecl) {
    const insertAt = src.indexOf(appDecl[0]) + appDecl[0].length;
    const corsBlock = `

const cors = require('cors');
app.use(cors({ origin: 'https://panith-qc.github.io', credentials: true }));
`;
    src = src.slice(0, insertAt) + corsBlock + src.slice(insertAt);
    // Add require('cors') only if not present already (above already does require)
    changed = true;
  } else {
    // Fallback: prepend a generic CORS setup (may need minor manual tweak if no "app")
    if (!/require\(['"]cors['"]\)/.test(src)) {
      src = `const cors = require('cors');\n` + src;
    }
    if (/app\s*\./.test(src) && !/app\.use\s*\(\s*cors/.test(src)) {
      src = src.replace(/(app\s*=\s*express\s*\(\s*\)\s*;?)/, `$1\napp.use(cors({ origin: 'https://panith-qc.github.io', credentials: true }));\n`);
      changed = true;
    }
  }
}

// Ensure require('express')/app exists? (we won't fabricate a full app if it's not Express)
if (!/express\(/.test(src)) {
  // If it's not an Express app, we won't try to remodel. CORS step may not apply.
}

if (changed) {
  fs.writeFileSync(path, src);
  console.log(`[patched] ${path}`);
} else {
  console.log(`[ok] ${path} already had PORT & CORS patterns`);
}
