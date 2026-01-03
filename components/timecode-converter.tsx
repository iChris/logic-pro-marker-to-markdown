"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Copy, Play } from "lucide-react"

export default function TimecodeConverter() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  function parseTimecode(tc: string): number | null {
    // Expected format HH:MM:SS:FF.SS or similar
    // We only care about HH, MM, SS
    const parts = tc.split(/[:.]/)
    if (parts.length < 3) return null
    
    const h = parseInt(parts[0] || '0', 10)
    const m = parseInt(parts[1] || '0', 10)
    const s = parseInt(parts[2] || '0', 10)
    
    return h * 3600 + m * 60 + s
  }

  function formatTimecode(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    
    const pad = (n: number) => n.toString().padStart(2, '0')
    
    // Always return HH:MM:SS
    return `${pad(h)}:${pad(m)}:${pad(s)}`
  }

  function generateMarkdown(timecodeData: string): string {
    if (!timecodeData.trim()) {
      return ""
    }

    console.log("[v0] Raw input:", timecodeData)

    // Split by newlines to handle each entry separately
    const lines = timecodeData.split(/\r?\n/).filter((line) => line.trim())
    console.log("[v0] Split lines:", lines)

    // Offset to subtract (None required per new requirements)
    const START_OFFSET = 3600 

    let markdownResult = ""

    for (const line of lines) {
      // Split by tabs or multiple spaces
      const items = line.split(/\t+|\s{2,}/).filter((item) => item.trim())
      
      const timeItem = items[0]?.trim()
      const titleItem = items[1]?.trim()

      console.log("[v0] Processing line:", { timeItem, titleItem })

      // Skip if we don't have both time and title, or if the timecode starts with 00:00:00 (duration)
      if (!timeItem || !titleItem || timeItem.startsWith("00:00:00")) {
        console.log("[v0] Skipping line - missing data or duration timecode")
        continue
      }

      const totalSeconds = parseTimecode(timeItem)
      
      if (totalSeconds === null) {
          console.log("[v0] Skipping line - invalid timecode format")
          continue
      }

      // No offset subtraction needed
      let adjustedSeconds = totalSeconds - START_OFFSET
      
      if (adjustedSeconds < 0) adjustedSeconds = 0

      const cleanTime = formatTimecode(adjustedSeconds)
      console.log("[v0] Cleaned time:", cleanTime)

      const template = `* **[${cleanTime}](#t=${cleanTime})** ${titleItem}\n`
      markdownResult += template
    }

    console.log("[v0] Final result:", markdownResult)
    return markdownResult
  }

  async function handleConvert() {
    setIsLoading(true)

    try {
      const markdown = generateMarkdown(input)
      setResult(markdown)
    } catch (error) {
      console.error("Conversion failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function copyToClipboard() {
    if (result) {
      await navigator.clipboard.writeText(result)
      // You could add a toast notification here
    }
  }

  const exampleData = `01:30:45.123	Intro	00:01:00
02:15:30.456	Verse 1	00:02:00
03:45:12.789	Chorus	00:01:30
04:20:15.234	Bridge	00:01:45
05:10:30.567	Outro	00:00:45`

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-yellow-400" />
            Input Timecode Data
          </CardTitle>
          <CardDescription>
            Paste your Logic Pro timecode data here. Each line should contain a timecode, title, and duration separated
            by a tab.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={`Paste your Logic Pro timecode data here...
Example:
${exampleData}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
          <div className="flex gap-2 text-black font-semibold font-sans leading-4 border-0">
            <Button onClick={handleConvert} disabled={!input.trim() || isLoading}>
              {isLoading ? "Converting..." : "Convert Timecodes"}
            </Button>
            <Button variant="outline" onClick={() => setInput(exampleData)}>
              Load Example
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Generated Markdown
              <Button variant="outline" size="sm" onClick={copyToClipboard} className="ml-auto bg-transparent">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </CardTitle>
            <CardDescription>Your converted markdown list with clickable timestamps</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea value={result} readOnly className="min-h-[200px] font-mono text-sm" />
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Preview:</h4>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, "") }}
              />
            </div>
          </CardContent>
        </Card>
      )}


    </div>
  )
}
