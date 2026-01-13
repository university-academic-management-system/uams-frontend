// components/payments/PageActions.tsx
import { Button } from '@/components/ui/Button';

export const PageActions = () => {
  return (
    <div className="flex items-center gap-4 mt-12 pt-8 border-t border-gray-200">
      <Button variant="secondary">Reset</Button>
      <Button variant="primary">Save Changes</Button>
    </div>
  );
};