import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mountain } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen grid place-items-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-soft p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-11 w-11 rounded-xl bg-primary grid place-items-center shadow-glow">
            <Mountain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl">Sand Supply</h1>
            <p className="text-xs text-muted-foreground">Sign in to your account</p>
          </div>
        </div>
        <div className="space-y-4">
          <div><Label>Email</Label><Input type="email" className="mt-1.5" placeholder="admin@sandsupply.lk" /></div>
          <div><Label>Password</Label><Input type="password" className="mt-1.5" placeholder="••••••••" /></div>
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-muted-foreground"><input type="checkbox" className="rounded" /> Remember me</label>
            <Link to="/change-password" className="text-primary hover:underline">Change password</Link>
          </div>
          <Button asChild className="w-full gradient-primary border-0 shadow-glow"><Link to="/">Sign In</Link></Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
