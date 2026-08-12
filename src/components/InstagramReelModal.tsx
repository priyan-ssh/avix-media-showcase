import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";

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
      <DialogContent className="max-w-[420px] border border-border bg-[#0a0a0a] p-0 sm:max-w-[420px] overflow-hidden rounded-2xl shadow-2xl [&>button]:hidden flex flex-col">
        <DialogTitle className="sr-only">Instagram Reel</DialogTitle>
        <div className="relative flex aspect-[9/16] w-full items-center justify-center overflow-hidden bg-[#0a0a0a]">
          <iframe
            src={embedUrl}
            className="h-full w-full border-0 bg-[#0a0a0a]"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            scrolling="no"
            title="Instagram Reel Player"
          />
        </div>
        <div className="flex items-center justify-center p-3 bg-zinc-950 border-t border-zinc-800/50">
          <DialogClose asChild>
            <button
              type="button"
              className="w-full max-w-[200px] rounded-full bg-zinc-800 px-4 py-2.5 text-sm font-bold tracking-wider text-white hover:bg-zinc-700 transition"
            >
              Close Reel
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
