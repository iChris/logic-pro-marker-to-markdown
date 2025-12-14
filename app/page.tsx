import TimecodeConverter from "../components/timecode-converter"
import { AlertTriangle } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Logic Pro Timecode Converter</h1>
            <p className="text-muted-foreground">Convert Logic Pro timecodes into markdown lists</p>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg mb-8 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="text-sm">
              In Logic Pro's preferences (Settings, View, Display Time As), make sure to set the <strong>Display Time As</strong> to <strong>Hours : Minutes : Seconds . Milliseconds</strong> before exporting the timecode data.
            </p>
          </div>

          <TimecodeConverter />
        </div>
      </div>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        v0.1.1
      </footer>
    </div>
  )
}
