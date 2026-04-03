import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

const checks = [
  ['title tag', /<title>[^<]+<\/title>/i],
  ['meta description', /<meta\s+name="description"\s+content="[^"]+"/i],
  ['canonical', /<link\s+rel="canonical"\s+href="[^"]+"/i],
  ['og:title', /<meta\s+property="og:title"\s+content="[^"]+"/i],
  ['twitter card', /<meta\s+name="twitter:card"\s+content="[^"]+"/i],
  ['howto schema', /"@type"\s*:\s*"HowTo"/i],
  ['faq schema', /"@type"\s*:\s*"FAQPage"/i],
  ['software schema', /"@type"\s*:\s*"SoftwareApplication"/i],
  ['primary keyword', /paid discord community/i],
  ['secondary keyword', /secure discord invite system/i],
  ['lead form', /id="lead-form"/i],
  ['pricing section', /id="pricing"/i],
  ['comparison section', /id="compare"/i],
  ['last updated signal', /Last updated:\s*April\s*2026/i],
  ['h1 heading', /<h1[\s\S]*?<\/h1>/i]
];

const failures = checks.filter(([, regex]) => !regex.test(html));

if (failures.length) {
  console.error('SEO validation failed for:');
  for (const [name] of failures) {
    console.error(`- ${name}`);
  }
  process.exit(1);
}

console.log(`SEO validation passed (${checks.length} checks).`);
