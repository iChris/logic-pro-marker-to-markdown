
const fs = require('fs');

const examples = ` 	 01:00:25.000	 Xmas catch up	 00:00:00.001	
 	 01:06:55.409	 Amazon killed Christmas	 00:00:00.001	
 	 01:13:19.687	 Sponsor: Studioworks	 00:00:00.001	
 	 01:15:37.210	 A year in ADHD land	 00:00:00.001	
 	 01:22:29.834	 Predictions for 2026	 00:00:00.001	
 	 01:24:15.000	 Web component based framework	 00:00:00.001	
 	 01:35:12.645	 Sanitization API	 00:00:00.001	
 	 01:46:48.908	 Self publishing in 2026	 00:00:00.001	
 	 01:58:55.429	 Learning the fundamentals vs using AI	 00:00:00.001	
 	 02:10:47.250	 Final hot take for 2026!	 00:00:00.001`;

const expectedOutput = `* **[00:00:25](#t=00:00:25)** Xmas catch up
* **[00:06:55](#t=00:06:55)** Amazon killed Christmas
* **[00:13:19](#t=00:13:19)** Sponsor: Studioworks
* **[00:15:37](#t=00:15:37)** A year in ADHD land
* **[00:22:29](#t=00:22:29)** Predictions for 2026
* **[00:24:15](#t=00:24:15)** Web component based framework
* **[00:35:12](#t=00:35:12)** Sanitization API
* **[00:46:48](#t=00:46:48)** Self publishing in 2026
* **[00:58:55](#t=00:58:55)** Learning the fundamentals vs using AI
* **[01:10:47](#t=01:10:47)** Final hot take for 2026!`;

function parseTimecode(tc) {
  // Expected format HH:MM:SS:FF.SS
  const parts = tc.split(/[:.]/);
  // parts[0] = HH, parts[1] = MM, parts[2] = SS, parts[3] = FF, parts[4] = SubFrames
  if (parts.length < 3) return null;
  const h = parseInt(parts[0] || '0', 10);
  const m = parseInt(parts[1] || '0', 10);
  const s = parseInt(parts[2] || '0', 10);
  return h * 3600 + m * 60 + s;
}

function formatSeconds(totalSeconds) {
  // Only HH:MM:SS format requested
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  
  const pad = (n) => n.toString().padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function process(lines) {
  const resultLines = [];
  const startOffsetSeconds = 3600; // 1 hour offset

  for (const line of lines) {
    if (!line.trim()) continue;
    
    // Extract time and title
    const parts = line.trim().split(/\t+|\s{2,}/);
    if (parts.length < 2) continue;
    
    const timeStr = parts[0].trim();
    const title = parts[1].trim();
    
    // Parse time
    const totalSeconds = parseTimecode(timeStr);
    
    // Offset subtraction
    let adjustedSeconds = totalSeconds - startOffsetSeconds;
    
    if (adjustedSeconds < 0) adjustedSeconds = 0; // Prevent negative time

    // Format
    const formattedTime = formatSeconds(adjustedSeconds);
    
    resultLines.push(`* **[${formattedTime}](#t=${formattedTime})** ${title}`);
  }
  return resultLines;
}

const inputLines = examples.split('\n');
const actualLines = process(inputLines);
const expectedLines = expectedOutput.split('\n').filter(l => l.trim());

console.log("Checking results...");
let failCount = 0;

for (let i = 0; i < actualLines.length; i++) {
  const actual = actualLines[i];
  const expected = expectedLines[i];
  
  if (actual !== expected) {
    console.log(`Mismatch at line ${i + 1}:`);
    console.log(`   Input: "${inputLines[i].trim()}"`);
    console.log(`  Actual: "${actual}"`);
    console.log(`Expected: "${expected}"`);
    failCount++;
  }
}

if (failCount === 0) {
  console.log("All lines match expected output!");
} else {
  console.log(`${failCount} mismatches found.`);
}
