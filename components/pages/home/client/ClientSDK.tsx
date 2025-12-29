"use client";

import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Configuration from "./Configuration";
import { FirebaseConfig } from "@/types/firebase";
import Logs from "../Logs";
import { LogEntry } from "@/types/logs";
import { initializeApp, getApps, getApp, FirebaseError } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { toast } from "sonner";
import FCMToken from "./FCMToken";

const ClientSDK = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [config, setConfig] = useState<FirebaseConfig>({
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  });
  const [vapidKey, setVapidKey] = useState("");
  const [fcmToken, setFcmToken] = useState("");

  const handleInitialize = async () => {
    try {
      const missingFields: string[] = [];
      if (!config.apiKey) missingFields.push("API Key");
      if (!config.projectId) missingFields.push("Project ID");
      if (!config.appId) missingFields.push("App ID");
      if (!config.messagingSenderId) missingFields.push("Messaging Sender ID");

      if (missingFields.length > 0) {
        missingFields.forEach((field) => {
          addLog(`Missing required field: ${field}`, "error");
        });
        return;
      }

      // Register Service Worker
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        try {
          addLog("Registering Service Worker...", "info");
          const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          );
          await navigator.serviceWorker.ready;
          if (registration.active) {
            registration.active.postMessage({
              type: "SET_FIREBASE_CONFIG",
              config: config,
            });
            addLog("Config synced to Service Worker", "success");
          }

          addLog(
            `Service Worker registered with scope: ${registration.scope}`,
            "success"
          );
        } catch (swError) {
          const errMsg =
            swError instanceof Error ? swError.message : "Unknown SW error";
          addLog(`Service Worker registration failed: ${errMsg}`, "error");
        }
      }

      // Initialize Firebase
      if (getApps().length > 0) {
        addLog("Firebase app already exists. Re-initializing...", "info");
      }

      const app = initializeApp(config, "fcm-playground");
      setIsInitialized(true);

      addLog(
        `Firebase Client SDK initialized for project: ${config.projectId}`,
        "success"
      );
      toast.success("SDK Initialized successfully");

      // Setup Foreground Message Handler
      const messaging = getMessaging(app);
      onMessage(messaging, (payload) => {
        addLog(
          `Foreground message received: ${JSON.stringify(
            payload.notification
          )}`,
          "message"
        );

        toast.success(payload.notification?.title || "New Message", {
          description:
            payload.notification?.body || "Foreground message received",
        });
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      addLog(`Initialization error: ${errorMessage}`, "error");
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

  const handleGetToken = async () => {
    if (!isInitialized) {
      addLog("Please initialize the Client SDK first", "error");
      return;
    }

    try {
      addLog("Requesting notification permission...", "info");
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        addLog("Notification permission granted", "success");
        const registration = await navigator.serviceWorker.getRegistration();
        const messaging = getMessaging(getApp("fcm-playground"));

        addLog("Fetching FCM token...", "info");
        const token = await getToken(messaging, {
          vapidKey: vapidKey || undefined,
          serviceWorkerRegistration: registration,
        });

        if (token) {
          setFcmToken(token);
          addLog("FCM Token retrieved successfully", "success");
          // Copy to clipboard automatically for convenience
          navigator.clipboard.writeText(token);
          toast.success("Token Generated", {
            description: "FCM token copied to clipboard",
          });
        } else {
          addLog(
            "No registration token available. Request permission to generate one.",
            "error"
          );
        }
      } else {
        addLog("Notification permission denied", "error");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      addLog(`Token error: ${errorMessage}`, "error");
      if (error instanceof FirebaseError) {
        if (error.code === "messaging/permission-blocked") {
          addLog(
            "Tip: Reset notification permissions in your browser settings (click the lock icon in the URL bar)",
            "info"
          );
        } else if (error.code === "messaging/token-subscribe-failed") {
          addLog(
            "Tip: Ensure your VAPID key is correct and matches your project",
            "info"
          );
        }
      }
    }
  };

  const copyToken = () => {
    if (fcmToken) {
      navigator.clipboard.writeText(fcmToken);
      toast.success("Copied", { description: "Token copied to clipboard" });
    }
  };

  const clearToken = () => {
    setFcmToken("");
    addLog("FCM Token cleared locally", "info");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4 max-w-screen-xl mx-auto">
      {/* <div className="space-y-6 max-w-3xl mx-auto p-4 md:p-8"> */}
      <div className="space-y-4">
        {/* <div className="flex items-center gap-3 text-primary mb-4">
          <Bell className="size-6" />
          <h2 className="text-2xl font-bold tracking-tight">Client SDK</h2>
          <Badge variant="outline" className="border-primary/30 text-primary">
            Frontend
          </Badge>
        </div> */}
        <Configuration
          isInitialized={isInitialized}
          config={config}
          setConfig={setConfig}
          handleInitialize={handleInitialize}
        />
        <FCMToken
          vapidKey={vapidKey}
          setVapidKey={setVapidKey}
          fcmToken={fcmToken}
          clearToken={clearToken}
          copyToken={copyToken}
          handleGetToken={handleGetToken}
          isInitialized={isInitialized}
        />
      </div>
<div className="h-full">
        <Logs title="client" logs={logs} setLogs={setLogs} />
</div>
    </div>
  );
};

export default ClientSDK;
