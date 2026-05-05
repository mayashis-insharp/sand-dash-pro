import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mountain } from "lucide-react";
import { toast } from "sonner";

const ChangePassword = () => {
  return (
    <div className="min-h-screen grid place-items-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-soft p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-11 w-11 rounded-xl bg-primary grid place-items-center shadow-glow">
            <Mountain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl">Change Password</h1>
            <p className="text-xs text-muted-foreground">Update your account password</p>
          </div>
        </div>
        <div className="space-y-4">
          <div><Label>Current Password</Label><Input type="password" className="mt-1.5" /></div>
          <div><Label>New Password</Label><Input type="password" className="mt-1.5" /></div>
          <div><Label>Confirm New Password</Label><Input type="password" className="mt-1.5" /></div>
          <Button className="w-full gradient-primary border-0 shadow-glow" onClick={() => toast.success("Password updated")}>Update Password</Button>
          <Link to="/login" className="block text-center text-xs text-muted-foreground hover:text-foreground">Back to login</Link>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
