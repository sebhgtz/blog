import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route, RouteComponentProps } from "wouter";

interface AdminProtectedRouteProps {
  path: string;
  component: React.ComponentType<any>;
}

export function AdminProtectedRoute({ path, component: Component }: AdminProtectedRouteProps) {
  const { user, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        {(params) => (
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        )}
      </Route>
    );
  }

  // Check if user is logged in and has admin privileges
  if (!user || !user.isAdmin) {
    return (
      <Route path={path}>
        {() => <Redirect to="/admin/login" />}
      </Route>
    );
  }

  return (
    <Route path={path}>
      {(params) => <Component {...params} />}
    </Route>
  );
}