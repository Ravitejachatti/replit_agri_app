import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Messages() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{t("nav.messages")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Localized Message Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              This page displays i18n keys used by the advisory system.
            </p>
            <div className="bg-muted p-4 rounded-md space-y-1 font-mono text-xs">
              <p>hazard.PADDY_BLAST</p>
              <p>hazard.PADDY_BLB</p>
              <p>hazard.CHILLI_ANTHRACNOSE</p>
              <p>hazard.CHILLI_THRIPS</p>
              <p>hazard.FLOOD</p>
              <p>advice.irrigate.now</p>
              <p>advice.avoid.spray.rain</p>
              <p>advice.blast.fungicide</p>
              <p>advice.blb.copper</p>
              <p>advice.anthracnose.spray</p>
              <p>advice.thrips.action</p>
              <p>advice.flood.prepare</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
