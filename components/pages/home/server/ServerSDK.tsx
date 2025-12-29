"use client";

import { Badge } from "@/components/ui/badge";
import { LogEntry } from "@/types/logs";
import { Server } from "lucide-react";
import { useState } from "react";
import Logs from "../Logs";
import { toast } from "sonner";
import Configuration from "./Configuration";
import DispatchMessage from "./DispatchMessage";

const ServerSDK = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [serviceAccountRaw, setServiceAccountRaw] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [targetToken, setTargetToken] = useState("");
  const [messageTitle, setMessageTitle] = useState("Hello from FCM!");
  const [messageBody, setMessageBody] = useState(
    "This is a test notification."
  );
  const [isSending, setIsSending] = useState(false);

  const handleInitialize = () => {
    try {
      const parsed = JSON.parse(serviceAccountRaw);
      if (!parsed.project_id || !parsed.private_key) {
        addLog(
          "Invalid Service Account: Missing project_id or private_key",
          "error"
        );
        return;
      }
      setIsInitialized(true);
      addLog(
        `Admin SDK (Simulated) initialized for project: ${parsed.project_id}`,
        "success"
      );
      toast.success("Admin SDK Ready", {
        description: "Service account validated and ready for testing.",
      });
    } catch (e) {
      addLog(
        "Failed to parse Service Account JSON. Ensure it is valid JSON.",
        "error"
      );
    }
  };

  const handleSendMessage = async () => {
    if (!isInitialized) {
      addLog("Please initialize Admin SDK first", "error");
      return;
    }
    if (!targetToken) {
      addLog("Target token is required", "error");
      return;
    }

    setIsSending(true);
    const payload = {
      notification: { title: messageTitle, body: messageBody },
      data: { click_action: "FLUTTER_NOTIFICATION_CLICK" },
    };

    addLog(`Sending message to: ${targetToken.substring(0, 10)}...`, "request");

    try {
      const response = await fetch("/api/fcm/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceAccount: JSON.parse(serviceAccountRaw),
          target: targetToken,
          payload,
        }),
      });

      const result = await response.json();

      if (result.success) {
        addLog(`Message sent! ID: ${result.messageId}`, "success");
        // addLog(`Raw Response: ${JSON.stringify(result, null, 2)}`, "response");
        toast.success("Message Sent", {
          description: "The notification was successfully dispatched.",
        });
      } else {
        throw new Error(result.error || "Failed to send message");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        addLog(`Send Error: ${error.message}`, "error");
      } else {
        addLog(`Send Error: ${String(error)}`, "error");
      }
    } finally {
      setIsSending(false);
    }
  };

  const addLog = (content: string, type: LogEntry["type"] = "info") => {
    setLogs((prev) => [
      {
        timestamp: new Date().toLocaleTimeString(),
        type,
        content,
      },
      ...prev,
    ]);
  };
  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-3 text-secondary mb-4">
        <Server className="size-6" />
        <h2 className="text-2xl font-bold">Admin SDK</h2>
        <Badge variant="outline" className="border-secondary/30 text-secondary">
          Server-side
        </Badge>
      </div>
      <Configuration
        isInitialized={isInitialized}
        serviceAccountRaw={serviceAccountRaw}
        setServiceAccountRaw={setServiceAccountRaw}
        handleInitialize={handleInitialize}
      />
      <DispatchMessage
        targetToken={targetToken}
        setTargetToken={setTargetToken}
        messageTitle={messageTitle}
        messageBody={messageBody}
        setMessageBody={setMessageBody}
        setMessageTitle={setMessageTitle}
        handleSendMessage={handleSendMessage}
        isSending={isSending}
        isInitialized={isInitialized}
      />
      <Logs title="server" logs={logs} setLogs={setLogs} />
    </div>
  );
};

export default ServerSDK;
