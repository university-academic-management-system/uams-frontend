// components/payments/GlobalSettingsSection.tsx
import { Select } from "@/components/ui/Select";

export const GlobalSettingsSection = () => {
  // work please
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8 mb-12">
      <div className="space-y-6">
        <Select label="Language" value="English">
          <option>English</option>
        </Select>
        <Select label="Theme" value="Light">
          <option>Light</option>
          <option>Dark</option>
        </Select>
        <Select label="Font Size" value="Recommended">
          <option>Recommended</option>
        </Select>
        <Select label="Page Zoom" value="100%">
          <option>100%</option>
        </Select>
      </div>

      <div className="space-y-6">
        <Select label="Time Zone" value="(UTC+01:00) WAT (Lagos)">
          <option>(UTC+01:00) WAT (Lagos)</option>
        </Select>
        <Select label="Theme" value="Light">
          <option>Light</option>
          <option>Dark</option>
        </Select>
      </div>
    </div>
  );
};
