"use client";

import { Badge } from "@/components/ui/badge";
import { LogEntry } from "@/types/logs";
import { Server } from "lucide-react";
import { useState } from "react";
import Logs from "../Logs";

const ServerSDK = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-3 text-secondary mb-4">
        <Server className="size-6" />
        <h2 className="text-2xl font-bold">Admin SDK</h2>
        <Badge variant="outline" className="border-secondary/30 text-secondary">
          Server-side
        </Badge>
      </div>
      <Logs title="server" logs={logs} setLogs={setLogs} />
    </div>
  );
};

export default ServerSDK;
