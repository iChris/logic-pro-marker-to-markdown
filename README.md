# Logic Pro Timecode Converter

A web tool that converts Logic Pro timecodes into markdown lists with clickable timestamps.

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
