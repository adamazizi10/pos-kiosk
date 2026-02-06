import { Button } from "@/components/ui/button";

const SettingsFooter = ({ onSave, onReset }) => {
  return (
    <div className="flex justify-end gap-3 border-t border-border pt-6">
      <Button variant="outline" onClick={onReset}>
        Reset to Defaults
      </Button>
      <Button onClick={onSave}>
        Save Changes
      </Button>
    </div>
  );
};

export default SettingsFooter;
