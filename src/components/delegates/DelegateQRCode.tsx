import { FC } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Delegate } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface DelegateQRCodeProps {
  isOpen: boolean;
  onClose: () => void;
  delegate: Delegate;
}

export const DelegateQRCode: FC<DelegateQRCodeProps> = ({
  isOpen,
  onClose,
  delegate,
}) => {
  const qrValue = `http://localhost:3000/delegates/${delegate.id}`;

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const svg = document.querySelector('svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const link = document.createElement('a');
          link.download = `qr-code-${delegate.id}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delegate QR Code</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center">
            <QRCodeSVG
              value={qrValue}
              size={256}
              level="H"
              includeMargin
              className="border p-4 rounded-lg"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleDownload}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download QR Code</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
