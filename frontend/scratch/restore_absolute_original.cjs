const fs = require('fs');
const path = require('path');

const transcriptPath = 'C:\\Users\\MANAN\\.gemini\\antigravity-ide\\brain\\d6885ee1-fd72-4a9c-9bef-7cd835b8ffac\\.system_generated\\logs\\transcript_full.jsonl';
const outputBase = 'C:\\Users\\MANAN\\Desktop\\kr rutvi\\frontend';

const targetFiles = [
  'src/components/property/PropertyCard.jsx',
  'src/components/home/HeroBanner.jsx',
  'src/components/home/QuickFilterBar.jsx',
  'src/components/property/PropertyFilterBar.jsx',
  'src/components/layout/Navbar.jsx',
  'src/components/layout/Footer.jsx',
  'src/pages/public/Home.jsx',
  'src/pages/public/Properties.jsx',
  'src/pages/public/Contact.jsx',
  'src/pages/public/About.jsx',
  'src/pages/public/Services.jsx',
  'src/components/ui/Button.jsx',
  'src/components/ui/Badge.jsx',
  'src/components/ui/PropertyCard.jsx',
  'src/pages/public/PropertyDetail.jsx',
  'src/components/home/PartnersMarquee.jsx',
  'src/components/home/NewProperties.jsx',
  'src/components/home/ServicesPreview.jsx'
];

let fileVersions = {};

const lines = fs.readFileSync(transcriptPath, 'utf-8').split('\n');

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const entry = JSON.parse(line);
    
    if (entry.type === 'VIEW_FILE' && entry.content) {
       if (entry.content.includes('File Path: `file:///c:/Users/MANAN/Desktop/kr%20rutvi/frontend/')) {
         
         const pathMatch = entry.content.match(/File Path: `file:\/\/\/c:\/Users\/MANAN\/Desktop\/kr%20rutvi\/frontend\/(.*?)`/i);
         
         if (pathMatch) {
            let relativePath = pathMatch[1].replace(/%20/g, ' ');
            
            // We want the FIRST occurrence, so if it's already recorded, we skip it
            if (targetFiles.includes(relativePath) && !fileVersions[relativePath]) {
               
               let codeContent = '';
               const clines = entry.content.split('\n');
               let started = false;
               for (let cline of clines) {
                  const codeMatch = cline.match(/^\d+:\s(.*)$/);
                  const emptyLineMatch = cline.match(/^\d+:$/);
                  
                  if (codeMatch) {
                     codeContent += codeMatch[1] + '\n';
                     started = true;
                  } else if (emptyLineMatch) {
                     codeContent += '\n';
                     started = true;
                  } else if (started && (cline.includes("The above content shows the entire") || cline.includes("The above content does NOT show"))) {
                     break;
                  }
               }
               
               if (codeContent) {
                 fileVersions[relativePath] = {
                    content: codeContent
                 };
               }
            }
         }
       }
    }
  } catch(e) {}
}

let restoredCount = 0;
for (const relPath in fileVersions) {
   const fullPath = path.join(outputBase, relPath);
   fs.writeFileSync(fullPath, fileVersions[relPath].content, 'utf-8');
   console.log(`Restored absolute original: ${relPath}`);
   restoredCount++;
}

console.log(`Done restoring ${restoredCount} files.`);
