import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mountain, Mail, Lock } from "lucide-react";

// TODO: Replace with the client's actual business name
const CLIENT_NAME = "Your Business Name";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-sand">
      <main className="flex-1 grid place-items-center p-6">
        <div className="w-full max-w-md">
          {/* Client Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 rounded-2xl gradient-primary grid place-items-center shadow-glow mb-4">
              <Mountain className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="font-display font-bold text-3xl tracking-tight text-foreground">
              {CLIENT_NAME}
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Sign in to manage your business operations
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] text-muted-foreground">
              Powered by <span className="font-semibold text-foreground">Cita ERP</span>
            </span>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-border bg-card shadow-elevated p-7">
            <div className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="admin@citaerp.com" className="pl-9 h-11 bg-background" />
                </div>
              </div>
              <div>
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="••••••••" className="pl-9 h-11 bg-background" />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="rounded border-border" /> Remember me
                </label>
                <Link to="/change-password" className="text-primary font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button asChild className="w-full h-11 gradient-primary border-0 shadow-glow text-base font-semibold">
                <Link to="/">Sign In</Link>
              </Button>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Need help? Contact{" "}
            <a href="mailto:support@insharptech.com" className="text-primary hover:underline">
              support@insharptech.com
            </a>
          </p>
        </div>
      </main>

      <footer className="border-t border-border bg-card/60 backdrop-blur py-4 px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground max-w-6xl mx-auto">
          <p>© {new Date().getFullYear()} Cita ERP. All Rights Reserved.</p>
          <p>Produced by <span className="font-medium text-foreground">Insharp Technologies (PVT) LTD</span></p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
