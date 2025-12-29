import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, CheckCircle2 } from "lucide-react";

interface ConfigurationProps {
  isInitialized: boolean;
  serviceAccountRaw: string;
  setServiceAccountRaw: (value: string) => void;
  handleInitialize: () => void;
}

const Configuration = ({
  isInitialized,
  serviceAccountRaw,
  setServiceAccountRaw,
  handleInitialize,
}: ConfigurationProps) => {
  return (
    <Card className="border-secondary/20 shadow-secondary/5">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="size-4 text-secondary" />
            Admin Configuration
          </div>
          {isInitialized ? (
            <Badge
              variant="secondary"
              className="bg-orange-500/10 text-orange-600 border-orange-500/20"
            >
              <CheckCircle2 className="size-3 mr-1" /> Initialized
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground italic">
              Awaiting JSON
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Paste your Service Account JSON from Firebase Console
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            Service Account JSON
            <span className="text-[10px] font-normal lowercase text-muted-foreground/60 italic">
              Never persisted
            </span>
          </label>
          <textarea
            value={serviceAccountRaw}
            onChange={(e) => setServiceAccountRaw(e.target.value)}
            className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
            placeholder='{ "type": "service_account", "project_id": "..." }'
          />
        </div>
        <Button
          onClick={handleInitialize}
          className="w-full bg-secondary hover:bg-secondary/90 text-white cursor-pointer"
          disabled={!serviceAccountRaw}
        >
          Validate & Initialize
        </Button>
      </CardContent>
    </Card>
  );
};

export default Configuration;
