interface PreviewProps {
    url: string;
  }
  
  export function Preview({ url }: PreviewProps) {
    return (
      <div className="h-full w-full bg-zinc-900 rounded-xl border border-sky-500/20 p-4 flex flex-col">
        <div className="flex-1 overflow-hidden rounded-xl">
          {url ? (
            <iframe
              src={url}
              className="h-full w-full rounded-xl border-0"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
              Starting the server...
              Currently tracking 10 files
            </div>
          )}
        </div>
      </div>
    );
  }
  