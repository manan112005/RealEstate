const fs = require('fs');
const path = require('path');

const directory = 'c:/Users/MANAN/Desktop/kr rutvi/frontend/src';

const reverseReplacements = {
  'text-neutral-offwhite/80': 'text-gray-200',
  'text-neutral-offwhite/90': 'text-gray-100',
  'text-neutral-offwhite': 'text-gray-100',
  'border-navy-deep/20': 'border-gray-800',
  'bg-neutral-border': 'bg-gray-200',
  'bg-semantic-success/5': 'bg-green-50'
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      const keys = Object.keys(reverseReplacements).sort((a, b) => b.length - a.length);

      for (const key of keys) {
        content = content.split(key).join(reverseReplacements[key]);
      }

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(directory);
console.log("Cleanup complete.");
