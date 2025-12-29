import { Terminal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogEntry } from "@/types/logs";
import { cn } from "@/lib/utils";

interface LogsProps {
  title: string;
  logs: LogEntry[];
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>;
}

const Logs = ({ title, logs, setLogs }: LogsProps) => {
  return (
    <Card className="border-primary/20 shadow-primary/5 flex flex-col h-full">
      <CardHeader className="flex-none flex flex-row items-center justify-between">
        <CardTitle
          className={`text-lg flex items-center gap-2 ${
            title === "server" ? "text-secondary" : "text-primary"
          }`}
        >
          <Terminal className={`size-4 `} />
          {title === "server" ? "Server Logs" : "Client Logs"}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLogs([])}
          className={`h-7 text-xs cursor-pointer ${
            title === "server" ? "text-secondary" : "text-primary"
          }`}
        >
          Clear
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0 border-t">
        <ScrollArea className="h-full bg-black/5 dark:bg-black/40 font-mono text-[11px] p-3">
          {logs.length === 0 ? (
            <p className="text-muted-foreground italic">
              {"// System initialized. Waiting for actions..."}
            </p>
          ) : (
            <div className="space-y-2">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className="flex gap-2 border-l-2 pl-2 border-primary/10"
                >
                  <span className="text-muted-foreground shrink-0">
                    [{log.timestamp}]
                  </span>
                  <span
                    className={cn(
                      log.type === "error" && "text-destructive",
                      log.type === "success" &&
                        "text-emerald-600 dark:text-emerald-400",
                      log.type === "message" &&
                        "text-blue-600 dark:text-blue-400 font-bold",
                      log.type === "info" && "text-foreground"
                    )}
                  >
                    {log.content}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Logs;
