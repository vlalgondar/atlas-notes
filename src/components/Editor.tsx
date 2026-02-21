"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

type Props = {
  initialJson: any;
  orgId: string;
  pageId: string;
};

export default function Editor({ initialJson, orgId, pageId }: Props) {
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPending, startTransition] = useTransition();
  useEffect(() => setMounted(true), []);

  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: initialJson ?? { type: "doc", content: [] },
    autofocus: true,
    immediatelyRender: false, // avoids SSR hydration warning
  });

  const handleSave = useCallback(async () => {
    if (!editor) return;
    setSaving(true);
    const json = editor.getJSON();
    const text = editor.getText();
    try {
      await fetch("/api/pages/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgId,
          pageId,
          contentJson: json,
          contentText: text,
        }),
      });
    } finally {
      // tiny defer to make the button feel snappy even on fast responses
      startTransition(() => setSaving(false));
    }
  }, [editor, orgId, pageId, startTransition]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSave]);

  if (!mounted) {
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <button className="rounded-md border px-3 py-1 text-sm" disabled>
            Loading…
          </button>
          <span className="text-xs text-zinc-500">Tip: Cmd/Ctrl+S</span>
        </div>
        <div className="prose max-w-none rounded-md border p-3 min-h-[12rem] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button onClick={handleSave} className="rounded-md border px-3 py-1 text-sm">
          {saving || isPending ? "Saving..." : "Save"}
        </button>
        <span className="text-xs text-zinc-500">Tip: Cmd/Ctrl+S</span>
      </div>
      <div className="prose max-w-none rounded-md border p-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
