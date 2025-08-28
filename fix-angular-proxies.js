const fs = require('fs');
const path = require('path');

const proxiesPath = path.join(__dirname, 'verdocs-web-sdk-angular', 'src', 'directives', 'proxies.ts');

if (fs.existsSync(proxiesPath)) {
  let content = fs.readFileSync(proxiesPath, 'utf8');
  // Fix import path
  content = content.replace(/from '@verdocs\/web-sdk\/dist\/components'/g, "from '@verdocs/web-sdk'");

  // Fix invalid [object Object] type annotations in EventEmitter generics
  // Replace {col: [object Object]} with {col: any}
  content = content.replace(/CustomEvent<\{col: \[object Object\]\}>/g, 'CustomEvent<{col: any}>');
  content = content.replace(/CustomEvent<\{tab: \[object Object\]; index: number\}>/g, 'CustomEvent<{tab: any; index: number}>');

  // Also fix property signatures (not just EventEmitter instantiations)
  content = content.replace(/colHeaderClick: EventEmitter<CustomEvent<\{col: \[object Object\]\}>>;/g, 'colHeaderClick: EventEmitter<CustomEvent<{col: any}>>;');
  content = content.replace(/selectTab: EventEmitter<CustomEvent<\{tab: \[object Object\]; index: number\}>>;/g, 'selectTab: EventEmitter<CustomEvent<{tab: any; index: number}>>;');

  // Fix invalid or missing type names in proxies (from diagnostics)
  content = content.replace(/IVerdocsKbaDialogstring/g, 'string');
  // Only replace IRecipient when it's not already part of IVerdocsKbaDialogIRecipient
  // Replace all IVerdocsKbaDialogIRecipient with IRecipient (since only IRecipient is exported)
  content = content.replace(/IVerdocsKbaDialogIRecipient/g, 'IRecipient');
  // Remove the import alias for IVerdocsKbaDialogIRecipient if present
  content = content.replace(
    /import type \{ IRecipient as IVerdocsKbaDialogIRecipient \} from '@verdocs\/web-sdk';\n?/g,
    ''
  );
  // Ensure import for IRecipient exists
  if (!content.includes("import type { IRecipient } from '@verdocs/web-sdk';")) {
    content = content.replace(
      /(import type \{[^\}]*)(\} from '@verdocs\/web-sdk';)/,
      (match, p1, p2) => {
        if (p1.includes('IRecipient')) return match;
        return `${p1}, IRecipient${p2}`;
      }
    );
  }

  // Remove duplicate imports for IRecipient from '@verdocs/web-sdk'
  const importLines = content.split('\n').filter(line =>
    line.trim().startsWith("import type {") && line.includes("IRecipient") && line.includes("@verdocs/web-sdk")
  );
  if (importLines.length > 1) {
    // Keep only the first occurrence
    let firstFound = false;
    content = content.split('\n').filter(line => {
      if (
        line.trim().startsWith("import type {") &&
        line.includes("IRecipient") &&
        line.includes("@verdocs/web-sdk")
      ) {
        if (!firstFound) {
          firstFound = true;
          return true;
        }
        return false;
      }
      return true;
    }).join('\n');
  }

  // Replace all IVerdocsEnvelopeUpdateRecipientIRecipient with IRecipient
  content = content.replace(/IVerdocsEnvelopeUpdateRecipientIRecipient/g, 'IRecipient');
  // Remove the import alias for IVerdocsEnvelopeUpdateRecipientIRecipient if present
  content = content.replace(
    /import type \{ IRecipient as IVerdocsEnvelopeUpdateRecipientIRecipient \} from '@verdocs\/web-sdk';\n?/g,
    ''
  );
  // Deduplicate IRecipient import again in case it was added
  const iRecipientImportLines = content.split('\n').filter(line =>
    line.trim().startsWith("import type {") && line.includes("IRecipient") && line.includes("@verdocs/web-sdk")
  );
  if (iRecipientImportLines.length > 1) {
    let firstFound = false;
    content = content.split('\n').filter(line => {
      if (
        line.trim().startsWith("import type {") &&
        line.includes("IRecipient") &&
        line.includes("@verdocs/web-sdk")
      ) {
        if (!firstFound) {
          firstFound = true;
          return true;
        }
        return false;
      }
      return true;
    }).join('\n');
  }

  fs.writeFileSync(proxiesPath, content, 'utf8');
}
else{
  console.error(`File not found: ${proxiesPath}`);
}
