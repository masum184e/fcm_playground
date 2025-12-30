"use client";

import { useState } from "react";
import { KeyRound, ClipboardPaste } from "lucide-react";
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

interface ServiceAccountModalProps {
  onConfigParsed: (value: string) => void;
}

export function ServiceAccountModal({
  onConfigParsed,
}: ServiceAccountModalProps) {
  const [rawPaste, setRawPaste] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleParseJSON = () => {
    try {
      // Parse the raw text as JSON
      const json = JSON.parse(rawPaste);

      // Validate required Service Account fields
      const requiredFields = ["project_id", "private_key", "client_email"];

      const hasAllFields = requiredFields.every((field) => json[field]);

      if (hasAllFields) {
        onConfigParsed(json);
        setRawPaste("");
        setIsOpen(false);
        toast.success("Service account loaded successfully!", {
          description: `Admin access granted for project: ${json.project_id}`,
        });
      } else {
        toast.error("Invalid Credentials", {
          description:
            "Missing required fields. Ensure you've pasted the full JSON file content.",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Format Error", {
        description:
          "Please check your JSON syntax. Make sure to include the curly braces { }.",
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
          <KeyRound className="size-3" />
          Import Service Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Admin Setup (Server-Side)</DialogTitle>
          <DialogDescription>
            Paste the contents of your{" "}
            <code className="text-orange-600 font-mono bg-orange-50 px-1 rounded">
              service-account.json
            </code>{" "}
            file. This is required for sending notifications and managing
            topics.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <textarea
            placeholder={`{\n  "type": "service_account",\n  "project_id": "...",\n  "private_key": "-----BEGIN PRIVATE KEY...",\n  ...\n}`}
            className="min-h-[250px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
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
          <Button onClick={handleParseJSON} className="gap-2 cursor-pointer">
            <ClipboardPaste className="size-4" />
            Load Credentials
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
