const fs = require('fs');
const path = require('path');

// 1. Define local directories and files to scan
const PUBLIC_DIR = './';
const EXCLUDE_DIRS = ['.git', '.github', 'node_modules'];

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(file)) {
        getFiles(filePath, fileList);
      }
    } else {
      // Include HTML, CSS, JS, JSON, and common image types
      if (/\.(html|css|js|json|png|jpg|jpeg|svg|ico|webp)$/i.test(file)) {
        let relativePath = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
        if (!relativePath.startsWith('/')) {
          relativePath = '/' + relativePath;
        }
        fileList.push(relativePath);
      }
    }
  });
  return fileList;
}

const localAssets = getFiles(PUBLIC_DIR);

// 2. Add external dependencies (like Google Fonts) explicitly
const externalAssets = [
  'https://fonts.googleapis.com/css2?family=Jost:wght@100;200;300;400;500;600;700;800;900&display=swap'
];

const allAssets = Array.from(new Set([...localAssets, ...externalAssets]));

// 3. Generate a unique version hash based on asset count & timestamp
const cacheVersion = 'ror-pwa-' + Date.now();

// 4. Read and update sw.js template
const swTemplatePath = './sw.js';
if (fs.existsSync(swTemplatePath)) {
  let swContent = fs.readFileSync(swTemplatePath, 'utf8');

  // Replace cache name
  swContent = swContent.replace(
    /const CACHE_NAME = ['"].*?['"];/,
    `const CACHE_NAME = '${cacheVersion}';`
  );

  // Replace precache array
  swContent = swContent.replace(
    /const PRECACHE_ASSETS = \[[\s\S]*?\];/,
    `const PRECACHE_ASSETS = ${JSON.stringify(allAssets, null, 2)};`
  );

  fs.writeFileSync(swTemplatePath, swContent, 'utf8');
  console.log(`Successfully updated sw.js with ${allAssets.length} assets and cache name ${cacheVersion}`);
} else {
  console.error('Error: sw.js template not found in root directory.');
}
