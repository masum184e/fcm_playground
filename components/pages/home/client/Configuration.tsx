import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FirebaseConfig } from "@/types/firebase";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { QuickSetupModal } from "./QuickSetupModal";
import { ServiceAccountModal } from "./ServiceAccountModal";

interface ConfigurationProps {
  isInitialized: boolean;
  config: FirebaseConfig;
  setConfig: React.Dispatch<React.SetStateAction<FirebaseConfig>>;
  handleInitialize: () => void;
  serviceAccountRaw: string;
  setServiceAccountRaw: (value: string) => void;
}

const Configuration = ({
  isInitialized,
  config,
  setConfig,
  handleInitialize,
  serviceAccountRaw,
  setServiceAccountRaw,
}: ConfigurationProps) => {
  return (
    <Card className="border-primary/20 shadow-primary/5">
      <CardHeader>
        <CardTitle className="text-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left Side: Icon and Title */}
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="size-4 shrink-0" />
            <span className="truncate">Configuration</span>
          </div>

          {/* Right Side: Badges and Modals */}
          <div className="flex flex-wrap flex-col items-start md:items-center md:flex-row gap-2 w-full sm:w-auto">
            {isInitialized ? (
              <Badge
                variant="secondary"
                className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 whitespace-nowrap"
              >
                <CheckCircle2 className="size-3 mr-1" /> Initialized
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-muted-foreground italic whitespace-nowrap"
              >
                Not Ready
              </Badge>
            )}

            {/* Buttons Container */}
            <div className="flex flex-col items-start md:items-center md:flex-row gap-2 md:ml-auto sm:ml-0">
              <QuickSetupModal onConfigParsed={setConfig} />
              <ServiceAccountModal onConfigParsed={setServiceAccountRaw} />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 -mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              API Key
            </label>
            <Input
              placeholder="AIza..."
              type="password"
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Auth Domain
            </label>
            <Input
              placeholder="project-id.firebaseapp.com"
              value={config.authDomain}
              onChange={(e) =>
                setConfig({ ...config, authDomain: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Project ID
            </label>
            <Input
              placeholder="my-project-123"
              value={config.projectId}
              onChange={(e) =>
                setConfig({ ...config, projectId: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Storage Bucket
            </label>
            <Input
              placeholder="project-id.appspot.com"
              value={config.storageBucket}
              onChange={(e) =>
                setConfig({ ...config, storageBucket: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Sender ID
            </label>
            <Input
              placeholder="123456789"
              value={config.messagingSenderId}
              onChange={(e) =>
                setConfig({ ...config, messagingSenderId: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              App ID
            </label>
            <Input
              placeholder="1:123456789:web:abcdef"
              value={config.appId}
              onChange={(e) => setConfig({ ...config, appId: e.target.value })}
            />
          </div>
        </div>
        <Button
          onClick={handleInitialize}
          className="w-full bg-primary hover:bg-primary/90 cursor-pointer mt-2"
        >
          Initialize Client SDK
        </Button>
      </CardContent>
    </Card>
  );
};

export default Configuration;
