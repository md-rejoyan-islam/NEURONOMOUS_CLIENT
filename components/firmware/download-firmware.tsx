import { useLazyDownloadFirmwareQuery } from '@/queries/firmware';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { DropdownMenuItem } from '../ui/dropdown-menu';

const DownloadFirmware = ({ id }: { id: string }) => {
  const [download] = useLazyDownloadFirmwareQuery();

  const downloadFirmware = async () => {
    try {
      const data = await download(id).unwrap();
      if (data) {
        const blob = new Blob([data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `firmware-${id}.bin`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
      toast.success('Download successful', {
        description: `Firmware ${id} has been downloaded.`,
      });
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Download failed', {
        description:
          error?.data?.message ||
          'Failed to download firmware. Please try again.',
      });
    }
  };

  return (
    <DropdownMenuItem onClick={downloadFirmware}>
      <Download className="mr-2 h-4 w-4" />
      Download
    </DropdownMenuItem>
  );
};

export default DownloadFirmware;
