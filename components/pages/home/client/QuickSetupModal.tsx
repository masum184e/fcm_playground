"use client";

import { useState } from "react";
import { Wand2, ClipboardPaste } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FirebaseConfig } from "@/types/firebase";

interface QuickSetupModalProps {
  onConfigParsed: (config: FirebaseConfig) => void;
}

export function QuickSetupModal({ onConfigParsed }: QuickSetupModalProps) {
  const [rawPaste, setRawPaste] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAutoFill = () => {
    try {
      // Regex to extract values from a JS object string or JSON
      const extract = (key: string) => {
        const regex = new RegExp(`${key}:\\s*["']([^"']+)["']`, "i");
        const match = rawPaste.match(regex);
        return match ? match[1] : "";
      };

      const newConfig: FirebaseConfig = {
        apiKey: extract("apiKey"),
        authDomain: extract("authDomain"),
        projectId: extract("projectId"),
        storageBucket: extract("storageBucket"),
        messagingSenderId: extract("messagingSenderId"),
        appId: extract("appId"),
      };

      // Check if we found the bare minimum
      if (newConfig.apiKey && newConfig.projectId && newConfig.appId) {
        onConfigParsed(newConfig);
        setRawPaste("");
        setIsOpen(false);
        toast.success("Configuration parsed successfully!", {
          description: `Found credentials for project: ${newConfig.projectId}`,
        });
      } else {
        toast.error("Invalid Configuration", {
          description:
            "Required fields (apiKey, projectId, appId) are missing in the pasted text.",
        });
      }
    } catch (err) {
      console.error(err)
      toast.error("Parsing Error", {
        description:
          "The text format wasn't recognized. Please copy the entire firebaseConfig object.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-primary/30 text-primary hover:text-primary cursor-pointer"
        >
          <Wand2 className="size-3" />
          Smart Paste
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Quick Setup</DialogTitle>
          <DialogDescription>
            Copy the{" "}
            <code className="text-primary font-mono bg-primary/5 px-1 rounded">
              firebaseConfig
            </code>{" "}
            object from the Firebase Console and paste it here.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder={`const firebaseConfig = {\n  apiKey: "AIza...",\n  projectId: "...",\n  ...\n};`}
            className="min-h-[200px] font-mono text-[11px] leading-relaxed resize-none bg-muted/20"
            value={rawPaste}
            onChange={(e) => setRawPaste(e.target.value)}
          />
        </div>
        <DialogFooter className="flex-row justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button onClick={handleAutoFill} className="gap-2 cursor-pointer">
            <ClipboardPaste className="size-4" />
            Parse & Fill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
