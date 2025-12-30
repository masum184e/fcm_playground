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
import { TopicSubscription } from "@/types/topic";

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
  const [serviceAccountRaw, setServiceAccountRaw] = useState("");

  const [vapidKey, setVapidKey] = useState("");
  const [fcmToken, setFcmToken] = useState("");
  const [topics, setTopics] = useState<TopicSubscription[]>([
    { name: "all_users", status: "active" },
  ]);
  const [newTopic, setNewTopic] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

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
      toast.success("SDK Initialized successfully", {
        description: `Connected to project: ${config.projectId}`,
      });
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

          if (serviceAccountRaw) {
            addLog("Auto-subscribing to 'all_users'...", "info");
            handleSubscribeToTopic("all_users", token);
          } else {
            addLog(
              "Token retrieved, but no Service Account found for auto-subscription.",
              "error"
            );
          }

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

  const handleSubscribeToTopic = async (
    topicName: string,
    tokenToUse?: string
  ) => {
    const activeToken = tokenToUse || fcmToken;
    if (!activeToken) {
      addLog("Cannot subscribe without a valid FCM token", "error");
      return;
    }

    setIsSubscribing(true);
    addLog(`Subscribing to topic: ${topicName}...`, "info");
    const serviceAccountObj =
      typeof serviceAccountRaw === "string"
        ? JSON.parse(serviceAccountRaw)
        : serviceAccountRaw;

    const payload = JSON.stringify({
      serviceAccount: serviceAccountObj,
      token: activeToken,
      topic: topicName,
    });

    try {
      const response = await fetch("/api/fcm/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      });

      const data = await response.json();

      if (data.success) {
        if (!topics.find((t) => t.name === topicName)) {
          setTopics((prev) => [...prev, { name: topicName, status: "active" }]);
        }
        addLog(`Successfully subscribed to ${topicName}`, "success");
        toast.success("Topic Subscribed", {
          description: `You are now in the ${topicName} group.`,
        });
      } else {
        throw new Error(data.error || "Subscription failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      addLog(`Subscription error: ${errorMessage}`, "error");
    } finally {
      setIsSubscribing(false);
      setNewTopic("");
    }
  };

  const handleUnsubscribeFromTopic = async (topicName: string) => {
    if (!fcmToken || !serviceAccountRaw) return;

    addLog(`Unsubscribing from ${topicName}...`, "info");

    try {
      const saObject =
        typeof serviceAccountRaw === "string"
          ? JSON.parse(serviceAccountRaw)
          : serviceAccountRaw;

      const response = await fetch("/api/fcm/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceAccount: saObject,
          token: fcmToken,
          topic: topicName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTopics((prev) => prev.filter((t) => t.name !== topicName));
        addLog(`Left group: ${topicName}`, "success");
        toast.success("Unsubscribed", { description: `You left ${topicName}` });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      addLog(`Unsubscribe error: ${errorMessage}`, "error");
    }
  };

  return (
    <div className="py-4 max-w-screen-xl mx-auto space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
        {/* <div className="space-y-6 max-w-3xl mx-auto p-4 md:p-8"> */}
        {/* <div className="space-y-4"> */}
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
          serviceAccountRaw={serviceAccountRaw}
          setServiceAccountRaw={setServiceAccountRaw}
        />
        <FCMToken
          vapidKey={vapidKey}
          setVapidKey={setVapidKey}
          fcmToken={fcmToken}
          clearToken={clearToken}
          copyToken={copyToken}
          handleGetToken={handleGetToken}
          isInitialized={isInitialized}
          topics={topics}
          newTopic={newTopic}
          setNewTopic={setNewTopic}
          isSubscribing={isSubscribing}
          handleSubscribeToTopic={handleSubscribeToTopic}
          serviceAccountRaw={serviceAccountRaw}
          handleUnsubscribeFromTopic={handleUnsubscribeFromTopic}
        />
        {/* </div> */}
      </div>
      <div>
        <Logs title="client" logs={logs} setLogs={setLogs} />
      </div>
    </div>
  );
};

export default ClientSDK;
