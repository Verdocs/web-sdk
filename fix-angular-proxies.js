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

  // // Fix invalid or missing type names in proxies (from diagnostics)
  // content = content.replace(/IVerdocsKbaDialogstring/g, 'any');
  // content = content.replace(/IRecipient/g, 'any');
  // content = content.replace(/IVerdocsKbaDialogIRecipient/g, 'any');

  fs.writeFileSync(proxiesPath, content, 'utf8');
}
else{
  console.error(`File not found: ${proxiesPath}`);
}
