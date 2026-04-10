"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import {
  Users, Search, X, Plus, UserCircle2, RefreshCw,
  ChevronDown, UserPlus, Loader2, Check, Link2, Trash2,
} from "lucide-react";

interface GuestProfile {
  slug: string;
  name: string;
  role?: string;
  description?: string;
  image?: string;
  social?: Record<string, string>;
}

interface GuestsEditorProps {
  /** Current value of the "participants" field — array of guest names (strings) */
  value: string[];
  onChange: (val: string[]) => void;
  onDelete: () => void;
  repoId: string;
}

const SOCIAL_NETWORKS = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/..." },
  { key: "twitter", label: "Twitter / X", placeholder: "https://x.com/..." },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/..." },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@..." },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/..." },
  { key: "website", label: "Website", placeholder: "https://..." },
];

// ---------- Create Guest Form ----------
// role and description share the same value (they mirror each other in the schema)
interface CreateFormState {
  name: string;
  role: string; // written to both `role` and `description` fields
  image: string;
  social: Record<string, string>;
}

const EMPTY_FORM: CreateFormState = {
  name: "",
  role: "",
  image: "",
  social: {},
};

function CreateGuestPanel({
  repoId,
  onCreated,
  onCancel,
}: {
  repoId: string;
  onCreated: (guest: GuestProfile) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<CreateFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [addSocialKey, setAddSocialKey] = useState("");

  const setField = (key: keyof CreateFormState, val: any) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  // Both Role and Description are the same value
  const setRoleAndDescription = (val: string) => setField("role", val);

  const setSocial = (netKey: string, val: string) =>
    setForm((prev) => ({
      ...prev,
      social: val ? { ...prev.social, [netKey]: val } : (() => {
        const s = { ...prev.social };
        delete s[netKey];
        return s;
      })(),
    }));

  const removeSocial = (netKey: string) => setSocial(netKey, "");

  const activeSocials = Object.keys(form.social);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    const toastId = toast.loading("Creating guest profile…");
    try {
      const res = await fetch("/api/repo/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo: repoId,
          name: form.name.trim(),
          role: form.role.trim() || undefined,
          description: form.role.trim() || undefined, // same value as role
          image: form.image.trim() || undefined,
          social: Object.keys(form.social).length > 0 ? form.social : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error creating guest");

      toast.success(`Guest "${form.name}" created and committed to GitHub`, { id: toastId });

      // Build the GuestProfile so the parent can add it immediately to the list
      const newGuest: GuestProfile = {
        slug: data.slug,
        name: form.name.trim(),
        role: form.role.trim() || undefined,
        description: form.role.trim() || undefined, // same value as role
        image: form.image.trim() || undefined,
        social: Object.keys(form.social).length > 0 ? form.social : undefined,
      };
      onCreated(newGuest);
    } catch (err: any) {
      toast.error(err.message || "Error creating guest", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const unusedNetworks = SOCIAL_NETWORKS.filter(
    (n) => !activeSocials.includes(n.key)
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 rounded-lg border border-primary/30 bg-primary/5 overflow-hidden"
    >
      {/* Form header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-primary/10 border-b border-primary/20">
        <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
          <UserPlus className="w-3.5 h-3.5" />
          New guest profile
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* Preview avatar */}
        {form.image && (
          <div className="flex justify-center mb-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.image}
              alt="preview"
              className="w-14 h-14 rounded-full object-cover border-2 border-primary/30"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        )}

        {/* Name (required) */}
        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">
            Name <span className="text-destructive">*</span>
          </label>
          <input
            required
            autoFocus
            type="text"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Joan"
            className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Role and Description share the same value */}
        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">
            Role
            <span className="ml-1.5 text-[10px] text-muted-foreground/60 font-normal">(= description)</span>
          </label>
          <input
            type="text"
            value={form.role}
            onChange={(e) => setRoleAndDescription(e.target.value)}
            placeholder="Alumno de 2º Bachillerato"
            className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">
            Description
            <span className="ml-1.5 text-[10px] text-muted-foreground/60 font-normal">(= role)</span>
          </label>
          <input
            type="text"
            value={form.role}
            onChange={(e) => setRoleAndDescription(e.target.value)}
            placeholder="Alumno de 2º Bachillerato"
            className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">Image URL</label>
          <input
            type="url"
            value={form.image}
            onChange={(e) => setField("image", e.target.value)}
            placeholder="https://cdn.example.com/guest/joan.jpg"
            className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono"
          />
        </div>

        {/* Social links */}
        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
            <Link2 className="w-3 h-3" /> Social links
          </label>

          {activeSocials.length > 0 && (
            <div className="space-y-2 mb-2">
              {activeSocials.map((netKey) => {
                const meta = SOCIAL_NETWORKS.find((n) => n.key === netKey);
                return (
                  <div key={netKey} className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground w-20 shrink-0 truncate">
                      {meta?.label ?? netKey}
                    </span>
                    <input
                      type="url"
                      value={form.social[netKey]}
                      onChange={(e) => setSocial(netKey, e.target.value)}
                      placeholder={meta?.placeholder ?? "https://..."}
                      className="flex-1 px-2.5 py-1.5 text-xs bg-background border border-input rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => removeSocial(netKey)}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {unusedNetworks.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {unusedNetworks.map((n) => (
                <button
                  key={n.key}
                  type="button"
                  onClick={() => {
                    setSocial(n.key, "");
                    setAddSocialKey(n.key);
                    setForm((prev) => ({ ...prev, social: { ...prev.social, [n.key]: "" } }));
                  }}
                  className="px-2 py-1 text-[11px] border border-dashed border-border rounded hover:border-primary/50 hover:text-primary text-muted-foreground transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> {n.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* File path preview */}
        {form.name && (
          <p className="text-[10px] text-muted-foreground font-mono bg-muted/40 px-2 py-1 rounded truncate">
            content/guests/
            {form.name
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")}
            .md
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !form.name.trim()}
            className="px-4 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            {saving ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Check className="w-3 h-3" />
            )}
            {saving ? "Creating…" : "Create & commit"}
          </button>
        </div>
      </div>
    </form>
  );
}

// ---------- Main GuestsEditor ----------
export function GuestsEditor({ value, onChange, onDelete, repoId }: GuestsEditorProps) {
  const [allGuests, setAllGuests] = useState<GuestProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ensure value is always a string array
  const participants: string[] = Array.isArray(value)
    ? value.filter((v) => typeof v === "string")
    : [];

  const fetchGuests = useCallback(async () => {
    if (!repoId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/repo/guests?repo=${encodeURIComponent(repoId)}`);
      if (!res.ok) throw new Error("Error loading guests");
      const data = await res.json();
      setAllGuests(data.guests || []);
    } catch (e: any) {
      setError(e.message || "Error loading guests");
      toast.error("Could not load guest profiles");
    } finally {
      setLoading(false);
    }
  }, [repoId]);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addParticipant = (guestName: string) => {
    if (participants.includes(guestName)) return;
    onChange([...participants, guestName]);
    setSearch("");
    setDropdownOpen(false);
  };

  const removeParticipant = (guestName: string) => {
    onChange(participants.filter((p) => p !== guestName));
  };

  // Guests that can still be added
  const availableGuests = allGuests.filter((g) => !participants.includes(g.name));

  // Filtered by search
  const filteredGuests = availableGuests.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.role?.toLowerCase().includes(search.toLowerCase())
  );

  const resolveGuest = (name: string): GuestProfile | undefined =>
    allGuests.find((g) => g.name === name);

  // Called when a new guest was successfully created
  const handleGuestCreated = (guest: GuestProfile) => {
    setAllGuests((prev) => [...prev, guest]);
    addParticipant(guest.name);
    setShowCreate(false);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Users className="w-4 h-4 text-primary/70" />
          participants
          <span className="text-xs text-muted-foreground font-normal">(guests)</span>
        </label>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={fetchGuests}
            disabled={loading}
            title="Reload guest profiles"
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="Delete participants field"
            className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded hover:bg-destructive/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Current participants */}
      {participants.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {participants.map((name) => {
            const guest = resolveGuest(name);
            return (
              <div
                key={name}
                className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-2 py-1.5 group hover:border-primary/40 transition-colors"
              >
                {guest?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={guest.image}
                    alt={name}
                    className="w-6 h-6 rounded-full object-cover border border-border shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <UserCircle2 className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-semibold text-foreground">{name}</span>
                  {guest?.role && (
                    <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
                      {guest.role}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeParticipant(name)}
                  className="ml-1 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                  title={`Remove ${name}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {participants.length === 0 && !loading && (
        <p className="text-xs text-muted-foreground italic">No participants added yet.</p>
      )}

      {/* Add participant dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => { setDropdownOpen((v) => !v); setShowCreate(false); }}
          disabled={loading}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-background border border-input rounded-md text-sm text-muted-foreground hover:border-ring hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <span className="flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" />
            {loading ? "Loading guests…" : "Add participant…"}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-lg shadow-xl overflow-hidden">
            {/* Search bar */}
            <div className="p-2 border-b border-border">
              <div className="flex items-center gap-2 px-2 py-1.5 bg-muted/40 rounded-md">
                <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search guests…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1 min-w-0"
                />
                {search && (
                  <button type="button" onClick={() => setSearch("")}>
                    <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* Guest list */}
            <div className="max-h-56 overflow-y-auto">
              {error && (
                <div className="p-3 text-center">
                  <p className="text-xs text-destructive">{error}</p>
                  <button
                    type="button"
                    onClick={fetchGuests}
                    className="mt-1 text-xs text-primary hover:underline"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!error && filteredGuests.length === 0 && (
                <div className="p-4 text-center">
                  {availableGuests.length === 0 && allGuests.length > 0 ? (
                    <p className="text-xs text-muted-foreground">All guests have been added.</p>
                  ) : allGuests.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No guest profiles found in{" "}
                      <code className="font-mono">content/guests/</code>
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">No results for "{search}"</p>
                  )}
                </div>
              )}

              {!error &&
                filteredGuests.map((guest) => (
                  <button
                    key={guest.slug}
                    type="button"
                    onClick={() => addParticipant(guest.name)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/60 transition-colors border-b border-border/40 last:border-0 group"
                  >
                    {guest.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={guest.image}
                        alt={guest.name}
                        className="w-8 h-8 rounded-full object-cover border border-border shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <UserCircle2 className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{guest.name}</p>
                      {guest.role && (
                        <p className="text-xs text-muted-foreground truncate">{guest.role}</p>
                      )}
                    </div>
                    <Plus className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                ))}
            </div>

            {/* Create new guest button inside dropdown */}
            <div className="p-2 border-t border-border bg-muted/20 flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground">
                From <code className="font-mono">content/guests/*.md</code>
              </p>
              <button
                type="button"
                onClick={() => { setDropdownOpen(false); setShowCreate(true); }}
                className="flex items-center gap-1.5 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded hover:bg-primary/10"
              >
                <UserPlus className="w-3 h-3" /> Create new
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inline Create Guest panel */}
      {showCreate && (
        <CreateGuestPanel
          repoId={repoId}
          onCreated={handleGuestCreated}
          onCancel={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}
