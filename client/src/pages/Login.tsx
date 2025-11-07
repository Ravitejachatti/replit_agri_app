import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Leaf } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { userRoleMap } from "@shared/schema";

export default function Login() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { login } = useAuthStore();
  const [username, setUsername] = useState("");

  const handleLogin = (selectedUsername: string) => {
    login(selectedUsername);
    setLocation("/");
  };

  const quickSelectUsers = Object.keys(userRoleMap);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Leaf className="h-10 w-10" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">{t("login.title")}</CardTitle>
            <CardDescription className="mt-2">{t("app.subtitle")}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (username) handleLogin(username);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="username">{t("login.username")}</Label>
              <Input
                id="username"
                type="text"
                placeholder={t("login.username.placeholder")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                data-testid="input-username"
              />
            </div>
            <Button type="submit" className="w-full" data-testid="button-login">
              {t("login.button")}
            </Button>
          </form>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">{t("login.quickSelect")}</p>
            <div className="grid grid-cols-2 gap-2">
              {quickSelectUsers.map((user) => (
                <Button
                  key={user}
                  variant="outline"
                  onClick={() => handleLogin(user)}
                  className="text-xs"
                  data-testid={`button-quick-select-${user}`}
                >
                  {user}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
