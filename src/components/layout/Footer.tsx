'use client';

export function Footer() {
  return (
    <footer className="border-t py-4 px-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Systems Normal
          </span>
          <span className="ml-4">&copy; {new Date().getFullYear()} TaskBoard Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-foreground cursor-pointer">Docs</span>
          <span className="hover:text-foreground cursor-pointer">Support</span>
          <span className="text-xs border rounded px-2 py-1">Keyboard Shortcuts</span>
        </div>
      </div>
    </footer>
  );
}
