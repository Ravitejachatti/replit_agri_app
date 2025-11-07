import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Send, MessageSquare, Mail, Phone, Radio } from "lucide-react";
import type { AdvisoryTemplate, Channel, District, Mandal, Village, Farmer } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Communications() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<District | "">("");
  const [selectedMandal, setSelectedMandal] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>(["IN_APP"]);
  const [messageContent, setMessageContent] = useState("");

  const { data: templates } = useQuery<AdvisoryTemplate[]>({
    queryKey: ["/api/advisory-templates"],
  });

  const { data: mandals } = useQuery<Mandal[]>({
    queryKey: ["/api/mandals", selectedDistrict],
    enabled: !!selectedDistrict,
  });

  const { data: villages } = useQuery<Village[]>({
    queryKey: ["/api/villages", selectedMandal],
    enabled: !!selectedMandal,
  });

  const { data: farmers } = useQuery<Farmer[]>({
    queryKey: ["/api/farmers", selectedDistrict],
    enabled: !!selectedDistrict,
  });

  const sendMutation = useMutation({
    mutationFn: async (data: {
      farmerId: string;
      templateId: string;
      content: string;
      channels: Channel[];
    }) => {
      return apiRequest("POST", "/api/messages", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: t("communications.send"),
        description: "Message sent successfully",
      });
      setMessageContent("");
      setSelectedFarmer("");
    },
  });

  const channelIcons = {
    IN_APP: MessageSquare,
    WHATSAPP: MessageSquare,
    SMS: Mail,
    IVR: Radio,
  };

  const handleChannelToggle = (channel: Channel) => {
    setSelectedChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    );
  };

  const handleSend = () => {
    if (!selectedFarmer || !selectedTemplate || !messageContent) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    sendMutation.mutate({
      farmerId: selectedFarmer,
      templateId: selectedTemplate,
      content: messageContent,
      channels: selectedChannels,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{t("communications.title")}</h1>

      <div className="grid md:grid-cols-[320px_1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("communications.templates")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {templates?.map((template) => (
              <div
                key={template.id}
                className={`p-3 border rounded-md cursor-pointer hover-elevate ${
                  selectedTemplate === template.id ? "bg-accent" : ""
                }`}
                onClick={() => {
                  setSelectedTemplate(template.id);
                  setMessageContent(template.messageKey);
                }}
                data-testid={`template-${template.id}`}
              >
                <p className="text-sm font-medium">
                  {template.hazard === "GENERIC" ? "Generic" : t(`hazard.${template.hazard}`)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{template.messageKey}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("communications.compose")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("communications.selectDistrict")}</Label>
                  <Select
                    value={selectedDistrict}
                    onValueChange={(val) => setSelectedDistrict(val as District)}
                  >
                    <SelectTrigger data-testid="select-district">
                      <SelectValue placeholder={t("communications.selectDistrict")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Krishna">{t("district.Krishna")}</SelectItem>
                      <SelectItem value="Guntur">{t("district.Guntur")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("communications.selectMandal")}</Label>
                  <Select
                    value={selectedMandal}
                    onValueChange={setSelectedMandal}
                    disabled={!selectedDistrict}
                  >
                    <SelectTrigger data-testid="select-mandal">
                      <SelectValue placeholder={t("communications.selectMandal")} />
                    </SelectTrigger>
                    <SelectContent>
                      {mandals?.map((mandal) => (
                        <SelectItem key={mandal.id} value={mandal.id}>
                          {mandal.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("communications.selectVillage")}</Label>
                  <Select
                    value={selectedVillage}
                    onValueChange={setSelectedVillage}
                    disabled={!selectedMandal}
                  >
                    <SelectTrigger data-testid="select-village">
                      <SelectValue placeholder={t("communications.selectVillage")} />
                    </SelectTrigger>
                    <SelectContent>
                      {villages?.map((village) => (
                        <SelectItem key={village.id} value={village.id}>
                          {village.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("communications.selectFarmer")}</Label>
                  <Select value={selectedFarmer} onValueChange={setSelectedFarmer}>
                    <SelectTrigger data-testid="select-farmer">
                      <SelectValue placeholder={t("communications.selectFarmer")} />
                    </SelectTrigger>
                    <SelectContent>
                      {farmers?.map((farmer) => (
                        <SelectItem key={farmer.id} value={farmer.id}>
                          {farmer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Channels</Label>
                <div className="flex gap-2">
                  {(["IN_APP", "WHATSAPP", "SMS", "IVR"] as Channel[]).map((channel) => {
                    const Icon = channelIcons[channel];
                    return (
                      <Badge
                        key={channel}
                        variant={selectedChannels.includes(channel) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleChannelToggle(channel)}
                        data-testid={`badge-channel-${channel}`}
                      >
                        <Icon className="h-3 w-3 mr-1" />
                        {channel}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("communications.preview")}</Label>
                <Textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={6}
                  placeholder="Message content..."
                  data-testid="textarea-message"
                />
              </div>

              <Button
                onClick={handleSend}
                className="w-full"
                disabled={sendMutation.isPending}
                data-testid="button-send-message"
              >
                <Send className="h-4 w-4 mr-2" />
                {t("communications.send")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
