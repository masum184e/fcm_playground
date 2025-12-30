export interface TopicSubscription {
  name: string
  status: "active" | "subscribing" | "error"
}