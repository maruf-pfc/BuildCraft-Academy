"use client";

import { useQuery } from "@tanstack/react-query";
import { cmsService } from "@/services/cms.service";

interface CmsContentProps {
  identifier: string;
  fallback: string;
  className?: string;
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3";
}

export function CmsContent({
  identifier,
  fallback,
  className = "",
  as: Component = "p",
}: CmsContentProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["cms-block", identifier],
    queryFn: () => cmsService.getByIdentifier(identifier),
    staleTime: 1000 * 60 * 10, // 10 minutes cache
    retry: 1,
  });

  const displayContent = data?.data?.content || fallback;

  if (isLoading && !data) {
    return (
      <span className={`inline-block animate-pulse bg-muted rounded min-w-[120px] h-[1.2em] vertical-align-middle ${className}`} />
    );
  }

  // Preserve newlines
  if (displayContent.includes("\n")) {
    return (
      <Component className={className} style={{ whiteSpace: "pre-line" }}>
        {displayContent}
      </Component>
    );
  }

  return <Component className={className}>{displayContent}</Component>;
}
