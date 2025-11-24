import TimecodeConverter from "../components/timecode-converter"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Logic Pro Timecode Converter</h1>
            <p className="text-muted-foreground">Convert Logic Pro timecodes into markdown lists</p>
          </div>
          <TimecodeConverter />
        </div>
      </div>
    </div>
  )
}
