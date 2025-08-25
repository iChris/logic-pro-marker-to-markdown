"use client"

import { useState } from "react"
import { Action, ActionPanel, Form, showToast, Toast, Clipboard } from "@raycast/api"

interface FormValues {
  timecodeData: string
}

export default function ConvertTimecodes() {
  const [result, setResult] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  function generateMarkdown(timecodeData: string): string {
    if (!timecodeData.trim()) {
      return ""
    }

    let array = timecodeData.split("\n")
    array = array.filter(Boolean) // Remove empty items

    const regexFirstNumbers = /\d+?:/ms // Regex to clean the time data eg "01:"
    const regexLastNumbers = /:\d{2}\.\d{2}$/ms // Regex to clean the last segment from the time eg ":17.01"

    let markdownResult = ""

    array.forEach((item) => {
      const removeEmptyTime = item.replace("\t 00:00:00.000", "") // Remove unnecessary empty timestamp
      const data = removeEmptyTime.split("\t") // Create array of the singular data set (time and title)

      if (data.length >= 2) {
        const title = data[1] // Set the title
        const time = data[0].replace(regexFirstNumbers, "").replace(regexLastNumbers, "") // Strip the defined numbers from the time

        const template = `* **[${time}](#t=${time})** ${title}<br>\n` // Create template string for the complete markdown template
        markdownResult += template // Add the item to the rest of the results
      }
    })

    return markdownResult
  }

  async function handleSubmit(values: FormValues) {
    setIsLoading(true)

    try {
      const markdown = generateMarkdown(values.timecodeData)
      setResult(markdown)

      if (markdown) {
        await showToast({
          style: Toast.Style.Success,
          title: "Conversion Complete",
          message: "Markdown generated successfully!",
        })
      } else {
        await showToast({
          style: Toast.Style.Failure,
          title: "No Data",
          message: "Please enter valid timecode data",
        })
      }
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Conversion Failed",
        message: "Please check your input format",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function copyToClipboard() {
    if (result) {
      await Clipboard.copy(result)
      await showToast({
        style: Toast.Style.Success,
        title: "Copied!",
        message: "Markdown copied to clipboard",
      })
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Convert Timecodes" onSubmit={handleSubmit} />
          {result && (
            <Action title="Copy to Clipboard" onAction={copyToClipboard} shortcut={{ modifiers: ["cmd"], key: "c" }} />
          )}
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="timecodeData"
        title="Logic Pro Timecode Data"
        placeholder={`Paste your Logic Pro timecode data here...
Example:
01:30:45.123	Intro
02:15:30.456	Verse 1
03:45:12.789	Chorus`}
        info="Paste the tab-separated timecode data exported from Logic Pro. Each line should contain a timecode and title separated by a tab."
      />

      {result && (
        <Form.TextArea
          id="result"
          title="Generated Markdown"
          value={result}
          info="Your converted markdown list. Use the Copy to Clipboard action to copy it."
        />
      )}
    </Form>
  )
}
