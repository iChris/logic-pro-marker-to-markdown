# Logic Pro Timecode Converter

A web tool that converts Logic Pro timecodes into markdown lists with clickable timestamps.

[![Netlify Status](https://api.netlify.com/api/v1/badges/9ed120d7-7e66-4e8d-9d6f-25cf47703582/deploy-status)](https://app.netlify.com/projects/logic-chapters-to-markdown/deploys)

[Live App](https://logicmarkertomarkdown.chrisenns.com)

## Features

- Convert tab-separated timecode data from Logic Pro
- Generate markdown lists with clickable timestamp links
- Copy results directly to clipboard
- Clean, intuitive interface

## Usage

1. Export your timecode data from Logic Pro (should be tab-separated with timecode and title)
2. Paste your timecode data into the input field
3. Press "Convert Timecodes" to generate the markdown
4. Use "Copy to Clipboard" to copy the result

In Logic Pro, make sure to set the Display Time As to Hours : Minutes : Seconds . Milliseconds before exporting the timecode data.

SCREENSHOT HERE

## Input Format

The tool expects tab-separated data in this format:
\`\`\`
01:30:45.123	Intro
02:15:30.456	Verse 1
03:45:12.789	Chorus
\`\`\`

## Output Format

The tool generates markdown in this format:
\`\`\`markdown
* **[30:45](#t=30:45)** Intro<br>
* **[15:30](#t=15:30)** Verse 1<br>
* **[45:12](#t=45:12)** Chorus<br>
