import bovyeIcon from "@/assets/bovye-icon.png";

const BovyeLogo = ({ className = "" }: { className?: string }) => (
  <span className={`inline-flex items-center gap-2.5 font-display font-extrabold tracking-tight ${className}`}>
    <img src={(bovyeIcon as any).src || bovyeIcon} alt="Bovye" className="h-8 w-8" />
    <span className="text-xl" >
      <span className="text-foreground">Bov</span>
      <span className="gradient-text">ye</span>
    </span>
  </span>
);

export default BovyeLogo;
