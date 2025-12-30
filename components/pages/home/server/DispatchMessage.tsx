import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Users, Radio, User } from "lucide-react";
import { Target } from "./ServerSDK";

interface DispatchMessageProps {
  targetType: string;
  setTargetType: React.Dispatch<React.SetStateAction<Target>>;
  targetValue: string;
  setTargetValue: (value: string) => void;
  messageTitle: string;
  messageBody: string;
  setMessageBody: (value: string) => void;
  setMessageTitle: (value: string) => void;
  handleSendMessage: () => void;
  isSending: boolean;
  isInitialized: boolean;
}

const DispatchMessage = ({
  targetType,
  setTargetType,
  targetValue,
  setTargetValue,
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
        <CardTitle className="text-lg flex items-center gap-2 text-secondary">
          <Send className="size-4 " />
          Dispatch Message
        </CardTitle>
        <CardDescription className="-mt-2">
          Send a test notification to a specific client
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 -mt-4">
        <Tabs
          value={targetType}
          onValueChange={(v) => setTargetType(v as Target)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="token" className="flex items-center gap-2 text-secondary/90 cursor-pointer">
              <User className="size-3" /> Specific
            </TabsTrigger>
            <TabsTrigger value="topic" className="flex items-center gap-2 text-secondary/90 cursor-pointer">
              <Users className="size-3" /> Group
            </TabsTrigger>
            <TabsTrigger value="broadcast" className="flex items-center gap-2 text-secondary/90 cursor-pointer">
              <Radio className="size-3" /> All
            </TabsTrigger>
          </TabsList>

          <div className="-mt-2">
            {targetType === "token" && (
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Registration Token
                </label>
                <Input
                  placeholder="Paste token from Client column"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="text-xs font-mono"
                />
              </div>
            )}

            {targetType === "topic" && (
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Topic Name
                </label>
                <Input
                  placeholder="e.g. 'announcements' or 'premium_users'"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="text-xs font-mono"
                />
              </div>
            )}

            {targetType === "broadcast" && (
              <div className="p-4 bg-orange-500/5 rounded-md border border-orange-500/10 border-dashed text-center mt-1.75">
                <p className="text-sm text-muted-foreground italic">
                  Broadcasting to all users using the special {"all_users"}{" "}
                  topic.
                </p>
              </div>
            )}
          </div>
        </Tabs>

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
              <Send className="size-4" />
              {targetType === "token" && "Send to User"}
              {targetType === "topic" && "Send to Group"}
              {targetType === "broadcast" && "Send to Everyone"}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DispatchMessage;
