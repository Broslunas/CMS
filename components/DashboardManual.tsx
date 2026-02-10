
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface DashboardManualProps {
  content: string;
}

export default function DashboardManual({ content }: DashboardManualProps) {
  if (!content) return null;

  return (
    <Card className="mb-8 border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-primary">
          <BookOpen className="h-5 w-5" />
          <CardTitle className="text-lg font-bold">Documentation & Guidelines</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none pt-2 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
