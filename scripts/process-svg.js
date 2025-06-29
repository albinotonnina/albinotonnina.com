import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import SVGIdProcessor from '../src/utils/svg-id-processor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgPath = path.resolve(__dirname, '../src/scene/scene.svg');
const processor = new SVGIdProcessor({
  cleanName: 'framemask_1_' // This will generate 'framemask_1_' to match your transitions.js
});

if (fs.existsSync(svgPath)) {
  console.log('Processing SVG file...');
  
  const content = fs.readFileSync(svgPath, 'utf8');
  const processedContent = processor.process(content);
  
  // Write processed content directly (no backup)
  fs.writeFileSync(svgPath, processedContent);
  
  console.log('✅ SVG processed successfully!');
  console.log('🎯 Generated clean ID: framemask_1_');
  console.log('✨ Your transitions.js clipPath reference will now work correctly!');
} else {
  console.error('❌ SVG file not found:', svgPath);
}
