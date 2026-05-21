"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  RiSettings4Line,
  RiAddLine,
  RiDeleteBinLine,
  RiCheckDoubleLine,
  RiErrorWarningLine,
  RiEditLine,
  RiCloseLine
} from "react-icons/ri";
import { cmsService } from "@/services/cms.service";
import type { ContentBlockResponseDto } from "@/types";

const schema = z.object({
  identifier: z.string().min(2, "Identifier must be at least 2 characters"),
  content: z.string().min(5, "Content must be at least 5 characters"),
  type: z.string().min(1, "Type must be specified"),
  isActive: z.boolean(),
});

type CmsForm = z.infer<typeof schema>;

export default function AdminCmsPage() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ContentBlockResponseDto | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CmsForm>({
    resolver: zodResolver(schema),
    defaultValues: { isActive: true, type: "Text" }
  });

  // Query all content blocks (including inactive ones)
  const { data, isLoading } = useQuery({
    queryKey: ["admin-cms"],
    queryFn: () => cmsService.getAll(false),
  });

  const blocks: ContentBlockResponseDto[] = data?.data ?? [];

  // Create block mutation
  const createMutation = useMutation({
    mutationFn: (data: CmsForm) => cmsService.create(data),
    onSuccess: () => {
      toast.success("CMS Content Block created!");
      queryClient.invalidateQueries({ queryKey: ["admin-cms"] });
      reset();
      setShowAddForm(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Update block mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CmsForm }) => cmsService.update(id, data),
    onSuccess: () => {
      toast.success("CMS Block updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-cms"] });
      setEditingBlock(null);
      reset();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Delete block mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => cmsService.delete(id),
    onSuccess: () => {
      toast.success("CMS block deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-cms"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleEditClick = (block: ContentBlockResponseDto) => {
    setEditingBlock(block);
    setValue("identifier", block.identifier);
    setValue("content", block.content);
    setValue("type", block.type);
    setValue("isActive", block.isActive);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage CMS Content</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Dynamic site-wide copy config, Hero headers, Stats, and alert bars.
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingBlock(null);
            reset();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/10"
        >
          <RiAddLine /> Create CMS Block
        </button>
      </div>

      {/* Form Modal */}
      {(showAddForm || editingBlock) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <form
            onSubmit={handleSubmit((d) => {
              if (editingBlock) {
                updateMutation.mutate({ id: editingBlock.id, data: d });
              } else {
                createMutation.mutate(d);
              }
            })}
            className="rounded-2xl border border-border bg-background p-6 space-y-4 shadow-2xl w-full max-w-2xl my-8 relative animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="font-bold text-base">
                {editingBlock ? "Edit Content Block Configuration" : "New Content Block Configuration"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingBlock(null);
                  reset();
                }}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
              >
                <RiCloseLine className="text-lg" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Identifier */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Unique Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. homepage_hero_title"
                  {...register("identifier")}
                  disabled={!!editingBlock}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
                />
                {errors.identifier && <p className="text-xs text-destructive">{errors.identifier.message}</p>}
              </div>

              {/* Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Block Type</label>
                <select
                  {...register("type")}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="Text">Text</option>
                  <option value="Html">Html</option>
                  <option value="ImageUrl">ImageUrl</option>
                  <option value="Json">Json</option>
                </select>
                {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-6">
                <input
                  id="isActive"
                  type="checkbox"
                  {...register("isActive")}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
                />
                <label htmlFor="isActive" className="text-xs font-semibold text-muted-foreground cursor-pointer">
                  Activate Block
                </label>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Content Body</label>
              <textarea
                rows={4}
                {...register("content")}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
              {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
            </div>

            <div className="flex gap-2 pt-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingBlock(null);
                  reset();
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-border hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/15"
              >
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Block"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blocks List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-border p-6 flex gap-4 animate-pulse bg-background">
              <div className="w-12 h-12 rounded-xl bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : blocks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-background max-w-lg mx-auto">
          <RiSettings4Line className="text-5xl text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-lg">No CMS configurations</h3>
          <p className="text-sm text-muted-foreground">Setup content blocks to drive site copy dynamically.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block) => (
            <div
              key={block.id}
              className="rounded-2xl border border-border bg-background p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/30 transition-all"
            >
              <div className="flex gap-4 items-center min-w-0">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${block.isActive ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-muted/80 border-border text-muted-foreground/50"}`}>
                  {block.isActive ? <RiCheckDoubleLine className="text-xl animate-pulse" /> : <RiErrorWarningLine className="text-lg" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-foreground truncate">{block.identifier}</h3>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase shrink-0 ${block.isActive ? "bg-green-500/10 border-green-500/25 text-green-500" : "bg-muted border-border text-muted-foreground"}`}>
                      {block.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">Type: {block.type}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60 justify-end">
                <button
                  onClick={() => handleEditClick(block)}
                  className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 border border-border hover:border-primary/20 rounded-xl transition-all"
                  title="Edit CMS Block"
                >
                  <RiEditLine className="text-base" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this CMS content block?")) {
                      deleteMutation.mutate(block.id);
                    }
                  }}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 border border-border hover:border-destructive/20 rounded-xl transition-all"
                  title="Delete Block"
                >
                  <RiDeleteBinLine className="text-base" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
