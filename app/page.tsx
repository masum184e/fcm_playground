import React from "react";
import {
  Target,
  Users,
  Megaphone,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  color,
}: FeatureCardProps) => (
  <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardHeader>
      <div
        className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4 mx-auto`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <CardTitle className="text-xl font-bold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </CardContent>
  </Card>
);

export default function FCMFeaturePage() {
  return (
    <div className="py-8 w-full bg-white overflow-hidden flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wider mb-6 border border-orange-100">
          <CheckCircle2 className="w-3 h-3" /> Powered by Firebase
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Reach your users{" "}
          <span className="text-orange-600 underline decoration-orange-200">
            anywhere.
          </span>
        </h1>

        <p className="text-lg text-slate-500 max-w-2xl mb-12">
          Our advanced Cloud Messaging engine allows you to segment your
          audience and deliver the right message at the perfect moment.
        </p>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 w-full">
          <FeatureCard
            icon={Target}
            title="Individual Targeting"
            description="Send personalized alerts, account updates, or private messages directly to a specific user's device using unique registration tokens."
            color="bg-orange-500"
          />
          <FeatureCard
            icon={Users}
            title="Topic Subscriptions"
            description="Organize users by interests or behavior. Group them into topics like 'Sports' or 'Tech' to send relevant content to thousands at once."
            color="bg-orange-500"
          />
          <FeatureCard
            icon={Megaphone}
            title="Global Broadcast"
            description="Deploy critical system-wide announcements or major marketing campaigns to your entire user base with a single click."
            color="bg-orange-500"
          />
        </div>
      </div>
    </div>
  );
}
