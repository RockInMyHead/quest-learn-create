
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import DetailedStats from '@/components/DetailedStats';

const StatsModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full">
          <BarChart3 className="w-4 h-4 mr-2" />
          Подробная статистика
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Детальная статистика</DialogTitle>
          <DialogDescription>
            Подробная информация о вашем прогрессе обучения
          </DialogDescription>
        </DialogHeader>
        <DetailedStats />
      </DialogContent>
    </Dialog>
  );
};

export default StatsModal;
