const fs = require('fs');
const path = require('path');
const sharp = require('./prototype/node_modules/sharp');

const photoDir = path.resolve('./Photographs');
const outDir = path.resolve('./assets/images');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Processing photographs...');

  // 1. Facilities
  // Classroom: Screenshot 2026-10-14 192717.png (361x271). Photo is approx x:22, y:22, w:317, h:116
  await sharp(path.join(photoDir, 'Screenshot 2026-10-14 192717.png'))
    .extract({ left: 22, top: 22, width: 317, height: 116 })
    .toFile(path.join(outDir, 'facility-classrooms.png'));

  // Science Lab: Screenshot 2026-10-14 192723.png (356x256). Photo: left:22, top:22, width:312, height:116
  await sharp(path.join(photoDir, 'Screenshot 2026-10-14 192723.png'))
    .extract({ left: 22, top: 22, width: 312, height: 116 })
    .toFile(path.join(outDir, 'facility-science-labs.png'));

  // College Library: Screenshot 2026-10-14 192729.png (368x255). Photo: left:22, top:22, width:324, height:116
  await sharp(path.join(photoDir, 'Screenshot 2026-10-14 192729.png'))
    .extract({ left: 22, top: 22, width: 324, height: 116 })
    .toFile(path.join(outDir, 'facility-library.png'));

  // Computers: Screenshot 2026-10-14 192734.png (360x262). Photo: left:22, top:22, width:316, height:116
  await sharp(path.join(photoDir, 'Screenshot 2026-10-14 192734.png'))
    .extract({ left: 22, top: 22, width: 316, height: 116 })
    .toFile(path.join(outDir, 'facility-computers.png'));

  // Sports: Screenshot 2026-10-14 192739.png (352x271). Photo: left:22, top:22, width:308, height:116
  await sharp(path.join(photoDir, 'Screenshot 2026-10-14 192739.png'))
    .extract({ left: 22, top: 22, width: 308, height: 116 })
    .toFile(path.join(outDir, 'facility-sports.png'));

  // Transport Bus: Screenshot 2026-10-14 192743.png (363x257). Photo: left:22, top:22, width:319, height:116
  await sharp(path.join(photoDir, 'Screenshot 2026-10-14 192743.png'))
    .extract({ left: 22, top: 22, width: 319, height: 116 })
    .toFile(path.join(outDir, 'facility-transport.png'));

  // Common Room: Screenshot 2026-10-14 192747.png (365x265). Photo: left:22, top:22, width:321, height:116
  await sharp(path.join(photoDir, 'Screenshot 2026-10-14 192747.png'))
    .extract({ left: 22, top: 22, width: 321, height: 116 })
    .toFile(path.join(outDir, 'facility-common-room.png'));

  // Cultural Activities: Screenshot 2026-10-14 192751.png (358x262). Photo: left:22, top:22, width:314, height:116
  await sharp(path.join(photoDir, 'Screenshot 2026-10-14 192751.png'))
    .extract({ left: 22, top: 22, width: 314, height: 116 })
    .toFile(path.join(outDir, 'facility-cultural.png'));

  // 2. About College Building
  // Screenshot 2026-10-14 191707.png (429x207). Right card visual: approx left: 215, top: 65, width: 206, height: 98
  await sharp(path.join(photoDir, 'Screenshot 2026-10-14 191707.png'))
    .extract({ left: 215, top: 65, width: 206, height: 98 })
    .toFile(path.join(outDir, 'about-college-building.png'));

  // 3. Academics - Arts Stream
  // Screenshot 2026-10-14 191713.png (447x241). Center visual frame: approx left: 210, top: 114, width: 82, height: 112
  await sharp(path.join(photoDir, 'Screenshot 2026-10-14 191713.png'))
    .extract({ left: 210, top: 114, width: 82, height: 112 })
    .toFile(path.join(outDir, 'academics-arts.png'));

  console.log('All extracted successfully!');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
