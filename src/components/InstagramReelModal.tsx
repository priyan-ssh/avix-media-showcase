import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function InstagramReelModal({
  isOpen,
  onClose,
  reelUrl,
}: {
  isOpen: boolean;
  onClose: () => void;
  reelUrl: string | null;
}) {
  if (!reelUrl) return null;

  // Extract type and shortcode for robust Firefox & Chrome compatible embed URL
  const match = reelUrl.match(/instagram\.com\/(reel|p|tv)\/([A-Za-z0-9_-]+)/i);
  const embedUrl = match
    ? `https://www.instagram.com/${match[1]}/${match[2]}/embed/`
    : reelUrl.replace(/\/$/, "") + "/embed/";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[420px] border border-border bg-[#0a0a0a] p-0 sm:max-w-[420px] overflow-hidden rounded-2xl shadow-2xl">
        <DialogTitle className="sr-only">Instagram Reel</DialogTitle>
        <div className="relative flex aspect-[9/16] w-full items-center justify-center overflow-hidden bg-[#0a0a0a]">
          <iframe
            src={embedUrl}
            className="h-full w-full border-0 bg-[#0a0a0a] rounded-xl"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            scrolling="no"
            title="Instagram Reel Player"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
