import { useState } from "react";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Tag, 
  Users, 
  Settings, 
  LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ArticleManagement from "./components/ArticleManagement";
import CategoryManagement from "./components/CategoryManagement";
import MessageManagement from "./components/MessageManagement";
import UserManagement from "./components/UserManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  count?: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("articles");
  const { user, logoutMutation } = useAdminAuth();
  const [_, setLocation] = useLocation();

  // Query to get statistics for the dashboard
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      try {
        // In a real app, you would fetch actual stats from the API
        // For now, we'll use mock data
        return {
          articlesCount: 3,
          messagesCount: 0,
          categoriesCount: 3,
          usersCount: 1
        };
      } catch (error) {
        console.error("Error fetching stats:", error);
        throw error;
      }
    }
  });

  const dashboardItems: DashboardItem[] = [
    { id: "articles", name: "Articles", icon: <FileText className="h-5 w-5" />, count: stats?.articlesCount },
    { id: "categories", name: "Categories", icon: <Tag className="h-5 w-5" />, count: stats?.categoriesCount },
    { id: "messages", name: "Messages", icon: <MessageSquare className="h-5 w-5" />, count: stats?.messagesCount },
    { id: "users", name: "Users", icon: <Users className="h-5 w-5" />, count: stats?.usersCount },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
    setLocation("/admin/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Admin Header */}
      <header className="gradient-bg shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <LayoutDashboard className="h-6 w-6 mr-2 text-secondary" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.username}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <div className="container mx-auto p-4 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {dashboardItems.map((item) => (
            <Card key={item.id} className="gradient-bg border-none">
              <CardContent className="p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-secondary/10 rounded-full p-2 mr-3">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-muted-foreground">{item.name}</p>
                    <p className="text-2xl font-bold">{item.count || 0}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setActiveTab(item.id)}
                  className={activeTab === item.id ? "bg-secondary/20" : ""}
                >
                  {item.icon}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <Card className="gradient-bg border-none">
            <CardHeader>
              <CardTitle>
                {activeTab === "articles" && "Article Management"}
                {activeTab === "categories" && "Category Management"}
                {activeTab === "messages" && "Message Management"}
                {activeTab === "users" && "User Management"}
              </CardTitle>
              <CardDescription>
                {activeTab === "articles" && "Create, edit and delete articles"}
                {activeTab === "categories" && "Manage article categories"}
                {activeTab === "messages" && "View and respond to contact messages"}
                {activeTab === "users" && "Manage users and permissions"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TabsContent value="articles">
                <ArticleManagement />
              </TabsContent>
              <TabsContent value="categories">
                <CategoryManagement />
              </TabsContent>
              <TabsContent value="messages">
                <MessageManagement />
              </TabsContent>
              <TabsContent value="users">
                <UserManagement />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}