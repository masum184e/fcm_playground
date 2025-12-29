export interface LogEntry {
    timestamp: string
    type: "info" | "error" | "success" | "message" | "response" | "request"
    content: string
}