export function AuthBackgroundBlobs() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-50 dark:opacity-100">
      <div className="absolute top-[-20%] -right-[10%] w-200 h-200 bg-vivid-blue/20 rounded-full blur-[140px] transition-all animate-[spin_50s_linear_infinite]" />
      <div className="absolute top-[30%] -left-[10%] w-150 h-150 bg-vivid-green/15 rounded-full blur-[120px] transition-all animate-[spin_40s_linear_infinite_reverse]" />
    </div>
  );
}
