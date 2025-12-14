
const fs = require('fs');

const examples = `00:00:52.750	 Gaming platforms of choice	 00:00:00.001
00:06:52.428	 Are Mac gamers still limited?	 00:00:00.001
00:12:06.601	 Happy Project Share Time	 00:00:00.001
00:13:12.000	 A course for someone to learn the basics of the web	 00:00:00.001
00:16:01.000	 Markdown in Terminal	 00:00:00.001
00:17:56.589	 Sponsor: Studioworks	 00:00:00.001
00:20:14.000	 Web component based admin bar	 02:33.335
00:22:47.610	 Ship-shape CSS generators	 00:00:00.001
00:32:08.187	 How Many Dudes? game	 00:00:00.001
00:33:25.437	 LudoKit for launching a game	 00:00:00.001
00:37:52.894	 Dummy image generator	 00:00:00.001
00:40:53.937	 Lynn Fisher's portfolio refresh	 00:00:00.001
00:43:27.437	 OmG Summarized Quiz	 00:00:00.001
00:44:50.780	 Outlyne AI Website builder	 00:00:00.001
00:47:39.110	 Greenwood HTML-first web framework	 00:00:00.001
00:51:51.939	 Alex's easter eggs on his personal website	 00:00:00.001
00:54:58.187	 Email Markup Database	 00:00:00.001
01:01:18.687	 Storybook MCP sneak peek	 00:00:00.001
01:01:55.937	 Andy's miniature painting site	 00:00:00.001
01:02:15.207	 Rubber AI	 00:00:00.001
01:02:28.187	 Baseline tennis stats	 00:00:00.001
01:03:08.937	 Interesecting Us	 00:00:00.001
01:04:03.398	 Bitty web tool for interesting pages	 00:00:00.001
01:05:33.840	 Avatar maker	 00:00:00.001`;

const expectedOutput = `* **[00:52](#t=00:52)** Gaming platforms of choice
* **[06:52](#t=06:52)** Are Mac gamers still limited?
* **[12:06](#t=12:06)** Happy Project Share Time
* **[13:12](#t=13:12)** A course for someone to learn the basics of the web
* **[16:01](#t=16:01)** Markdown in Terminal
* **[17:56](#t=17:56)** Sponsor: Studioworks
* **[20:14](#t=20:14)** Web component based admin bar
* **[22:47](#t=22:47)** Ship-shape CSS generators
* **[32:08](#t=32:08)** How Many Dudes? game
* **[33:25](#t=33:25)** LudoKit for launching a game
* **[37:52](#t=37:52)** Dummy image generator
* **[40:53](#t=40:53)** Lynn Fisher's portfolio refresh
* **[43:27](#t=43:27)** OmG Summarized Quiz
* **[44:50](#t=44:50)** Outlyne AI Website builder
* **[47:39](#t=47:39)** Greenwood HTML-first web framework
* **[51:51](#t=51:51)** Alex's easter eggs on his personal website
* **[54:58](#t=54:58)** Email Markup Database
* **[01:01:18](#t=01:01:18)** Storybook MCP sneak peek
* **[01:01:55](#t=01:01:55)** Andy's miniature painting site
* **[01:02:15](#t=01:02:15)** Rubber AI
* **[01:02:28](#t=01:02:28)** Baseline tennis stats
* **[01:03:08](#t=01:03:08)** Interesecting Us
* **[01:04:03](#t=01:04:03)** Bitty web tool for interesting pages
* **[01:05:33](#t=05:33)** Avatar maker`;

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
  // Logic Pro seems to output HH:MM:SS even if HH is 00
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  
  const pad = (n) => n.toString().padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function process(lines) {
  const resultLines = [];
  // const startOffsetSeconds = 3600; // Removed per user request

  for (const line of lines) {
    if (!line.trim()) continue;
    
    // Extract time and title
    // " 01:00:52:18.60	 Gaming platforms of choice..." 
    // Handling potential leading spaces and tabs
    const parts = line.trim().split(/\t+|\s{2,}/);
    if (parts.length < 2) continue;
    
    const timeStr = parts[0].trim();
    const title = parts[1].trim();
    
    // Parse time
    const totalSeconds = parseTimecode(timeStr);
    
    // No offset subtraction
    let adjustedSeconds = totalSeconds;
    
    // Format
    const h = Math.floor(adjustedSeconds / 3600);
    const m = Math.floor((adjustedSeconds % 3600) / 60);
    const s = adjustedSeconds % 60;
    
    const pad = (n) => n.toString().padStart(2, '0');
    let formattedTime;
    
    if (h > 0) {
        formattedTime = `${pad(h)}:${pad(m)}:${pad(s)}`;
    } else {
        formattedTime = `${pad(m)}:${pad(s)}`;
    }
    
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
