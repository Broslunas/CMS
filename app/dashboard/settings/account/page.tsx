import { Separator } from "@/components/ui/separator";

export default function SettingsAccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings.
        </p>
      </div>
      <Separator />
      <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10">
          <h4 className="text-destructive font-medium mb-2">Danger Zone</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Irreversibly delete your account and all your data.
          </p>
          <button className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded text-sm font-medium">
             Delete Account
          </button>
      </div>
    </div>
  );
}
