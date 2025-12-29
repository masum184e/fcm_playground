import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface DispatchMessageProps {
  targetToken: string;
  setTargetToken: (value: string) => void;
  messageTitle: string;
  messageBody: string;
  setMessageBody: (value: string) => void;
  setMessageTitle: (value: string) => void;
  handleSendMessage: () => void;
  isSending: boolean;
  isInitialized: boolean;
}

const DispatchMessage = ({
  targetToken,
  setTargetToken,
  messageTitle,
  messageBody,
  setMessageBody,
  setMessageTitle,
  handleSendMessage,
  isSending,
  isInitialized,
}: DispatchMessageProps) => {
  return (
    <Card className="border-secondary/20 shadow-secondary/5">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Send className="size-4 text-secondary" />
          Dispatch Message
        </CardTitle>
        <CardDescription>
          Send a test notification to a specific client
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Registration Token
          </label>
          <Input
            placeholder="Paste token from Client column"
            value={targetToken}
            onChange={(e) => setTargetToken(e.target.value)}
            className="text-xs font-mono"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Title
            </label>
            <Input
              placeholder="Notification Title"
              value={messageTitle}
              onChange={(e) => setMessageTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Body
            </label>
            <Input
              placeholder="Notification Body"
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
            />
          </div>
        </div>
        <Button
          onClick={handleSendMessage}
          disabled={!isInitialized || isSending}
          className="w-full bg-secondary hover:bg-secondary/90 text-white flex items-center gap-2 cursor-pointer"
        >
          {isSending ? (
            <span className="animate-pulse">Sending...</span>
          ) : (
            <>
              <Send className="size-4" /> Send Notification
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DispatchMessage;
