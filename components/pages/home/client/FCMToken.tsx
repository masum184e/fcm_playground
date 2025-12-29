import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Copy, Trash2 } from "lucide-react";

interface FCMTokenProps {
  vapidKey: string;
  setVapidKey: (value: string) => void;
  fcmToken: string;
  clearToken: () => void;
  copyToken: () => void;
  handleGetToken: () => void;
  isInitialized: boolean;
}

const FCMToken = ({
  vapidKey,
  setVapidKey,
  fcmToken,
  clearToken,
  copyToken,
  handleGetToken,
  isInitialized,
}: FCMTokenProps) => {
  return (
    <Card className="border-primary/20 shadow-primary/5">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Key className="size-4 text-primary" />
          FCM Token
        </CardTitle>
        <CardDescription>Manage your device registration token</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            VAPID Key (Web Push)
          </label>
          <Input
            placeholder="Your public VAPID key"
            value={vapidKey}
            onChange={(e) => setVapidKey(e.target.value)}
            className="font-mono text-xs"
          />
        </div>
        <div className="flex gap-2">
          <Input
            readOnly
            value={fcmToken}
            placeholder="No token generated yet"
            className="font-mono text-xs overflow-hidden text-ellipsis"
          />
          <Button
            size="icon"
            variant="outline"
            className="shrink-0 bg-transparent"
            onClick={copyToken}
            disabled={!fcmToken}
          >
            <Copy className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="shrink-0 text-destructive bg-transparent"
            onClick={clearToken}
            disabled={!fcmToken}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
        <Button
          className="w-full bg-primary hover:bg-primary/90 cursor-pointer"
          onClick={handleGetToken}
          disabled={!isInitialized}
        >
          Request Permission & Get Token
        </Button>
      </CardContent>
    </Card>
  );
};

export default FCMToken;
