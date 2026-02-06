import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralSettings from "./GeneralSettings";
import POSSettings from "./POSSettings";
import KioskSettings from "./KioskSettings";
import PaymentsSettings from "./PaymentsSettings";
import ReceiptsSettings from "./ReceiptsSettings";
import SystemSettings from "./SystemSettings";

const SettingsTabs = () => {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="pos">POS</TabsTrigger>
        <TabsTrigger value="kiosk">Kiosk</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="receipts">Receipts</TabsTrigger>
        <TabsTrigger value="system">System</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <GeneralSettings />
      </TabsContent>

      <TabsContent value="pos">
        <POSSettings />
      </TabsContent>

      <TabsContent value="kiosk">
        <KioskSettings />
      </TabsContent>

      <TabsContent value="payments">
        <PaymentsSettings />
      </TabsContent>

      <TabsContent value="receipts">
        <ReceiptsSettings />
      </TabsContent>

      <TabsContent value="system">
        <SystemSettings />
      </TabsContent>
    </Tabs>
  );
};

export default SettingsTabs;
