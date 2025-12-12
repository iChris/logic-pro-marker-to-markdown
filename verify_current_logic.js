
const input1 = " 	 01:00:52:18.60"; // Line 1
const input20 = " 	 02:00:55:18.60"; // Line 20

function parseTimecode(tc) {
  const parts = tc.split(/[:.]/);
  if (parts.length < 3) return null;
  const h = parseInt(parts[0] || '0', 10);
  const m = parseInt(parts[1] || '0', 10);
  const s = parseInt(parts[2] || '0', 10);
  return h * 3600 + m * 60 + s;
}

function formatTimecode(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n) => n.toString().padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function processLine(line) {
   const items = line.split(/\t+|\s{2,}/).filter((item) => item.trim());
   const timeItem = items[0]?.trim();
   const totalSeconds = parseTimecode(timeItem);
   const START_OFFSET = 3600;
   let adjusted = totalSeconds - START_OFFSET;
   if (adjusted < 0) adjusted = 0;
   return formatTimecode(adjusted);
}

console.log("Line 1 Input:", input1);
console.log("Line 1 Output:", processLine(input1));
console.log("Line 1 Desired:", "00:00:52");

console.log("Line 20 Input:", input20);
console.log("Line 20 Output:", processLine(input20));
console.log("Line 20 Desired:", "00:55:18");
