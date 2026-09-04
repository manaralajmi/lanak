import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { ArrowDown, ArrowUpRight, Check, ChevronDown, Coffee, Gift, Heart, MapPin, Menu, Minus, Plus, RotateCcw, Search, Send, ShoppingBag, User, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import '@/index.css';
import heroCampaignImage from '@/assets/lanak-hero-campaign.png';

const queryClient = new QueryClient();

type Lang = 'en' | 'ar';
type Product = { id: string; name: string; ar: string; note: string; price: number; category: string; mark: string };

const products: Product[] = [
  { id: 'morning', name: 'A softer morning', ar: 'صباح أهدأ', note: 'For the one who needs a little quiet.', price: 18, category: 'care', mark: '01' },
  { id: 'kitchen', name: 'The kitchen table', ar: 'سفرة البيت', note: 'A little something to gather around.', price: 24, category: 'home', mark: '02' },
  { id: 'thankyou', name: 'Just, thank you', ar: 'شكراً، وبس', note: 'No occasion needed.', price: 12, category: 'thanks', mark: '03' },
  { id: 'thinking', name: 'I was thinking of you', ar: 'كنت أفكر فيك', note: 'A small reminder, right on time.', price: 16, category: 'thinking', mark: '04' },
  { id: 'celebrate', name: 'Make a little noise', ar: 'خلّنا نحتفل', note: 'For the good news and the good days.', price: 31, category: 'celebrate', mark: '05' },
  { id: 'coffee', name: 'Coffee, on me', ar: 'القهوة علي', note: 'A warm cup from wherever they are.', price: 5, category: 'coffee', mark: '06' },
];

const featuredGifts: (Product & { categoryAr: string; categoryEn: string; placeholder: string })[] = [
  { id: 'featured-coffee', name: 'Coffee is on me', ar: 'قهوتك علي', note: '', price: 5, category: 'coffee', categoryAr: 'قهوة', categoryEn: 'Coffee', placeholder: 'COFFEE IMAGE', mark: '01' },
  { id: 'featured-care', name: 'Treat yourself today', ar: 'دلّعي نفسج اليوم', note: '', price: 20, category: 'care', categoryAr: 'عناية', categoryEn: 'Self-Care', placeholder: 'SELF-CARE IMAGE', mark: '02' },
  { id: 'featured-sweets', name: 'Sweets are on me', ar: 'الحلو علي', note: '', price: 10, category: 'sweets', categoryAr: 'حلو', categoryEn: 'Sweets', placeholder: 'SWEETS IMAGE', mark: '03' },
  { id: 'featured-dining', name: 'Dinner is on me', ar: 'عشا اليوم علي', note: '', price: 25, category: 'dining', categoryAr: 'مطاعم', categoryEn: 'Dining', placeholder: 'DINING IMAGE', mark: '04' },
];

const copy = {
  en: {
    nav: ['HOME', 'GIFT NOW', 'OUR PICKS', 'ABOUT L’ANAK', 'GIFT CARD'],
    announcement: 'DELIVERING ACROSS KUWAIT',
    heroLine1: 'There doesn’t have to be a reason,',
    heroLine2: 'sometimes you are the reason.',
    heroPayoff: 'Because it’s you.',
    heroCta: 'Discover Gifts',
  },
  ar: {
    nav: ['الرئيسية', 'أهدِ الآن', 'اختياراتنا', 'عن لأنّك', 'بطاقة هدية'],
    announcement: 'التوصيل لجميع مناطق الكويت',
    heroLine1: 'مو لازم يكون فيه سبب،',
    heroLine2: 'أحيانًا ممكن تكون أنت السبب.',
    heroPayoff: 'لأنّك أنت.',
    heroCta: 'يلا نهدي',
  },
};

function App() {
  const [lang, setLang] = useState<Lang>('ar');
  const [bag, setBag] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [toast, setToast] = useState('');
  const isSignedIn = false;
  const isAr = lang === 'ar';
  const t = copy[lang];

  useEffect(() => { document.documentElement.dir = isAr ? 'rtl' : 'ltr'; document.documentElement.lang = lang; }, [isAr, lang]);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 2500); return () => window.clearTimeout(timer); }, [toast]);

  const addToBag = (product: Product) => { setBag((items) => [...items, product]); setToast(isAr ? 'انضافت للشنطة' : 'Added to your gift bag'); };
  const toggleFavorite = (id: string) => {
    if (!isSignedIn) {
      setToast(isAr ? 'سجّل دخولك عشان نحفظ اختياراتك لك.' : 'Sign in to save your favorites.');
      return;
    }
    setFavorites((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <SiteShell lang={lang} setLang={setLang} menuOpen={menuOpen} setMenuOpen={setMenuOpen} bagCount={bag.length} setBagOpen={setBagOpen} setToast={setToast} isAr={isAr}>
            <RoutedErrorBoundary>
              <Switch>
                 <Route path="/"><Home lang={lang} t={t} addToBag={addToBag} toggleFavorite={toggleFavorite} favorites={favorites} setToast={setToast} /></Route>
                <Route path="/shop"><Shop lang={lang} addToBag={addToBag} toggleFavorite={toggleFavorite} favorites={favorites} /></Route>
                <Route path="/gift-now"><Shop lang={lang} addToBag={addToBag} toggleFavorite={toggleFavorite} favorites={favorites} /></Route>
                <Route path="/our-picks"><NavigationPlaceholder lang={lang} title="OUR PICKS" titleAr="اختياراتنا" /></Route>
                <Route path="/favorites"><NavigationPlaceholder lang={lang} title="FAVORITES" titleAr="المفضلة" /></Route>
                <Route path="/account"><NavigationPlaceholder lang={lang} title="ACCOUNT" titleAr="الحساب" /></Route>
                <Route path="/gift-bag"><NavigationPlaceholder lang={lang} title="GIFT BAG" titleAr="شنطة الهدايا" /></Route>
                <Route path="/coffee"><CategoryPlaceholder lang={lang} title="COFFEE" titleAr="قهوة" /></Route>
                <Route path="/sweets"><CategoryPlaceholder lang={lang} title="SWEETS" titleAr="حلو" /></Route>
                <Route path="/restaurants"><CategoryPlaceholder lang={lang} title="RESTAURANTS" titleAr="مطاعم" /></Route>
                <Route path="/flowers"><CategoryPlaceholder lang={lang} title="FLOWERS" titleAr="ورد" /></Route>
                <Route path="/self-care"><CategoryPlaceholder lang={lang} title="SELF-CARE" titleAr="عناية" /></Route>
                <Route path="/gifts"><CategoryPlaceholder lang={lang} title="GIFTS" titleAr="هدايا" /></Route>
                <Route path="/gift-cards"><GiftCards lang={lang} setToast={setToast} /></Route>
                <Route path="/how-it-works"><HowItWorks lang={lang} /></Route>
                <Route path="/about"><About lang={lang} /></Route>
                <Route component={NotFound} />
              </Switch>
            </RoutedErrorBoundary>
          </SiteShell>
          {bagOpen && <BagDrawer lang={lang} bag={bag} setBag={setBag} setBagOpen={setBagOpen} setToast={setToast} />}
          {toast && <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 border border-[#49372D] bg-[#49372D] px-5 py-3 text-sm text-[#FAF7F0] shadow-md" data-testid="status-toast">{toast}</div>}
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function SiteShell({ children, lang, setLang, menuOpen, setMenuOpen, bagCount, setBagOpen, setToast, isAr }: { children: ReactNode; lang: Lang; setLang: (lang: Lang) => void; menuOpen: boolean; setMenuOpen: (open: boolean) => void; bagCount: number; setBagOpen: (open: boolean) => void; setToast: (message: string) => void; isAr: boolean }) {
  const [location] = useLocation();
  const nav = copy[lang].nav;
  const links = ['/', '/gift-now', '/our-picks', '/about', '/gift-cards'];
  
  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#FAF7F0] text-[#49372D]">
      <div className="border-b border-[#49372D]/15 bg-[#F5F0E8] px-5 py-[7px] text-center text-[9px] font-semibold tracking-[.18em] text-[#49372D]" data-testid="text-announcement">
        {copy[lang].announcement}
      </div>
      <header className="relative z-40 w-full border-b border-[#F5F0E8]/15 bg-[#49372D] text-[#F5F0E8]">
        <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-4 px-5 py-4 md:grid-cols-[1fr_auto_1fr] md:px-10 md:py-5">
          <nav className="hidden items-center gap-[clamp(1.75rem,2.6vw,3rem)] md:flex" aria-label="Main navigation">
            {nav.map((item, index) => <Link key={item} href={links[index]} className={`header-nav-link whitespace-nowrap font-medium ${isAr ? 'font-nav-ar text-[18px] leading-none' : 'text-[15px] tracking-[.04em] lg:text-[16px]'} ${location === links[index] ? 'is-active' : ''}`} data-testid={`link-nav-${links[index] === '/' ? 'home' : links[index].slice(1)}`}>{item}</Link>)}
          </nav>
          <Link href="/" className="absolute left-1/2 top-1/2 flex h-11 w-[124px] -translate-x-1/2 -translate-y-1/2 items-center justify-center md:static md:h-14 md:w-[154px] md:translate-x-0 md:translate-y-0 md:justify-self-center" aria-label="L’ANAK home" data-testid="link-logo">
            <img src={`${import.meta.env.BASE_URL}brand/l-anak-monogram.png`} alt="" className="h-full w-full object-contain" />
          </Link>
          <div className="flex items-center justify-end gap-2 md:gap-6 md:pl-4">
            <div className="header-language flex items-center gap-1 text-[9px] font-semibold tracking-[.08em] md:text-[14px] md:tracking-[.08em]" dir="ltr" aria-label="Language selector" data-testid="button-language-toggle">
              <button onClick={() => setLang('ar')} className={`transition-opacity ${lang === 'ar' ? 'opacity-100' : 'opacity-45 hover:opacity-100'}`}>AR</button>
              <span className="opacity-35">|</span>
              <button onClick={() => setLang('en')} className={`transition-opacity ${lang === 'en' ? 'opacity-100' : 'opacity-45 hover:opacity-100'}`}>EN</button>
            </div>
            <Link href="/favorites" className="header-utility" aria-label={isAr ? 'المفضلة' : 'Favorites'} data-testid="link-header-favorites"><Heart size={18} strokeWidth={1.6} /></Link>
            <Link href="/account" className="header-utility" aria-label={isAr ? 'الحساب' : 'Account'} data-testid="link-header-account"><User size={18} strokeWidth={1.6} /></Link>
            <button onClick={() => setBagOpen(true)} className="header-utility relative flex items-center text-[12px] font-bold" aria-label={isAr ? 'شنطة الهدايا' : 'Gift bag'} data-testid="button-open-bag">
              <ShoppingBag size={19} strokeWidth={1.6} />
              {bagCount > 0 && <b className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F5F0E8] px-1 text-[9px] text-[#49372D]" data-testid="text-bag-count">{bagCount}</b>}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="ms-1 md:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>
        {menuOpen && (
          <div className="absolute left-0 right-0 top-full border-b border-[#F5F0E8]/15 bg-[#49372D] px-5 pb-7 pt-3 text-[#F5F0E8] md:hidden" data-testid="menu-mobile">
            <div className="flex flex-col gap-5">
              {nav.map((item, index) => <Link key={item} href={links[index]} onClick={() => setMenuOpen(false)} className={`text-2xl font-light ${isAr ? 'font-arabic' : 'font-display'}`} data-testid={`link-mobile-${links[index].slice(1)}`}>{item}</Link>)}
              <div className="mt-2 flex items-center gap-5 border-t border-current/15 pt-5">
                <Link href="/favorites" onClick={() => setMenuOpen(false)} aria-label={isAr ? 'المفضلة' : 'Favorites'}><Heart size={18} strokeWidth={1.3} /></Link>
                <Link href="/account" onClick={() => setMenuOpen(false)} aria-label={isAr ? 'الحساب' : 'Account'}><User size={18} strokeWidth={1.3} /></Link>
                <button onClick={() => { setMenuOpen(false); setBagOpen(true); }} aria-label={isAr ? 'شنطة الهدايا' : 'Gift bag'}><ShoppingBag size={18} strokeWidth={1.3} /></button>
              </div>
              <div className="flex w-fit items-center gap-2 text-xs font-semibold tracking-[.14em]" dir="ltr" data-testid="button-mobile-language">
                <button onClick={() => { setLang('ar'); setMenuOpen(false); }} className={lang === 'ar' ? 'opacity-100' : 'opacity-45'}>AR</button>
                <span className="opacity-35">|</span>
                <button onClick={() => { setLang('en'); setMenuOpen(false); }} className={lang === 'en' ? 'opacity-100' : 'opacity-45'}>EN</button>
              </div>
            </div>
          </div>
        )}
      </header>
      <div className="flex-1 w-full">
        {children}
      </div>
      <Footer lang={lang} />
    </div>
  );
}

function HeroVisual() {
  return (
    <figure className="hero-visual pointer-events-none absolute inset-0" aria-hidden="true">
      <img
        src={heroCampaignImage}
        alt=""
        className="h-full w-full object-cover object-center"
      />
    </figure>
  );
}

function Home({ lang, t, addToBag, toggleFavorite, favorites, setToast }: { lang: Lang; t: typeof copy.en; addToBag: (p: Product) => void; toggleFavorite: (id: string) => void; favorites: string[]; setToast: (message: string) => void }) {
  const isAr = lang === 'ar';
  return (
    <main className="w-full">
      <section className="relative isolate min-h-[760px] overflow-hidden bg-[#49372D] px-5 pb-20 pt-12 text-[#F5F0E8] md:min-h-[680px] md:px-10 md:pb-28 md:pt-16">
        <HeroVisual />
        <div className="relative z-10 mx-auto flex min-h-[620px] max-w-[1440px] items-start md:min-h-[536px] md:items-center">
          <div className="ml-auto flex w-full min-w-0 flex-col justify-center md:w-[52%]">
            <div className={`text-balance ${isAr ? 'font-arabic text-[clamp(2.65rem,4.15vw,4.65rem)] font-light leading-[1.42] tracking-normal' : 'font-display text-[clamp(3.25rem,5vw,6.25rem)] leading-[.98] tracking-[-.025em]'}`}>
              <div className="hero-reveal-1">{isAr ? copy.ar.heroLine1 : copy.en.heroLine1}</div>
              <div className="hero-reveal-2 mt-1 md:mt-2">{isAr ? copy.ar.heroLine2 : copy.en.heroLine2}</div>
              <div className={`hero-reveal-3 mt-12 text-[#CBB98B] md:mt-16 ${isAr ? 'text-[0.72em] font-normal leading-[1.5] tracking-normal' : 'text-[0.72em] italic leading-[1]'}`}>
                {isAr ? copy.ar.heroPayoff : copy.en.heroPayoff}
              </div>
            </div>
            
            <div className="hero-cta absolute -bottom-6 left-1/2 z-20 -translate-x-1/2 md:-bottom-8">
              <Link href="/shop" className="hero-cta-button group inline-flex w-max cursor-pointer items-center gap-5 rounded-[7px] border px-7 py-4">
                <span className={`${isAr ? 'font-arabic text-[17px] font-medium' : 'text-[12px] font-bold uppercase tracking-[.15em]'}`}>
                  {isAr ? copy.ar.heroCta : copy.en.heroCta}
                </span>
                {isAr ? (
                  <ArrowLeft size={17} strokeWidth={1.6} className="transition-transform duration-300 ease-out group-hover:-translate-x-1.5" />
                ) : (
                  <ArrowRight size={17} strokeWidth={1.6} className="transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
                )}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <EmotionalTransition />

      <GiftingCategories lang={lang} />

      <HowLanakWorks lang={lang} />

      <section className="featured-gifts bg-[#F5F0E8] px-5 py-20 text-[#49372D] md:px-10 md:py-32" id="featured-gifts">
        <div className="mx-auto max-w-[1440px]">
          <div className="featured-gifts-heading">
            <div>
              <p className={`featured-gifts-eyebrow ${isAr ? 'font-nav-ar' : ''}`}>{isAr ? 'اختيارات لأنّك' : 'The L’ANAK edit'}</p>
              <h2 className={isAr ? 'font-nav-ar' : 'font-display'}>{isAr ? 'إذا محتار، إحنا اخترنا لك.' : 'If you’re unsure, we chose for you.'}</h2>
            </div>
            <Link href="/shop" className="featured-gifts-cta group" data-testid="link-view-edit">
              <span className={isAr ? 'font-nav-ar' : ''}>{isAr ? 'شوف الكل' : 'View all'}</span>
              {isAr ? <ArrowLeft size={17} strokeWidth={1.4} /> : <ArrowRight size={17} strokeWidth={1.4} />}
            </Link>
          </div>
          <div className="featured-gifts-grid">
            {featuredGifts.map((product) => (
              <FeaturedGiftCard
                key={product.id}
                product={product}
                lang={lang}
                addToBag={addToBag}
                toggleFavorite={toggleFavorite}
                isFavorite={favorites.includes(product.id)}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 py-24 md:grid-cols-[1.15fr_.85fr] md:px-10 md:py-36">
        <div className="border-t border-[#49372D]/20 pt-8"><p className="mb-12 text-[10px] font-bold uppercase tracking-[.22em] opacity-60">{isAr ? 'الأشياء الصغيرة' : 'The little things'}</p><p className={`max-w-[800px] font-display text-4xl leading-[1.1] tracking-[-.02em] md:text-6xl lg:text-7xl ${isAr ? 'font-arabic leading-[1.2] font-light' : ''}`}>"{isAr ? 'الهدية مو بالشيء، الهدية بالإحساس اللي وراها.' : 'The gift is not the thing. It is the thought that arrives with it.'}"</p></div>
        <div className="flex flex-col justify-end border-t border-[#49372D]/20 pt-8"><p className={`mb-8 max-w-[330px] text-[15px] leading-relaxed opacity-70 ${isAr ? 'font-arabic' : ''}`}>{isAr ? 'لأن كل شخص تحبه يستحق طريقة خاصة تقول له: أنا شايفك.' : 'Because everyone you love deserves a particular way of hearing: I see you.'}</p><Link href="/how-it-works" className="group flex w-fit items-center gap-3 text-[12px] font-bold uppercase tracking-[.1em]">{isAr ? 'اعرف قصتنا' : 'Read our story'}<ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Link></div>
      </section>
      <Newsletter lang={lang} />
    </main>
  );
}

function EmotionalTransition() {
  return (
    <section className="emotional-transition" dir="rtl" aria-label="رسالة لأنّك">
      <p className="emotional-phrase emotional-phrase--one">لأنّك تستاهل.</p>
      <p className="emotional-phrase emotional-phrase--two">لأنّك على بالي.</p>
      <p className="emotional-phrase emotional-phrase--three">لأنّك أنت.</p>
    </section>
  );
}

function GiftingCategories({ lang }: { lang: Lang }) {
  const isAr = lang === 'ar';
  
  const cats = [
    { id: 'coffee', en: 'COFFEE', label: 'COFFEE IMAGE', ar: 'قهوة', path: '/coffee', classes: 'category-editorial--coffee' },
    { id: 'sweets', en: 'SWEETS', label: 'SWEETS IMAGE', ar: 'حلو', path: '/sweets', classes: 'category-editorial--sweets' },
    { id: 'restaurants', en: 'DINING', label: 'DINING IMAGE', ar: 'مطاعم', path: '/restaurants', classes: 'category-editorial--dining' },
    { id: 'flowers', en: 'FLOWERS', label: 'FLOWERS IMAGE', ar: 'ورد', path: '/flowers', classes: 'category-editorial--flowers' },
    { id: 'self-care', en: 'SELF-CARE', label: 'SELF-CARE IMAGE', ar: 'عناية', path: '/self-care', classes: 'category-editorial--care' },
    { id: 'gifts', en: 'GIFTS', label: 'GIFTS IMAGE', ar: 'هدايا', path: '/gifts', classes: 'category-editorial--gifts' },
  ];

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <section className="bg-[#F5F0E8] px-5 py-24 text-[#49372D] md:px-10 md:py-36" id="categories">
      <div className="mx-auto max-w-[1440px]">
        <div className={`mb-14 max-w-3xl md:mb-[4.5rem] ${isAr ? 'ml-auto text-right' : ''}`}>
          <h2 className={`text-balance ${isAr ? 'font-nav-ar text-[clamp(2.5rem,4vw,4.5rem)] font-medium leading-[1.28]' : 'font-display text-[clamp(3.5rem,5.5vw,5.5rem)] leading-[0.9] tracking-tight'}`}>
            {isAr ? 'منو ودّك تهدي اليوم؟' : 'WHO ARE YOU GIFTING TODAY?'}
          </h2>
          <p className={`mt-6 text-[15px] leading-8 opacity-70 md:text-[17px] ${isAr ? 'font-nav-ar font-normal' : ''}`}>
            {isAr ? 'اختار الفكرة، وخله يختار اللي يحبه.' : 'Choose the idea, and let them choose what they love.'}
          </p>
        </div>

        <div className="category-editorial-grid">
          {cats.map((cat) => (
            <Link key={cat.id} href={cat.path} className={`category-editorial group ${cat.classes}`} data-testid={`link-category-${cat.id}`}>
              <div className="category-editorial-image">
                <span>{cat.label}</span>
              </div>
              <div className="category-editorial-title">
                <h3 className={isAr ? 'font-nav-ar' : 'font-display tracking-[.08em]'}>{isAr ? cat.ar : cat.en}</h3>
                <ArrowIcon size={19} strokeWidth={1.3} className="category-editorial-arrow" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowLanakWorks({ lang }: { lang: Lang }) {
  const isAr = lang === 'ar';
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const steps = isAr
    ? [
        { number: '01', title: 'اختار', description: 'المكان أو التجربة اللي ودك تهديها.' },
        { number: '02', title: 'أهدِ', description: 'حدد القيمة، واكتب رسالتك.' },
        { number: '03', title: 'خلّه يختار', description: 'توصل له هديتك، ويختار اللي يحبه.' },
      ]
    : [
        { number: '01', title: 'Choose', description: 'Pick the place or experience you want to gift.' },
        { number: '02', title: 'Send', description: 'Set the value and write your message.' },
        { number: '03', title: 'Let them choose', description: 'Your gift arrives, and they choose what they love.' },
      ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`how-lanak-works ${isVisible ? 'is-visible' : ''}`}
      dir={isAr ? 'rtl' : 'ltr'}
      aria-labelledby="how-lanak-title"
    >
      <div className="mx-auto max-w-[1440px]">
        <header className="how-lanak-intro">
          <h2 id="how-lanak-title" className={isAr ? 'font-nav-ar' : 'font-display'}>
            {isAr ? 'أنت تهدي، وهو يختار.' : 'You gift. They choose.'}
          </h2>
          <p className={isAr ? 'font-nav-ar' : ''}>
            {isAr ? 'اختار المكان والقيمة، واكتب كلمتك… والباقي خله عليه.' : 'Choose the place and value, write your note… and leave the rest to them.'}
          </p>
        </header>

        <div className="how-lanak-steps">
          {steps.map((step, index) => (
            <article className="how-lanak-step" key={step.number} style={{ '--step-index': index } as React.CSSProperties}>
              <span className="how-lanak-number" aria-hidden="true">{step.number}</span>
              <div className="how-lanak-step-copy">
                <h3 className={isAr ? 'font-nav-ar' : 'font-display'}>{step.title}</h3>
                <p className={isAr ? 'font-nav-ar' : ''}>{step.description}</p>
              </div>
            </article>
          ))}
        </div>

        <Link href="/gift-now" className="how-lanak-link hero-cta-button group inline-flex w-max cursor-pointer items-center gap-5 rounded-[7px] border px-7 py-4">
          <span className={isAr ? 'font-nav-ar' : ''}>{isAr ? 'يلا نبدأ' : 'Start your gift'}</span>
          {isAr ? (
            <ArrowLeft size={17} strokeWidth={1.4} />
          ) : (
            <ArrowRight size={17} strokeWidth={1.4} />
          )}
        </Link>
      </div>
    </section>
  );
}

function CategoryPlaceholder({ lang, title, titleAr }: { lang: Lang; title: string; titleAr: string }) {
  const isAr = lang === 'ar';
  return (
    <main className="w-full flex-1 flex items-center justify-center min-h-[60vh] bg-[#FAF7F0] px-5 py-24 text-[#49372D]">
      <div className="text-center max-w-xl mx-auto">
        <h1 className={`mb-6 ${isAr ? 'font-arabic text-5xl font-light leading-[1.3]' : 'font-display text-7xl leading-[0.9] tracking-[-.02em]'}`}>
          {isAr ? titleAr : title}
        </h1>
        <p className={`text-sm opacity-60 ${isAr ? 'font-arabic' : ''}`}>
          {isAr ? 'قريباً...' : 'Category page coming soon...'}
        </p>
        <Link href="/" className="mt-12 inline-flex items-center gap-2 border-b border-[#49372D]/40 pb-1 text-xs font-semibold uppercase tracking-[.1em] transition-colors hover:border-[#49372D]">
          {isAr ? 'العودة للرئيسية' : 'BACK TO HOME'}
        </Link>
      </div>
    </main>
  );
}

function NavigationPlaceholder({ lang, title, titleAr }: { lang: Lang; title: string; titleAr: string }) {
  const isAr = lang === 'ar';
  return (
    <main className="min-h-[65vh] bg-[#FAF7F0] px-5 py-20 text-[#49372D] md:px-10 md:py-28">
      <div className="mx-auto max-w-[1440px] border-t border-[#49372D]/20 pt-8">
        <h1 className={`text-6xl font-light md:text-8xl ${isAr ? 'font-arabic leading-[1.15]' : 'font-display'}`}>{isAr ? titleAr : title}</h1>
        <p className={`mt-6 text-sm opacity-60 ${isAr ? 'font-arabic' : ''}`}>{isAr ? 'قريباً.' : 'Coming soon.'}</p>
      </div>
    </main>
  );
}

function ProductTile({ product, dark = false, lang, index, addToBag, toggleFavorite, isFavorite }: { product: Product; dark?: boolean; lang: Lang; index: number; addToBag: (p: Product) => void; toggleFavorite: (id: string) => void; isFavorite: boolean }) {
  const isAr = lang === 'ar';
  return <div className={`group ${dark ? 'text-[#FAF7F0]' : 'text-[#49372D]'}`} data-testid={`card-product-${product.id}`}>
    <div className={`relative mb-4 flex aspect-[.88] items-center justify-center overflow-hidden border ${dark ? 'border-[#FAF7F0]/20 bg-[#5b463a]' : 'border-[#49372D]/20 bg-[#E8D59E]'}`}>
      <span className="absolute left-3 top-3 text-[9px] font-bold opacity-55">{product.mark}</span>
      <button onClick={() => toggleFavorite(product.id)} className="absolute right-3 top-3 z-10" aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'} data-testid={`button-favorite-${product.id}`}><Heart size={17} strokeWidth={1.4} fill={isFavorite ? 'currentColor' : 'none'} /></button>
      <div className="flex h-[52%] w-[52%] flex-col items-center justify-center border border-current/40 bg-[#FAF7F0] text-[#49372D] transition-transform duration-500 group-hover:rotate-[-4deg] group-hover:scale-105"><span className="font-display text-3xl tracking-[-.08em]">L’</span><span className="mt-2 text-[7px] uppercase tracking-[.2em]">feeling inside</span></div>
      <button onClick={() => addToBag(product)} className="absolute bottom-3 left-3 right-3 flex translate-y-2 items-center justify-between bg-[#49372D] px-3 py-3 text-[10px] font-bold text-[#FAF7F0] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" data-testid={`button-add-${product.id}`}>{isAr ? 'أضف للشنطة' : 'Add to bag'}<Plus size={14} /></button>
    </div>
    <div className="flex items-start justify-between gap-3"><div><h3 className={`text-[13px] font-bold ${isAr ? 'font-arabic' : ''}`}>{isAr ? product.ar : product.name}</h3><p className={`mt-1 text-[11px] opacity-55 ${isAr ? 'font-arabic' : ''}`}>{isAr ? product.name : product.note}</p></div><span className="text-[12px] font-bold">{product.price} KD</span></div>
  </div>;
}

function FeaturedGiftCard({ product, lang, addToBag, toggleFavorite, isFavorite }: {
  product: Product & { categoryAr: string; categoryEn: string; placeholder: string };
  lang: Lang;
  addToBag: (product: Product) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: boolean;
}) {
  const isAr = lang === 'ar';
  return (
    <article
      className="featured-gift-card group"
      onClick={() => addToBag(product)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') addToBag(product);
      }}
      role="button"
      tabIndex={0}
      data-testid={`card-featured-${product.id}`}
    >
      <div className="featured-gift-image">
        <span className="featured-gift-number">{product.mark}</span>
        <button
          onClick={(event) => {
            event.stopPropagation();
            toggleFavorite(product.id);
          }}
          className={`featured-gift-heart ${isFavorite ? 'is-favorite' : ''}`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          data-testid={`button-favorite-${product.id}`}
        >
          <Heart size={19} strokeWidth={1.4} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
        <span className="featured-gift-placeholder">{product.placeholder}</span>
      </div>
      <div className="featured-gift-copy">
        <div>
          <span className={`featured-gift-category ${isAr ? 'font-nav-ar' : ''}`}>{isAr ? product.categoryAr : product.categoryEn}</span>
          <h3 className={isAr ? 'font-nav-ar' : 'font-display'}>{isAr ? product.ar : product.name}</h3>
        </div>
        <span className="featured-gift-price">KD {product.price}</span>
      </div>
    </article>
  );
}

function Shop({ lang, addToBag, toggleFavorite, favorites }: { lang: Lang; addToBag: (p: Product) => void; toggleFavorite: (id: string) => void; favorites: string[] }) {
  const isAr = lang === 'ar';
  const [active, setActive] = useState('all');
  const [search, setSearch] = useState('');
  const [feelingIndex, setFeelingIndex] = useState(0);
  const categories = isAr ? [['all', 'الكل'], ['care', 'أهتم فيك'], ['celebrate', 'نحتفل'], ['coffee', 'قهوة'], ['thanks', 'شكراً']] : [['all', 'All gifts'], ['care', 'Take care'], ['celebrate', 'Celebrate'], ['coffee', 'Coffee'], ['thanks', 'Say thanks']];
  const filtered = useMemo(() => products.filter((p) => (active === 'all' || p.category === active) && (`${p.name} ${p.note} ${p.ar}`).toLowerCase().includes(search.toLowerCase())), [active, search]);
  const prompts = isAr ? ['أبي أقول له: أنا معاك', 'أبي أفرحهم', 'أبي أذكرهم فيني', 'أبي أقول شكراً'] : ['I want to say: I’ve got you', 'I want to make their day', 'I want to remind them of me', 'I want to say thank you'];
  return <main className="mx-auto max-w-[1440px] px-5 pb-28 md:px-10">
    <section className="border-b border-[#49372D]/25 pb-12 pt-10 md:pb-20 md:pt-20"><p className="mb-5 text-[10px] font-bold uppercase tracking-[.22em] opacity-55">{isAr ? 'اختار الإحساس' : 'Choose the feeling'}</p><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><h1 className={`max-w-[750px] font-display text-6xl leading-[.86] tracking-[-.05em] md:text-9xl ${isAr ? 'font-arabic leading-[1.08]' : ''}`} data-testid="text-shop-title">{isAr ? 'خلّ الهدية تبدأ منك.' : 'Let the gift start\\nwith you.'}</h1><div className="flex w-full items-center border-b border-[#49372D] pb-2 md:w-[240px]"><Search size={16} className="mr-3 opacity-55" /><input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent text-sm outline-none placeholder:text-[#49372D]/50" placeholder={isAr ? 'دور على شيء' : 'Search a feeling'} data-testid="input-search-gifts" /></div></div></section>
    <section className="grid grid-cols-1 gap-8 border-b border-[#49372D]/25 py-8 md:grid-cols-[1fr_2fr] md:py-12"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] opacity-55">{isAr ? 'اقتراح اليوم' : 'A little prompt'}</p><p className={`mt-3 font-display text-3xl leading-none ${isAr ? 'font-arabic leading-[1.2]' : ''}`} data-testid="text-changing-recommendation">{prompts[feelingIndex]}</p><button onClick={() => setFeelingIndex((i) => (i + 1) % prompts.length)} className="line-draw mt-5 flex items-center gap-2 text-[11px] font-bold" data-testid="button-change-recommendation"><RotateCcw size={13} />{isAr ? 'غير الاقتراح' : 'Change the feeling'}</button></div><div className="flex flex-wrap content-start gap-x-6 gap-y-3 md:justify-end">{categories.map(([id, label]) => <button key={id} onClick={() => setActive(id)} className={`border-b pb-1 text-[12px] font-bold transition-opacity ${active === id ? 'border-[#49372D] opacity-100' : 'border-transparent opacity-45 hover:opacity-100'}`} data-testid={`button-category-${id}`}>{label}</button>)}</div></section>
    {filtered.length ? <section className="grid grid-cols-2 gap-x-4 gap-y-14 py-12 md:grid-cols-3 md:gap-x-8 md:gap-y-20">{filtered.map((product, index) => <ProductTile key={product.id} product={product} lang={lang} index={index} addToBag={addToBag} toggleFavorite={toggleFavorite} isFavorite={favorites.includes(product.id)} />)}</section> : <div className="border-b border-[#49372D]/25 py-28 text-center"><p className="font-display text-5xl">{isAr ? 'ما لقينا هذا الإحساس.' : 'That feeling is hiding.'}</p><button onClick={() => { setSearch(''); setActive('all'); }} className="line-draw mt-6 text-sm font-bold" data-testid="button-reset-shop">{isAr ? 'رجعني لكل الهدايا' : 'Take me back to all gifts'}</button></div>}
    <section className="grid grid-cols-1 gap-6 border-t border-[#49372D]/25 pt-8 md:grid-cols-2"><Link href="/gift-cards" className="group flex min-h-[250px] flex-col justify-between bg-[#E8D59E] p-7" data-testid="link-shop-gift-card"><span className="flex justify-between text-[10px] font-bold uppercase tracking-[.18em]"><Gift size={18} strokeWidth={1.3} /><ArrowUpRight size={18} /></span><span className={`font-display text-4xl leading-[.9] ${isAr ? 'font-arabic leading-[1.15]' : ''}`}>{isAr ? 'مو عارف شنو يحب؟\\nخله يختار.' : 'Not sure what they want?\\nLet them choose.'}</span></Link><Link href="/gift-cards" className="group flex min-h-[250px] flex-col justify-between border border-[#49372D]/25 p-7" data-testid="link-shop-coffee-card"><span className="flex justify-between text-[10px] font-bold uppercase tracking-[.18em]"><Coffee size={18} strokeWidth={1.3} /><ArrowUpRight size={18} /></span><span className={`font-display text-4xl leading-[.9] ${isAr ? 'font-arabic leading-[1.15]' : ''}`}>{isAr ? 'قهوة؟\\nالقهوة علي.' : 'Coffee?\\nIt’s on me.'}</span></Link></section>
  </main>;
}

function GiftCards({ lang, setToast }: { lang: Lang; setToast: (message: string) => void }) {
  const isAr = lang === 'ar';
  const [kind, setKind] = useState<'gift' | 'coffee'>('gift');
  const [amount, setAmount] = useState('25');
  const [custom, setCustom] = useState('');
  const [sent, setSent] = useState(false);
  const actualAmount = custom || amount;
  return <main className="mx-auto max-w-[1440px] px-5 pb-28 md:px-10">
    <section className="grid grid-cols-1 gap-10 border-b border-[#49372D]/25 py-12 md:grid-cols-[1.1fr_.9fr] md:py-20"><div><p className="mb-5 text-[10px] font-bold uppercase tracking-[.22em] opacity-55">{isAr ? 'بطاقات الهدايا' : 'Gift cards, made personal'}</p><h1 className={`max-w-[780px] font-display text-6xl leading-[.85] tracking-[-.05em] md:text-9xl ${isAr ? 'font-arabic leading-[1.08]' : ''}`} data-testid="text-gift-card-title">{isAr ? 'أعطهم\\nمساحة يختارونها.' : 'Give them\\nroom to choose.'}</h1></div><div className="flex flex-col justify-end"><p className={`max-w-[380px] text-[15px] leading-7 opacity-75 ${isAr ? 'font-arabic' : ''}`}>{isAr ? 'بطاقة تقول لهم إنك تعرف ذوقهم، حتى لو ما تعرف شنو يختارون اليوم.' : 'A card that says you know their taste, even when you don’t know what they want today.'}</p></div></section>
    <section className="grid grid-cols-1 gap-12 py-14 md:grid-cols-[.9fr_1.1fr] md:py-20"><div className="flex flex-col gap-3"><button onClick={() => setKind('gift')} className={`flex items-center justify-between border-b pb-5 text-left text-2xl ${kind === 'gift' ? 'border-[#49372D]' : 'border-[#49372D]/20 opacity-45'}`} data-testid="button-gift-card-type"><span className={isAr ? 'font-arabic' : 'font-display'}>{isAr ? 'بطاقة لَـنَك' : 'L’ANAK gift card'}</span><Gift size={22} strokeWidth={1.3} /></button><button onClick={() => setKind('coffee')} className={`flex items-center justify-between border-b pb-5 text-left text-2xl ${kind === 'coffee' ? 'border-[#49372D]' : 'border-[#49372D]/20 opacity-45'}`} data-testid="button-coffee-card-type"><span className={isAr ? 'font-arabic' : 'font-display'}>{isAr ? 'قهوة على حسابي' : 'Coffee voucher'}</span><Coffee size={22} strokeWidth={1.3} /></button><div className="mt-9 border border-[#49372D]/20 bg-[#E8D59E] p-7"><p className="mb-8 text-[10px] font-bold uppercase tracking-[.18em]">{kind === 'gift' ? (isAr ? 'بطاقة لذوقهم' : 'A card for their taste') : (isAr ? 'كوب يستاهلونه' : 'A cup they deserve')}</p><div className="flex items-end justify-between"><span className="font-display text-7xl leading-none">{actualAmount}<small className="ml-2 text-xl">KD</small></span><span className="text-[10px] font-bold uppercase tracking-[.15em]">L’ANAK / 2025</span></div></div></div>
      <div className="border-t border-[#49372D]/25 pt-5"><p className="mb-8 text-[10px] font-bold uppercase tracking-[.18em] opacity-55">{isAr ? 'اختار القيمة' : 'Choose an amount'}</p><div className="flex flex-wrap gap-2">{['15', '25', '40', '60'].map((value) => <button key={value} onClick={() => { setAmount(value); setCustom(''); }} className={`border px-5 py-3 text-sm font-bold ${amount === value && !custom ? 'bg-[#49372D] text-[#FAF7F0]' : 'border-[#49372D]/25'}`} data-testid={`button-amount-${value}`}>{value} KD</button>)}<label className="flex items-center border border-[#49372D]/25 px-4"><input value={custom} onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ''))} className="w-20 bg-transparent text-sm outline-none" placeholder={isAr ? 'مبلغ آخر' : 'Custom'} inputMode="numeric" data-testid="input-custom-amount" /><span className="text-sm font-bold">KD</span></label></div><div className="mt-12 grid gap-7 sm:grid-cols-2"><label className="text-[10px] font-bold uppercase tracking-[.15em]">{isAr ? 'إلى' : 'Send to'}<input className="mt-3 w-full border-b border-[#49372D]/30 bg-transparent py-3 text-sm outline-none" placeholder={isAr ? 'اسم الشخص' : 'Their name'} data-testid="input-recipient-name" /></label><label className="text-[10px] font-bold uppercase tracking-[.15em]">{isAr ? 'رقمهم' : 'Their number'}<input className="mt-3 w-full border-b border-[#49372D]/30 bg-transparent py-3 text-sm outline-none" placeholder="+965" data-testid="input-recipient-phone" /></label></div><label className="mt-8 block text-[10px] font-bold uppercase tracking-[.15em]">{isAr ? 'رسالة صغيرة' : 'A little note'}<textarea className="mt-3 h-24 w-full resize-none border-b border-[#49372D]/30 bg-transparent py-3 text-sm outline-none" placeholder={isAr ? 'اكتب لهم من قلبك' : 'Write from the heart'} data-testid="textarea-gift-note" /></label><button onClick={() => { setSent(true); setToast(isAr ? 'بطاقتك جاهزة للإرسال' : 'Your card is ready to send'); }} className="pressable mt-10 flex items-center gap-3 bg-[#49372D] px-7 py-4 text-[12px] font-bold text-[#FAF7F0]" data-testid="button-send-gift-card">{sent ? <><Check size={16} />{isAr ? 'جاهز للإرسال' : 'Ready to send'}</> : <>{isAr ? 'أرسل البطاقة' : 'Send this card'}<Send size={16} /></>}</button></div></section>
    <div className="border-t border-[#49372D]/25 pt-6 text-[11px] opacity-60"><span>{isAr ? 'توصلكم البطاقة فوراً برسالة نصية. صالحة لمدة سنة.' : 'Delivered instantly by text. Valid for one year.'}</span></div>
  </main>;
}

function HowItWorks({ lang }: { lang: Lang }) {
  const isAr = lang === 'ar';
  const steps = isAr ? [{ n: '١', t: 'اختار الإحساس', b: 'فكر في اللي تبيه يوصل، مو اللي تبيه ينشرى.' }, { n: '٢', t: 'أرسلها لهم', b: 'أضف اسمهم ورسالتك. نوصلها خلال لحظات.' }, { n: '٣', t: 'هم يختارون', b: 'يفتحون هديتهم ويختارون الشيء اللي يحبونه.' }] : [{ n: '01', t: 'Choose the feeling', b: 'Think about what you want to say, not what you want to buy.' }, { n: '02', t: 'Send it their way', b: 'Add their name and your note. We deliver it in moments.' }, { n: '03', t: 'They choose', b: 'They open their gift and pick the thing that feels like them.' }];
  return <main><section className="mx-auto max-w-[1440px] px-5 pb-20 pt-12 md:px-10 md:pb-32 md:pt-20"><p className="mb-6 text-[10px] font-bold uppercase tracking-[.22em] opacity-55">{isAr ? 'طريقة مختلفة للهدايا' : 'A different kind of gifting'}</p><h1 className={`max-w-[1000px] font-display text-7xl leading-[.82] tracking-[-.055em] md:text-[10rem] ${isAr ? 'font-arabic leading-[1.05]' : ''}`} data-testid="text-how-title">{isAr ? 'الإحساس أولاً.\\nدائماً.' : 'The feeling\\ncomes first.'}</h1><div className="mt-16 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[.16em]"><ArrowDown size={16} />{isAr ? 'ثلاث خطوات بسيطة' : 'Three simple steps'}</div></section><section className="border-y border-[#49372D]/20 bg-[#E8D59E]"><div className="mx-auto grid max-w-[1440px] grid-cols-1 md:grid-cols-3">{steps.map((step, index) => <div key={step.n} className={`min-h-[360px] border-b border-[#49372D]/25 p-7 md:border-b-0 md:border-r md:p-10 ${index === steps.length - 1 ? 'md:border-r-0' : ''}`} data-testid={`card-step-${index}`}><span className="font-display text-6xl">{step.n}</span><div className="mt-24"><h2 className={`font-display text-4xl leading-none ${isAr ? 'font-arabic leading-[1.15]' : ''}`}>{step.t}</h2><p className={`mt-4 max-w-[250px] text-sm leading-6 opacity-75 ${isAr ? 'font-arabic' : ''}`}>{step.b}</p></div></div>)}</div></section><section className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-5 py-24 md:grid-cols-[1fr_1fr] md:px-10 md:py-36"><div className="flex min-h-[420px] items-center justify-center border border-[#49372D]/25 bg-[#49372D] text-center text-[#FAF7F0]" data-testid="visual-how-placeholder"><div><div className="mx-auto mb-8 flex h-28 w-24 rotate-[7deg] items-center justify-center border border-[#FAF7F0]/60"><span className="font-display text-4xl">L’</span></div><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#E8D59E]">packaging visual / arriving soon</p></div></div><div className="flex flex-col justify-center"><p className="mb-5 text-[10px] font-bold uppercase tracking-[.2em] opacity-55">{isAr ? 'ليش لَـنَك؟' : 'Why L’ANAK?'}</p><h2 className={`font-display text-6xl leading-[.87] tracking-[-.04em] md:text-8xl ${isAr ? 'font-arabic leading-[1.1]' : ''}`}>{isAr ? 'لأنك تعرفهم،\\nحتى لو ما تعرف\\nشنو يبون.' : 'Because you know them,\\neven when you don’t\\nknow what they want.'}</h2><Link href="/shop" className="line-draw mt-10 flex w-fit items-center gap-3 text-xs font-bold" data-testid="link-how-shop">{isAr ? 'ابدأ هدية' : 'Start a gift'}<ArrowUpRight size={16} /></Link></div></section></main>;
}

function About({ lang }: { lang: Lang }) {
  const isAr = lang === 'ar';
  return <main><section className="mx-auto max-w-[1440px] px-5 pb-20 pt-12 md:px-10 md:pb-32 md:pt-20"><p className="mb-6 text-[10px] font-bold uppercase tracking-[.22em] opacity-55">{isAr ? 'عن لَـنَك' : 'A note from L’ANAK'}</p><h1 className={`max-w-[1040px] font-display text-7xl leading-[.82] tracking-[-.055em] md:text-[10rem] ${isAr ? 'font-arabic leading-[1.05]' : ''}`} data-testid="text-about-title">{isAr ? 'الهدايا مو\\nأشياء.' : 'Gifting is not\\nabout things.'}</h1></section><section className="border-y border-[#49372D]/20 bg-[#49372D] text-[#FAF7F0]"><div className="mx-auto grid max-w-[1440px] grid-cols-1 md:grid-cols-[.8fr_1.2fr]"><div className="border-b border-[#FAF7F0]/20 p-7 md:border-b-0 md:border-r md:p-12"><span className="text-[10px] font-bold uppercase tracking-[.2em] text-[#E8D59E]">KWT / L’ANAK</span><p className="mt-40 text-[10px] uppercase tracking-[.16em] opacity-60">{isAr ? 'من الكويت، بحب' : 'From Kuwait, with feeling'}</p></div><div className="p-7 md:p-16"><p className={`max-w-[750px] font-display text-5xl leading-[.93] tracking-[-.03em] md:text-8xl ${isAr ? 'font-arabic leading-[1.1]' : ''}`}>"{isAr ? 'نؤمن إن أجمل الهدايا هي اللي تخلي الشخص يحس إنك تعرفه.' : 'We believe the best gifts are the ones that make someone feel known.'}"</p><p className={`mt-14 max-w-[470px] text-sm leading-7 opacity-70 ${isAr ? 'font-arabic' : ''}`}>{isAr ? 'لَـنَك بدأت من سؤال بسيط: ليش لازم تعرف شنو يبي الشخص عشان تهديه؟ أحياناً كل اللي يحتاجه هو إحساس صادق، ومساحة يختار فيها بنفسه.' : 'L’ANAK started with a simple question: why do you have to know exactly what someone wants to give them something good? Sometimes all they need is a true feeling, and room to choose for themselves.'}</p></div></div></section><section className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 py-24 md:grid-cols-[1fr_1fr] md:px-10 md:py-36"><div><p className="mb-5 text-[10px] font-bold uppercase tracking-[.2em] opacity-55">{isAr ? 'من الكويت' : 'Made for here'}</p><h2 className={`font-display text-6xl leading-[.88] tracking-[-.04em] md:text-8xl ${isAr ? 'font-arabic leading-[1.1]' : ''}`}>{isAr ? 'كل بيت له\\nطريقته في الحب.' : 'Every home has\\nits own language\\nof love.'}</h2></div><div className="flex items-end"><p className={`max-w-[390px] text-sm leading-7 opacity-75 ${isAr ? 'font-arabic' : ''}`}>{isAr ? 'نصمم لحظات تناسبنا: رسالة واتساب، قهوة على الطريق، وهدية توصل بوقتها. أشياء بسيطة، لكن معناها كبير.' : 'We make room for the ways we show up here: a WhatsApp note, coffee on the way, a gift that arrives exactly when it should. Small gestures, big meaning.'}</p></div></section><Newsletter lang={lang} /></main>;
}

function Newsletter({ lang }: { lang: Lang }) {
  const isAr = lang === 'ar';
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  return <section className="border-t border-[#49372D]/20 bg-[#E8D59E] px-5 py-16 md:px-10 md:py-24"><div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 md:grid-cols-[1fr_1fr]"><div><p className="text-[10px] font-bold uppercase tracking-[.2em]">{isAr ? 'رسائل تستاهل توصلك' : 'Notes worth receiving'}</p><h2 className={`mt-5 max-w-[550px] font-display text-5xl leading-[.88] tracking-[-.04em] md:text-7xl ${isAr ? 'font-arabic leading-[1.1]' : ''}`}>{isAr ? 'أشياء جميلة،\\nمرة بالشهر.' : 'Good things,\\nonce a month.'}</h2></div><div className="flex flex-col justify-end"><p className={`mb-6 max-w-[330px] text-sm leading-6 opacity-75 ${isAr ? 'font-arabic' : ''}`}>{isAr ? 'أفكار هدايا، كلمات حلوة، وأشياء من الكويت.' : 'Gift ideas, kind words, and good things from Kuwait.'}</p>{joined ? <div className="flex items-center gap-2 border-b border-[#49372D] pb-3 text-sm font-bold" data-testid="status-newsletter-joined"><Check size={16} />{isAr ? 'وصلت!' : 'You’re on the list.'}</div> : <form onSubmit={(e) => { e.preventDefault(); if (email) setJoined(true); }} className="flex max-w-[420px] border-b border-[#49372D] pb-3"><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full bg-transparent text-sm outline-none placeholder:text-[#49372D]/55" placeholder={isAr ? 'إيميلك' : 'Your email'} data-testid="input-newsletter-email" /><button type="submit" className="text-xs font-bold" data-testid="button-newsletter-submit">{isAr ? 'سجلني' : 'Sign me up'} <ArrowUpRight size={14} className="inline" /></button></form>}</div></div></section>;
}

function BagDrawer({ lang, bag, setBag, setBagOpen, setToast }: { lang: Lang; bag: Product[]; setBag: (items: Product[]) => void; setBagOpen: (open: boolean) => void; setToast: (message: string) => void }) {
  const isAr = lang === 'ar';
  const total = bag.reduce((sum, item) => sum + item.price, 0);
  return <div className="fixed inset-0 z-50 flex justify-end bg-[#49372D]/30" onClick={() => setBagOpen(false)} data-testid="drawer-backdrop"><aside className="h-full w-full max-w-[440px] overflow-y-auto bg-[#FAF7F0] p-6 text-[#49372D] md:p-9" onClick={(e) => e.stopPropagation()} data-testid="drawer-gift-bag"><div className="flex items-center justify-between border-b border-[#49372D]/25 pb-5"><h2 className={`font-display text-4xl ${isAr ? 'font-arabic' : ''}`}>{isAr ? 'شنطتي' : 'Your gift bag'}</h2><button onClick={() => setBagOpen(false)} data-testid="button-close-bag"><X size={21} /></button></div>{bag.length === 0 ? <div className="flex min-h-[60vh] flex-col items-center justify-center text-center"><ShoppingBag size={30} strokeWidth={1.2} /><p className={`mt-6 font-display text-3xl ${isAr ? 'font-arabic' : ''}`}>{isAr ? 'الشنطة فاضية.' : 'It’s quiet in here.'}</p><p className={`mt-3 max-w-[220px] text-xs leading-5 opacity-60 ${isAr ? 'font-arabic' : ''}`}>{isAr ? 'اختار إحساس وخله يوصل.' : 'Choose a feeling and let it travel.'}</p><Link href="/shop" onClick={() => setBagOpen(false)} className="line-draw mt-8 text-xs font-bold" data-testid="link-empty-bag-shop">{isAr ? 'تصفح الهدايا' : 'Browse gifts'}</Link></div> : <><div className="divide-y divide-[#49372D]/15">{bag.map((item, index) => <div className="flex gap-4 py-5" key={`${item.id}-${index}`} data-testid={`row-bag-item-${index}`}><div className="flex h-20 w-16 items-center justify-center bg-[#E8D59E]"><span className="font-display text-2xl">L’</span></div><div className="flex flex-1 items-start justify-between"><div><p className="text-sm font-bold">{isAr ? item.ar : item.name}</p><p className="mt-1 text-[11px] opacity-55">{item.price} KD</p></div><button onClick={() => setBag(bag.filter((_, i) => i !== index))} className="text-[11px] underline opacity-60" data-testid={`button-remove-bag-${index}`}>{isAr ? 'حذف' : 'Remove'}</button></div></div>)}</div><div className="mt-10 border-t border-[#49372D]/25 pt-5"><div className="flex justify-between text-sm font-bold"><span>{isAr ? 'المجموع' : 'Total'}</span><span>{total} KD</span></div><button onClick={() => { setToast(isAr ? 'قريباً — بنكمّلها معاك' : 'Almost there — checkout is coming soon'); }} className="mt-5 flex w-full items-center justify-center gap-3 bg-[#49372D] py-4 text-xs font-bold text-[#FAF7F0]" data-testid="button-bag-checkout">{isAr ? 'كمل الهدية' : 'Continue the gift'}<ArrowUpRight size={15} /></button><p className="mt-4 text-center text-[10px] opacity-50">{isAr ? 'الدفع والتوصيل قريباً — هذه تجربة أولى' : 'Checkout and delivery coming soon — this is a first look'}</p></div></>}</aside></div>;
}

function Footer({ lang }: { lang: Lang }) {
  const isAr = lang === 'ar';
  return <footer className="border-t border-[#49372D]/20 px-5 py-10 md:px-10"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-10 md:flex-row md:items-end"><div><Link href="/" className="font-display text-5xl tracking-[-.05em]" data-testid="link-footer-logo">L’ANAK</Link><p className="mt-3 text-[10px] uppercase tracking-[.16em] opacity-55">{isAr ? 'هدايا فيها شعور' : 'gifts with feeling'}</p></div><div className="grid grid-cols-2 gap-x-12 gap-y-3 text-[11px] font-bold md:grid-cols-3"><Link href="/shop" className="line-draw" data-testid="link-footer-shop">{isAr ? 'المتجر' : 'Shop'}</Link><Link href="/gift-cards" className="line-draw" data-testid="link-footer-cards">{isAr ? 'البطاقات' : 'Gift cards'}</Link><Link href="/how-it-works" className="line-draw" data-testid="link-footer-how">{isAr ? 'كيف تعمل' : 'How it works'}</Link><Link href="/about" className="line-draw" data-testid="link-footer-about">{isAr ? 'عن لَـنَك' : 'About'}</Link><button className="line-draw text-left" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} data-testid="button-back-top">{isAr ? 'فوق' : 'Back to top'} ↑</button><span className="opacity-45">Kuwait City, KWT</span></div></div><div className="mx-auto mt-14 flex max-w-[1440px] justify-between text-[9px] font-bold uppercase tracking-[.16em] opacity-45"><span>© L’ANAK 2025</span><span>{isAr ? 'صُنع بحب' : 'made with feeling'}</span></div></footer>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

export default App;
