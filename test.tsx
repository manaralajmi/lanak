const AboutPlaceholderImage = ({ label, showLogo = false, className = "", aspect = "aspect-[4/3]" }) => (
  <div className={`relative flex items-center justify-center bg-[#DED4C5] overflow-hidden ${aspect} ${className}`}>
    {showLogo && (
      <img src={`${import.meta.env.BASE_URL}brand/l-anak-monogram.png`} alt="" className="absolute w-[15%] opacity-20" />
    )}
    <span className="relative z-10 text-[9px] font-bold uppercase tracking-[0.2em] text-[#49372D]/40">
      {label}
    </span>
  </div>
);
