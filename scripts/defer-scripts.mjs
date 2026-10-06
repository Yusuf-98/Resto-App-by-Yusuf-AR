import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const PAGES = ['.next/server/app/index.html'];

const SCRIPT_TAG =
  /<script src="(\/_next\/static\/chunks\/[^"]+)"((?: [a-zA-Z_-]+="[^"]*")*)><\/script>/g;
const SCRIPT_PRELOAD = /<link rel="preload" as="script"[^>]*\/>/g;

// --- Loader ---
const loader = (scripts) => `<script>(function(){var l=${JSON.stringify(scripts)},d=0;function g(){if(d)return;d=1;l.forEach(function(x){var e=document.createElement("script");e.src=x[0];e.async=true;if(x[1])e.id=x[1];document.head.appendChild(e)})}function a(){requestAnimationFrame(function(){setTimeout(g,0)})}setTimeout(g,3000);var i=document.querySelector('main img[fetchpriority="high"]');if(!i)return a();var p=i.complete?Promise.resolve():new Promise(function(r){i.addEventListener("load",r,{once:true});i.addEventListener("error",r,{once:true})});p.then(function(){return i.decode?i.decode().catch(function(){}):0}).then(a)})();</script>`;

// --- Rewrite ---
for (const page of PAGES) {
  if (!existsSync(page)) {
    console.warn(`defer-scripts: ${page} not found, skipped`);
    continue;
  }
  const html = readFileSync(page, 'utf8');
  const scripts = [];
  const stripped = html
    .replace(SCRIPT_TAG, (tag, src, attrs) => {
      if (/noModule/i.test(attrs)) return tag;
      const id = attrs.match(/ id="([^"]*)"/)?.[1] ?? '';
      scripts.push(id ? [src, id] : [src]);
      return '';
    })
    .replace(SCRIPT_PRELOAD, '');

  if (scripts.length === 0 || !stripped.includes('</body>')) {
    console.warn(`defer-scripts: no app scripts in ${page}, skipped`);
    continue;
  }
  writeFileSync(page, stripped.replace('</body>', `${loader(scripts)}</body>`));
  console.log(`defer-scripts: ${page} (${scripts.length} scripts)`);
}
