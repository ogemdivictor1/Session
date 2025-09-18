"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, QrCode, Smartphone, Wifi, WifiOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SessionData {
  sessionId: string
  status: "disconnected" | "connecting" | "connected"
  qrCode?: string
  pairCode?: string
  phoneNumber?: string
  createdAt: Date
}

export default function WhatsAppSessionGenerator() {
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  // Generate a unique session ID
  const generateSessionId = () => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    return `wa_session_${timestamp}_${random}`
  }

  // Generate a mock QR code (in real implementation, this would come from Baileys)
  const generateQRCode = () => {
    const qrData = `2@${Math.random().toString(36).substring(2, 15)},${Math.random().toString(36).substring(2, 15)},${Date.now()}`
    return btoa(qrData)
  }

  // Generate a pairing code
  const generatePairCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result.match(/.{1,4}/g)?.join("-") || result
  }

  // Create new session with QR code
  const createQRSession = async () => {
    setIsGenerating(true)

    // Simulate Baileys connection process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newSession: SessionData = {
      sessionId: generateSessionId(),
      status: "connecting",
      qrCode: generateQRCode(),
      createdAt: new Date(),
    }

    setSessions((prev) => [newSession, ...prev])
    setIsGenerating(false)

    toast({
      title: "QR Session Created",
      description: "Scan the QR code with WhatsApp to connect",
    })

    // Simulate connection timeout
    setTimeout(() => {
      setSessions((prev) =>
        prev.map((session) =>
          session.sessionId === newSession.sessionId ? { ...session, status: "disconnected" } : session,
        ),
      )
    }, 30000)
  }

  // Create new session with pair code
  const createPairSession = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a phone number for pairing",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // Simulate Baileys pairing process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newSession: SessionData = {
      sessionId: generateSessionId(),
      status: "connecting",
      pairCode: generatePairCode(),
      phoneNumber: phoneNumber,
      createdAt: new Date(),
    }

    setSessions((prev) => [newSession, ...prev])
    setIsGenerating(false)
    setPhoneNumber("")

    toast({
      title: "Pair Code Generated",
      description: "Enter the code in WhatsApp Settings > Linked Devices",
    })

    // Simulate connection timeout
    setTimeout(() => {
      setSessions((prev) =>
        prev.map((session) =>
          session.sessionId === newSession.sessionId ? { ...session, status: "disconnected" } : session,
        ),
      )
    }, 60000)
  }

  // Copy to clipboard
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    })
  }

  // Simulate connection for demo
  const simulateConnection = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((session) => (session.sessionId === sessionId ? { ...session, status: "connected" } : session)),
    )

    toast({
      title: "Connected!",
      description: "WhatsApp session is now active",
    })
  }

  // Delete session
  const deleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((session) => session.sessionId !== sessionId))
    toast({
      title: "Session Deleted",
      description: "Session has been removed",
    })
  }

  const getStatusColor = (status: SessionData["status"]) => {
    switch (status) {
      case "connected":
        return "bg-green-500"
      case "connecting":
        return "bg-yellow-500"
      case "disconnected":
        return "bg-red-500"
    }
  }

  const getStatusIcon = (status: SessionData["status"]) => {
    switch (status) {
      case "connected":
        return <Wifi className="h-4 w-4" />
      case "connecting":
        return <Smartphone className="h-4 w-4" />
      case "disconnected":
        return <WifiOff className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-green-600 dark:text-green-400">WhatsApp Session Generator</h1>
          <p className="text-muted-foreground">
            Generate WhatsApp Web sessions using Baileys with QR codes or pairing codes
          </p>
        </div>

        <Tabs defaultValue="qr" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="qr" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              QR Code
            </TabsTrigger>
            <TabsTrigger value="pair" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Pair Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qr" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generate QR Code Session</CardTitle>
                <CardDescription>Create a new WhatsApp session using QR code authentication</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={createQRSession}
                  disabled={isGenerating}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isGenerating ? "Generating..." : "Generate QR Session"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pair" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generate Pair Code Session</CardTitle>
                <CardDescription>Create a new WhatsApp session using phone number pairing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <Button
                  onClick={createPairSession}
                  disabled={isGenerating}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isGenerating ? "Generating..." : "Generate Pair Code"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {sessions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold">Active Sessions</h2>
              <Badge variant="secondary">{sessions.length}</Badge>
            </div>

            <div className="grid gap-4">
              {sessions.map((session) => (
                <Card key={session.sessionId} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(session.status)}`} />
                        {getStatusIcon(session.status)}
                        <CardTitle className="text-lg">{session.sessionId}</CardTitle>
                      </div>
                      <Badge variant={session.status === "connected" ? "default" : "secondary"}>{session.status}</Badge>
                    </div>
                    <CardDescription>
                      Created: {session.createdAt.toLocaleString()}
                      {session.phoneNumber && ` • Phone: ${session.phoneNumber}`}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {session.qrCode && (
                      <div className="space-y-2">
                        <Label>QR Code Data</Label>
                        <div className="flex items-center gap-2">
                          <Input value={session.qrCode} readOnly className="font-mono text-sm" />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(session.qrCode!, "QR Code")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {session.pairCode && (
                      <div className="space-y-2">
                        <Label>Pairing Code</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={session.pairCode}
                            readOnly
                            className="font-mono text-xl font-bold text-center"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(session.pairCode!, "Pair Code")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="flex gap-2">
                      {session.status === "connecting" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => simulateConnection(session.sessionId)}
                          className="text-green-600"
                        >
                          Simulate Connect
                        </Button>
                      )}
                      <Button size="sm" variant="destructive" onClick={() => deleteSession(session.sessionId)}>
                        Delete Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-700 dark:text-blue-300">Integration Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-600 dark:text-blue-400 space-y-2">
            <p>• This is a demo interface. In production, integrate with @whiskeysockets/baileys</p>
            <p>• QR codes would be generated by Baileys and displayed as actual QR images</p>
            <p>• Pair codes would be sent to WhatsApp for device linking</p>
            <p>• Session data should be stored securely with proper encryption</p>
            <p>• Implement proper error handling and connection management</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
