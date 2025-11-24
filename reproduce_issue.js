
const input = `01:30:45.123\tIntro\t00:01:00
02:15:30.456\tVerse 1\t00:02:00`;

console.log("Input:", JSON.stringify(input));

function generateMarkdown(timecodeData) {
    if (!timecodeData.trim()) {
      return ""
    }

    // Split by newlines to handle each entry separately
    const lines = timecodeData.split(/\r?\n/).filter((line) => line.trim())
    console.log("Split lines:", lines)

    const regexFirstNumbers = /^\d+:/ // Regex to clean the time data eg "01:"
    const regexFrameNumbers = /\.\d+$/ // Regex to clean frame numbers/milliseconds eg ".123"

    let markdownResult = ""

    for (const line of lines) {
      // Split by tabs or multiple spaces
      const items = line.split(/\t+|\s{2,}/).filter((item) => item.trim())
      
      const timeItem = items[0]?.trim()
      const titleItem = items[1]?.trim()
      // duration is usually the 3rd item, but we don't need it

      console.log("Processing line:", { timeItem, titleItem })

      // Skip if we don't have both time and title, or if the timecode starts with 00:00:00 (duration)
      if (!timeItem || !titleItem || timeItem.startsWith("00:00:00")) {
        console.log("Skipping line - missing data or duration timecode")
        continue
      }

      // Clean the timecode: remove first numbers and frame numbers
      const cleanTime = timeItem.replace(regexFirstNumbers, "").replace(regexFrameNumbers, "")
      console.log("Cleaned time:", cleanTime)

      const template = `* **[${cleanTime}](#t=${cleanTime})** ${titleItem}\n`
      markdownResult += template
    }

    return markdownResult
}

const result = generateMarkdown(input);
console.log("Result:\n" + result);

const expected = `* **[30:45](#t=30:45)** Intro
* **[15:30](#t=15:30)** Verse 1
`;

if (result === expected) {
    console.log("PASS: Result matches expected output");
} else {
    console.log("FAIL: Result does not match expected output");
    console.log("Expected:\n" + JSON.stringify(expected));
    console.log("Actual:\n" + JSON.stringify(result));
}
