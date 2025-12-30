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
import { Badge } from "@/components/ui/badge";
import { TopicSubscription } from "@/types/topic";

interface FCMTokenProps {
  vapidKey: string;
  setVapidKey: (value: string) => void;
  fcmToken: string;
  clearToken: () => void;
  copyToken: () => void;
  handleGetToken: () => void;
  isInitialized: boolean;
  topics: TopicSubscription[];
  newTopic: string;
  setNewTopic: (value: string) => void;
  isSubscribing: boolean;
  handleSubscribeToTopic: (value: string) => void;
}

const FCMToken = ({
  vapidKey,
  setVapidKey,
  fcmToken,
  clearToken,
  copyToken,
  handleGetToken,
  isInitialized,
  topics,
  newTopic,
  setNewTopic,
  isSubscribing,
  handleSubscribeToTopic,
}: FCMTokenProps) => {
  return (
    <Card className="border-primary/20 shadow-primary/5">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Key className="size-4 text-primary" />
          FCM Token
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 -mt-8">
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
            className="shrink-0 bg-transparent cursor-pointer"
            onClick={copyToken}
            disabled={!fcmToken}
          >
            <Copy className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="shrink-0 text-destructive bg-transparent cursor-pointer hover:text-destructive"
            onClick={clearToken}
            disabled={!fcmToken}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
        <Button
          className="w-full bg-primary hover:bg-primary/90 cursor-pointer mt-2"
          onClick={handleGetToken}
          disabled={!isInitialized}
        >
          Request Permission & Get Token
        </Button>

        <div className="space-y-3">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Group Subscriptions (Topics)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {topics.map((topic) => (
              <Badge
                key={topic.name}
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20 cursor-pointer"
                onClick={() => setNewTopic(topic.name)}
              >
                {topic.name}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Join a new group (e.g. 'dev-team')"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              className="text-xs"
              disabled={!fcmToken}
            />
            <Button
              size="sm"
              onClick={() => handleSubscribeToTopic(newTopic)}
              disabled={!fcmToken || !newTopic || isSubscribing}
              className="cursor-pointer"
            >
              {isSubscribing ? "Joining..." : "Join"}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground italic">
            * Users are automatically joined to the {"\"all_users\""} group on token
            retrieval.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FCMToken;
