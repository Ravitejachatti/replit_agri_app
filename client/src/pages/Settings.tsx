import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/settingsStore";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { language, onlineMode, theme, setLanguage, setOnlineMode, setTheme, reset } =
    useSettingsStore();
  const { logout } = useAuthStore();

  const handleReset = () => {
    reset();
    logout();
    toast({
      title: t("settings.reset"),
      description: "All data has been reset",
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight">{t("settings.title")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.language")}</CardTitle>
          <CardDescription>Select your preferred language</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="lang-te" className="flex-1">
              {t("settings.language.te")} (Telugu)
            </Label>
            <Switch
              id="lang-te"
              checked={language === "te"}
              onCheckedChange={(checked) => setLanguage(checked ? "te" : "en")}
              data-testid="switch-language-te"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="lang-en" className="flex-1">
              {t("settings.language.en")} (English)
            </Label>
            <Switch
              id="lang-en"
              checked={language === "en"}
              onCheckedChange={(checked) => setLanguage(checked ? "en" : "te")}
              data-testid="switch-language-en"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.onlineMode")}</CardTitle>
          <CardDescription>{t("settings.onlineMode.desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="online-mode">{t("settings.onlineMode")}</Label>
            <Switch
              id="online-mode"
              checked={onlineMode}
              onCheckedChange={setOnlineMode}
              data-testid="switch-online-mode"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose your display theme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <Switch
              id="dark-mode"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              data-testid="switch-theme"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.reset")}</CardTitle>
          <CardDescription>Reset all data and settings to default</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" data-testid="button-reset">
                {t("settings.reset")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("settings.reset.confirm")}</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. All local data will be cleared.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("action.cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} data-testid="button-reset-confirm">
                  {t("settings.reset")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
