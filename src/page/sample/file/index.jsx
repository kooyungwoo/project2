"use client"

import { Card } from "@/components/ui/card"
import FileForm from "./components/Form"

export default function SampleForm() {

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <FileForm />
      </Card>
    </div>
  )
}