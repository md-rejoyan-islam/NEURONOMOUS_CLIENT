import { Download } from 'lucide-react';
import { toast } from 'sonner';

const DownloadFirmware = ({ id }: { id: string }) => {
  const downloadFirmware = async () => {
    try {
      const response = await fetch(
        `/api/proxy/api/v1/firmwares/${id}/download`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/octet-stream',
          },
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to download firmware');
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `firmware-${id}.bin`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
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
    <button
      onClick={downloadFirmware}
      className="bg-primary/10 hover:bg-primary/20 group cursor-pointer items-center justify-center rounded-md p-2 text-black dark:text-white"
    >
      <Download className="h-4 w-4 group-hover:animate-bounce" />
    </button>
  );
};

export default DownloadFirmware;
