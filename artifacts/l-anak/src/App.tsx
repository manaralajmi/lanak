import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { ArrowUpRight, Check, Coffee, Gift, Heart, Menu, Plus, Send, ShoppingBag, User, X, ArrowLeft, ArrowRight } from 'lucide-react';
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
type GiftFlowState = {
  step: number;
  selectedCategory: string | null;
  selectedPartner: string | null;
  selectedValue: number | null;
  recipientInformation: { name: string; phone: string; deliveryDate: string; deliveryMethod: string };
  personalMessage: string;
};
type FeaturedGift = Product & {
  categoryAr: string;
  categoryEn: string;
  image: string;
  imageAlt: string;
  imagePosition: string;
};

const products: Product[] = [
  { id: 'morning', name: 'A softer morning', ar: 'صباح أهدأ', note: 'For the one who needs a little quiet.', price: 18, category: 'care', mark: '01' },
  { id: 'kitchen', name: 'The kitchen table', ar: 'سفرة البيت', note: 'A little something to gather around.', price: 24, category: 'home', mark: '02' },
  { id: 'thankyou', name: 'Just, thank you', ar: 'شكراً، وبس', note: 'No occasion needed.', price: 12, category: 'thanks', mark: '03' },
  { id: 'thinking', name: 'I was thinking of you', ar: 'كنت أفكر فيك', note: 'A small reminder, right on time.', price: 16, category: 'thinking', mark: '04' },
  { id: 'celebrate', name: 'Make a little noise', ar: 'خلّنا نحتفل', note: 'For the good news and the good days.', price: 31, category: 'celebrate', mark: '05' },
  { id: 'coffee', name: 'Coffee, on me', ar: 'القهوة علي', note: 'A warm cup from wherever they are.', price: 5, category: 'coffee', mark: '06' },
];

const featuredGifts: FeaturedGift[] = [
  { id: 'featured-coffee', name: 'Coffee is on me', ar: 'قهوتك علي', note: '', price: 5, category: 'coffee', categoryAr: 'قهوة', categoryEn: 'Coffee', image: heroCampaignImage, imageAlt: 'L’ANAK coffee gift presentation', imagePosition: '32% 74%', mark: '01' },
  { id: 'featured-care', name: 'Treat yourself today', ar: 'دلّعي نفسج اليوم', note: '', price: 20, category: 'care', categoryAr: 'عناية', categoryEn: 'Self-Care', image: heroCampaignImage, imageAlt: 'L’ANAK self-care gift with fresh flowers', imagePosition: '25% 52%', mark: '02' },
  { id: 'featured-sweets', name: 'Sweets are on me', ar: 'الحلو علي', note: '', price: 10, category: 'sweets', categoryAr: 'حلو', categoryEn: 'Sweets', image: heroCampaignImage, imageAlt: 'L’ANAK wrapped sweets gift', imagePosition: '53% 74%', mark: '03' },
  { id: 'featured-dining', name: 'Dinner is on me', ar: 'عشا اليوم علي', note: '', price: 25, category: 'dining', categoryAr: 'مطاعم', categoryEn: 'Dining', image: heroCampaignImage, imageAlt: 'L’ANAK premium dining gift presentation', imagePosition: '82% 56%', mark: '04' },
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
  const [toast, setToast] = useState('');
  const [giftFlow, setGiftFlow] = useState<GiftFlowState>({
    step: 1,
    selectedCategory: null,
    selectedPartner: null,
    selectedValue: null,
    recipientInformation: { name: '', phone: '', deliveryDate: '', deliveryMethod: '' },
    personalMessage: '',
  });
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
  const selectGiftCategory = (selectedCategory: string) => {
    setGiftFlow((current) => ({ ...current, step: 1, selectedCategory }));
  };
  const continueGiftFlow = () => {
    setGiftFlow((current) => current.selectedCategory ? { ...current, step: 2 } : current);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <SiteShell lang={lang} setLang={setLang} menuOpen={menuOpen} setMenuOpen={setMenuOpen} bagCount={bag.length} isAr={isAr}>
            <RoutedErrorBoundary>
              <Switch>
                <Route path="/"><Home lang={lang} t={t} addToBag={addToBag} toggleFavorite={toggleFavorite} favorites={favorites} giftFlow={giftFlow} selectGiftCategory={selectGiftCategory} continueGiftFlow={continueGiftFlow} /></Route>
                <Route path="/gift"><GiftEntryRedirect /></Route>
                <Route path="/picks"><Picks lang={lang} addToBag={addToBag} toggleFavorite={toggleFavorite} favorites={favorites} /></Route>
                <Route path="/about"><About lang={lang} /></Route>
                <Route path="/gift-card"><GiftCards lang={lang} setToast={setToast} /></Route>
                <Route path="/favorites"><Favorites lang={lang} favorites={favorites} addToBag={addToBag} toggleFavorite={toggleFavorite} /></Route>
                <Route path="/account"><Account lang={lang} /></Route>
                <Route path="/bag"><BagPage lang={lang} bag={bag} setBag={setBag} setToast={setToast} /></Route>
                <Route component={NotFound} />
              </Switch>
            </RoutedErrorBoundary>
          </SiteShell>
          {toast && <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 border border-[#49372D] bg-[#49372D] px-5 py-3 text-sm text-[#FAF7F0] shadow-md" data-testid="status-toast">{toast}</div>}
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function SiteShell({ children, lang, setLang, menuOpen, setMenuOpen, bagCount, isAr }: { children: ReactNode; lang: Lang; setLang: (lang: Lang) => void; menuOpen: boolean; setMenuOpen: (open: boolean) => void; bagCount: number; isAr: boolean }) {
  const [location, navigate] = useLocation();
  const [giftStartActive, setGiftStartActive] = useState(false);
  const nav = copy[lang].nav;
  const links = ['/', '/#gift-start', '/picks', '/about', '/gift-card'];
  const goToGiftStart = () => {
    if (location !== '/') {
      navigate('/#gift-start');
      return;
    }
    window.history.replaceState(null, '', '#gift-start');
    document.getElementById('gift-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    setGiftStartActive(false);
    if (location !== '/') return;

    let observer: IntersectionObserver | undefined;
    const frame = window.requestAnimationFrame(() => {
      const giftStart = document.getElementById('gift-start');
      if (!giftStart) return;
      observer = new IntersectionObserver(
        ([entry]) => setGiftStartActive(entry.isIntersecting),
        { rootMargin: '-18% 0px -48% 0px', threshold: 0 },
      );
      observer.observe(giftStart);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [location]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#FAF7F0] text-[#49372D]">
      <div className="border-b border-[#49372D]/15 bg-[#F5F0E8] px-5 py-[7px] text-center text-[9px] font-semibold tracking-[.18em] text-[#49372D]" data-testid="text-announcement">
        {copy[lang].announcement}
      </div>
      <header className="relative z-40 w-full border-b border-[#F5F0E8]/15 bg-[#49372D] text-[#F5F0E8]">
        <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-4 px-5 py-4 md:grid-cols-[1fr_auto_1fr] md:px-10 md:py-5">
          <nav className="hidden items-center gap-[clamp(1.75rem,2.6vw,3rem)] md:flex" aria-label="Main navigation">
            {nav.map((item, index) => {
              const isActive = index === 0
                ? location === '/' && !giftStartActive
                : index === 1
                  ? location === '/' && giftStartActive
                  : location === links[index];
              return <Link key={item} href={links[index]} onClick={(event) => { if (index === 0) window.scrollTo({ top: 0, behavior: 'smooth' }); if (index === 1) { event.preventDefault(); goToGiftStart(); } }} className={`header-nav-link whitespace-nowrap font-medium ${isAr ? 'font-nav-ar text-[18px] leading-none' : 'text-[15px] tracking-[.04em] lg:text-[16px]'} ${isActive ? 'is-active' : ''}`} data-testid={`link-nav-${index === 0 ? 'home' : index === 1 ? 'gift' : links[index].slice(1)}`}>{item}</Link>;
            })}
          </nav>
           <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="absolute left-1/2 top-1/2 flex h-11 w-[124px] -translate-x-1/2 -translate-y-1/2 items-center justify-center md:static md:h-14 md:w-[154px] md:translate-x-0 md:translate-y-0 md:justify-self-center" aria-label="L’ANAK home" data-testid="link-logo">
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
            <Link href="/bag" className="header-utility relative flex items-center text-[12px] font-bold" aria-label={isAr ? 'شنطة الهدايا' : 'Gift bag'} data-testid="link-header-bag">
              <ShoppingBag size={19} strokeWidth={1.6} />
              {bagCount > 0 && <b className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F5F0E8] px-1 text-[9px] text-[#49372D]" data-testid="text-bag-count">{bagCount}</b>}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="ms-1 md:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>
        {menuOpen && (
          <div className="absolute left-0 right-0 top-full border-b border-[#F5F0E8]/15 bg-[#49372D] px-5 pb-7 pt-3 text-[#F5F0E8] md:hidden" data-testid="menu-mobile">
            <div className="flex flex-col gap-5">
              {nav.map((item, index) => <Link key={item} href={links[index]} onClick={(event) => { setMenuOpen(false); if (index === 1) { event.preventDefault(); goToGiftStart(); } }} className={`text-2xl font-light ${isAr ? 'font-arabic' : 'font-display'}`} data-testid={`link-mobile-${index === 0 ? 'home' : index === 1 ? 'gift' : links[index].slice(1)}`}>{item}</Link>)}
              <div className="mt-2 flex items-center gap-5 border-t border-current/15 pt-5">
                <Link href="/favorites" onClick={() => setMenuOpen(false)} aria-label={isAr ? 'المفضلة' : 'Favorites'}><Heart size={18} strokeWidth={1.3} /></Link>
                <Link href="/account" onClick={() => setMenuOpen(false)} aria-label={isAr ? 'الحساب' : 'Account'}><User size={18} strokeWidth={1.3} /></Link>
                <Link href="/bag" onClick={() => setMenuOpen(false)} aria-label={isAr ? 'شنطة الهدايا' : 'Gift bag'}><ShoppingBag size={18} strokeWidth={1.3} /></Link>
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
      <Footer lang={lang} setLang={setLang} />
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

function Home({ lang, t, addToBag, toggleFavorite, favorites, giftFlow, selectGiftCategory, continueGiftFlow }: { lang: Lang; t: typeof copy.en; addToBag: (p: Product) => void; toggleFavorite: (id: string) => void; favorites: string[]; giftFlow: GiftFlowState; selectGiftCategory: (category: string) => void; continueGiftFlow: () => void }) {
  const isAr = lang === 'ar';
  useEffect(() => {
    if (window.location.hash !== '#gift-start') return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById('gift-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

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
              <a href="#gift-start" className="hero-cta-button group inline-flex w-max cursor-pointer items-center gap-5 rounded-[7px] border px-7 py-4">
                <span className={`${isAr ? 'font-arabic text-[17px] font-medium' : 'text-[12px] font-bold uppercase tracking-[.15em]'}`}>
                  {isAr ? copy.ar.heroCta : copy.en.heroCta}
                </span>
                {isAr ? (
                  <ArrowLeft size={17} strokeWidth={1.6} className="transition-transform duration-300 ease-out group-hover:-translate-x-1.5" />
                ) : (
                  <ArrowRight size={17} strokeWidth={1.6} className="transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
                )}
              </a>
            </div>
          </div>
        </div>
      </section>

      <EmotionalTransition />

      <GiftingCategories lang={lang} selectedCategory={giftFlow.selectedCategory} onSelectCategory={selectGiftCategory} onContinue={continueGiftFlow} />

      <HowLanakWorks lang={lang} />

      <CuratedPicks lang={lang} addToBag={addToBag} toggleFavorite={toggleFavorite} favorites={favorites} />
      <Newsletter lang={lang} />
    </main>
  );
}

function CuratedPicks({ lang, addToBag, toggleFavorite, favorites }: { lang: Lang; addToBag: (p: Product) => void; toggleFavorite: (id: string) => void; favorites: string[] }) {
  const isAr = lang === 'ar';
  return (
    <section className="featured-gifts bg-[#F5F0E8] px-5 py-20 text-[#49372D] md:px-10 md:py-32" id="featured-gifts">
        <div className="mx-auto max-w-[1440px]">
          <div className="featured-gifts-heading">
            <div>
              <p className={`featured-gifts-eyebrow ${isAr ? 'font-nav-ar' : ''}`}>{isAr ? 'اختيارات لأنّك' : 'The L’ANAK edit'}</p>
              <h2 className={isAr ? 'font-nav-ar' : 'font-display'}>{isAr ? 'إذا محتار، إحنا اخترنا لك.' : 'If you’re unsure, we chose for you.'}</h2>
            </div>
            <Link href="/picks" className="featured-gifts-cta group" data-testid="link-view-edit">
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
  );
}

function GiftEntryRedirect() {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate('/#gift-start', { replace: true });
  }, [navigate]);
  return null;
}

function Picks({ lang, addToBag, toggleFavorite, favorites }: { lang: Lang; addToBag: (p: Product) => void; toggleFavorite: (id: string) => void; favorites: string[] }) {
  return <main><CuratedPicks lang={lang} addToBag={addToBag} toggleFavorite={toggleFavorite} favorites={favorites} /></main>;
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

function GiftingCategories({ lang, selectedCategory, onSelectCategory, onContinue }: { lang: Lang; selectedCategory: string | null; onSelectCategory: (category: string) => void; onContinue: () => void }) {
  const isAr = lang === 'ar';
  const steps = isAr
    ? ['اختار الفكرة', 'اختار المكان', 'حدد القيمة', 'اكتب كلمتك', 'راجع وأرسل']
    : ['Choose the gesture', 'Choose the place', 'Set the value', 'Write your note', 'Review and send'];
  const categories = [
    { id: 'coffee', number: '01', en: 'Coffee', ar: 'قهوة' },
    { id: 'sweets', number: '02', en: 'Sweets', ar: 'حلو' },
    { id: 'restaurants', number: '03', en: 'Dining', ar: 'مطاعم' },
    { id: 'flowers', number: '04', en: 'Flowers', ar: 'ورد' },
    { id: 'self-care', number: '05', en: 'Self-Care', ar: 'عناية' },
    { id: 'gifts', number: '06', en: 'Gifts', ar: 'هدايا' },
  ];

  return (
    <section className="gift-journey scroll-mt-8 bg-[#F5F0E8] px-5 py-10 text-[#49372D] md:px-10 md:py-16" id="gift-start" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-[1440px]">
        <ol className="gift-progress" aria-label={isAr ? 'خطوات الهدية' : 'Gift journey steps'}>
          {steps.map((label, index) => (
            <li key={label} className={index === 0 ? 'is-active' : ''} aria-current={index === 0 ? 'step' : undefined}>
              <span>0{index + 1}</span>
              <b className={isAr ? 'font-nav-ar' : ''}>{label}</b>
            </li>
          ))}
        </ol>

        <header className="gift-journey-intro">
          <p className={isAr ? 'font-nav-ar' : ''}>{isAr ? 'أهدِ الآن' : 'Gift now'}</p>
          <h2 className={isAr ? 'font-nav-ar' : 'font-display'}>{isAr ? 'منو ودّك تهدي اليوم؟' : 'Who are you gifting today?'}</h2>
          <div className={isAr ? 'font-nav-ar' : ''}>{isAr ? 'اختار الفكرة، وخله يختار اللي يحبه.' : 'Choose the gesture, and let them choose what they love.'}</div>
        </header>

        <div className="gift-category-grid">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <button
                type="button"
                key={category.id}
                className={`gift-category-option group ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onSelectCategory(category.id)}
                aria-pressed={isSelected}
                data-testid={`button-category-${category.id}`}
              >
                <span className="gift-category-image">
                  <span>{category.en} IMAGE</span>
                </span>
                <span className="gift-category-meta">
                  <span className="gift-category-number">{category.number}</span>
                  <strong className={isAr ? 'font-nav-ar' : 'font-display'}>{isAr ? category.ar : category.en}</strong>
                  <span className="gift-category-check" aria-hidden="true"><Check size={13} strokeWidth={2} /></span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="gift-journey-action">
          <button type="button" className="gift-continue group" disabled={!selectedCategory} onClick={onContinue} data-testid="button-gift-continue">
            <span className={isAr ? 'font-nav-ar' : ''}>{isAr ? 'كمّل' : 'Continue'}</span>
            {isAr ? <ArrowLeft size={17} strokeWidth={1.5} /> : <ArrowRight size={17} strokeWidth={1.5} />}
          </button>
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

        <Link href="/#gift-start" className="how-lanak-link hero-cta-button group inline-flex w-max cursor-pointer items-center gap-5 rounded-[7px] border px-7 py-4">
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
  product: FeaturedGift;
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
        <img
          src={product.image}
          alt={product.imageAlt}
          style={{ objectPosition: product.imagePosition }}
        />
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

function Reveal({ children, delay = 0, className = "", threshold = 0.2 }: { children: ReactNode, delay?: number, className?: string, threshold?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold, rootMargin: "0px 0px -10% 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[900ms] ease-out motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Section01() {
  return (
    <section className="bg-[#FAF7F0] text-[#49372D] px-5 pt-28 pb-20 md:px-10 md:pt-36 md:pb-28" data-testid="section-about-01">
      <div className="max-w-[1440px] mx-auto w-full flex flex-col items-center text-center">
        <Reveal>
          <h2 className="font-nav-ar text-[clamp(1.75rem,2.7vw,2.4rem)] font-medium mb-10 md:mb-14" data-testid="text-about-eyebrow-1">
            منو إحنا؟
          </h2>
        </Reveal>

        <h1 className="font-arabic text-[clamp(2rem,3.7vw,3.5rem)] font-light leading-[1.55] tracking-normal max-w-[900px]">
          <Reveal delay={180}>
            <div>مو لازم يكون فيه سبب،</div>
            <div>أحيانًا ممكن تكون أنت السبب.</div>
          </Reveal>
        </h1>

        <Reveal delay={420}>
          <div className="font-arabic text-[clamp(2.35rem,4.8vw,4.35rem)] font-light text-[#CBB98B] mt-10 md:mt-14" data-testid="text-about-payoff-1">
            لأنّك أنت.
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function AboutPlaceholderImage({ label, showLogo = false, className = "", aspect = "aspect-[4/3]" }: { label: ReactNode, showLogo?: boolean, className?: string, aspect?: string }) {
  return (
    <div className={`relative flex items-center justify-center bg-[#DED4C5] overflow-hidden ${aspect} ${className}`}>
      {showLogo && (
        <img src={`${import.meta.env.BASE_URL}brand/l-anak-monogram.png`} alt="" className="absolute w-[20%] opacity-[0.15] object-contain" />
      )}
      <span className="relative z-10 text-[9px] font-bold uppercase tracking-[0.2em] text-[#49372D]/40 text-center px-4 leading-[1.6]">
        {label}
      </span>
    </div>
  );
}

function Section02() {
  return (
    <section className="px-5 md:px-10 pb-20 md:pb-32 bg-[#FAF7F0]" data-testid="section-about-02">
      <div className="max-w-[1440px] mx-auto">
        <Reveal>
          <AboutPlaceholderImage
            label="L’ANAK EDITORIAL CAMPAIGN"
            showLogo
            aspect="aspect-[4/3] md:aspect-[21/9]"
            className="w-full"
          />
        </Reveal>
      </div>
    </section>
  );
}

function Section03() {
  return (
    <section className="bg-[#49372D] text-[#FAF7F0] px-5 py-24 md:px-10 md:py-32" data-testid="section-about-03">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-14 md:gap-20 lg:gap-28 items-start">
        <div>
          <Reveal>
            <p className="text-[12px] font-bold tracking-wide opacity-75 mb-6 md:mb-8 font-nav-ar" data-testid="text-about-eyebrow-3">
              ليش لأنّك؟
            </p>
          </Reveal>
          <Reveal delay={140}>
            <h2 className="font-arabic text-[clamp(2.15rem,3.6vw,3.4rem)] font-light leading-[1.35] text-balance max-w-[650px]" data-testid="text-about-main-3">
              لأن الهدية مو دايم تحتاج مناسبة.
            </h2>
          </Reveal>
        </div>

        <div className="flex flex-col gap-8 md:gap-10 text-[clamp(1.1rem,1.5vw,1.4rem)] font-arabic font-light leading-[1.85] md:mt-14">
          <Reveal delay={280}>
            <p>
              مو لازم ننطر ميلاد، تخرج، أو يوم معيّن<br/>
              علشان نقول لشخص: أنت غالي علي.
            </p>
          </Reveal>
          <Reveal delay={420}>
            <p>
              أحيانًا يكون عندنا شعور بسيط نبي نوصله؛<br/>
              امتنان، محبة، اشتياق،<br/>
              أو حتى «كنت أفكر فيك».
            </p>
          </Reveal>
          <Reveal delay={560}>
            <p className="text-[clamp(1.4rem,2.1vw,1.8rem)] leading-[1.65] text-[#CBB98B] mt-2 md:mt-4">
              والهدية؟<br/>
              مجرد طريقة نوصل فيها هالشعور.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Section04() {
  const feelings = [
    { word: "محبة.", image: "L’ANAK — LOVE", logo: true },
    { word: "امتنان.", image: "L’ANAK — GRATITUDE", logo: false },
    { word: "اشتياق.", image: "L’ANAK — LONGING", logo: false },
    { word: "تقدير.", image: "L’ANAK — APPRECIATION", logo: true },
  ];

  return (
    <section className="overflow-hidden bg-[#FAF7F0] py-20 text-[#49372D] md:py-28" data-testid="section-about-04">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10">
        <Reveal>
          <div className="grid grid-cols-1 gap-y-14 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-20 md:gap-x-7 md:gap-y-24">
            {feelings.map((feeling) => (
              <figure className="group" key={feeling.word}>
                <div className="relative aspect-[4/5] overflow-hidden bg-[#DED4C5]">
                  <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out motion-reduce:transition-none group-hover:scale-[1.015]">
                    {feeling.logo && (
                      <img src={`${import.meta.env.BASE_URL}brand/l-anak-monogram.png`} alt="" className="absolute w-[22%] object-contain opacity-[0.12]" />
                    )}
                    <span className="relative z-10 px-4 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-[#49372D]/40">
                      {feeling.image}
                    </span>
                  </div>
                </div>
                <figcaption className="mt-5 text-right font-arabic text-[clamp(1.55rem,2vw,1.9rem)] font-light transition-colors duration-500 ease-out group-hover:text-[#CBB98B]">
                  {feeling.word}
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Section05() {
  return (
    <section className="bg-[#FAF7F0] text-[#49372D] px-5 pb-24 md:pb-40 md:px-10" data-testid="section-about-05">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-16 md:gap-24 items-center">
        <div className="flex flex-col items-start text-right">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-widest opacity-60 mb-8 font-nav-ar" data-testid="text-about-eyebrow-5">
              من الكويت، بالمودة.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="font-arabic text-[clamp(2.2rem,3.5vw,3.8rem)] font-light leading-[1.3] mb-12 text-balance" data-testid="text-about-main-5">
              لأنّك براند كويتي،<br/> يشبه أهله.
            </h2>
          </Reveal>

          <div className="flex flex-col gap-8 text-[clamp(1.1rem,1.5vw,1.4rem)] font-arabic font-light leading-[1.9] opacity-85">
            <Reveal>
              <p>
                إحنا شعب نحب نتقرب من بعض بالمودة،<br/>
                ونفرح بعض بهدية، حتى لو ما كان وراها سبب.
              </p>
            </Reveal>

            <Reveal>
              <p>
                وفكرة «لأنّك» مستوحاة من قيمة التهادي والمحبة<br/>
                اللي حثّنا عليها الرسول ﷺ في معنى «تهادوا تحابوا».
              </p>
            </Reveal>

            <Reveal>
              <p className="text-[#CBB98B] font-normal mt-4 text-[clamp(1.2rem,1.8vw,1.5rem)]">
                مو لأن اليوم مناسبة،<br/>
                بس لأن في شخص يستاهل يعرف مكانته عندك.
              </p>
            </Reveal>
          </div>
        </div>

        <div>
          <Reveal>
            <AboutPlaceholderImage
              label={<>LIFESTYLE / HUMAN CONNECTION<br/>GIFTING MOMENT</>}
              showLogo
              aspect="aspect-[4/5]"
              className="w-full"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Section06() {
  return (
    <section className="bg-[#49372D] text-[#FAF7F0] px-5 py-24 md:py-32 md:px-10" data-testid="section-about-06">
      <div className="max-w-[1440px] mx-auto">
        <div className="relative overflow-hidden min-h-[70vh] flex flex-col justify-center items-center text-center p-8 md:p-16 bg-[#3A2C23]">

          <div className="absolute inset-0">
            <img src={heroCampaignImage} alt="" className="w-full h-full object-cover opacity-25 object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#49372D] via-[#49372D]/20 to-[#49372D]/60" />
          </div>

          <div className="relative z-10 flex flex-col items-center w-full">
            <Reveal>
              <h2 className="font-arabic text-[clamp(2.2rem,4vw,4.2rem)] font-light leading-[1.3] mb-16 md:mb-24 text-balance drop-shadow-md" data-testid="text-about-main-6">
                إحنا ما نوصل هدية وبس.<br/>
                نوصل الشعور اللي وراها.
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-[clamp(1.4rem,2.5vw,2rem)] font-arabic font-light text-[#CBB98B] opacity-90 drop-shadow-md">
                <span>محبة.</span>
                <span className="opacity-40">•</span>
                <span>امتنان.</span>
                <span className="opacity-40">•</span>
                <span>اشتياق.</span>
                <span className="opacity-40">•</span>
                <span>تقدير.</span>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="mt-20 md:mt-28">
                <Link
                  href="/#gift-start"
                  className="hero-cta-button group inline-flex items-center gap-5 rounded-[7px] border px-9 py-5"
                  data-testid="link-about-cta"
                >
                  <span className="font-arabic text-[18px] font-medium leading-none drop-shadow-md">يلا نهدي</span>
                  <ArrowLeft size={19} strokeWidth={1.6} className="transition-transform duration-300 ease-out group-hover:-translate-x-1.5" />
                </Link>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}

function About({ lang }: { lang: Lang }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full bg-[#FAF7F0]" dir="rtl">
      <Section01 />
      <Section02 />
      <Section03 />
      <Section04 />
      <Section05 />
      <Section06 />
    </main>
  );
}

function Newsletter({ lang }: { lang: Lang }) {
  const isAr = lang === 'ar';
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState('');

  const submitEmail = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!isValid) {
      setError(isAr ? 'تأكد إن الإيميل مكتوب صح.' : 'Please enter a valid email.');
      return;
    }
    setError('');
    setJoined(true);
  };

  return (
    <section id="newsletter" className="border-t border-[#CBB98B] bg-[#F5F0E8] px-5 py-14 text-[#49372D] md:px-10 md:py-16" data-testid="section-newsletter">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-9 md:grid-cols-[1.08fr_.92fr] md:items-end md:gap-12 lg:gap-16" dir={isAr ? 'rtl' : 'ltr'}>
        <div>
          <Reveal>
            <div>
              <div className="mb-6 h-px w-12 bg-[#CBB98B]" aria-hidden="true" />
              <h2 className={`text-[clamp(2rem,4vw,3.75rem)] font-normal leading-[1.25] ${isAr ? 'font-arabic' : 'font-display'}`}>
                {isAr ? 'توصلك أخبارنا أول بأول.' : 'Be the first to hear our news.'}
              </h2>
              <p className={`mt-5 max-w-[600px] text-[clamp(1.1rem,1.7vw,1.4rem)] font-light leading-[1.75] text-[#49372D] ${isAr ? 'font-arabic' : ''}`}>
                {isAr ? 'اكتشف جديدنا، اختياراتنا، وكل شيء حصري قبل غيرك.' : 'Discover our latest releases, selections, and every exclusive before anyone else.'}
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={180}>
          <div className="md:pb-1">
            {joined ? (
              <div className={`flex min-h-16 items-center border border-[#CBB98B] bg-[#F5F0E8] px-5 text-[17px] font-medium ${isAr ? 'font-arabic' : ''}`} data-testid="status-newsletter-joined">
                {isAr ? 'وصلنا إيميلك ✓' : 'We received your email ✓'}
              </div>
            ) : (
              <form onSubmit={submitEmail} noValidate>
                <div className="flex min-h-16 items-stretch overflow-hidden rounded-[3px] border border-[#49372D] bg-[#F5F0E8] transition-colors duration-300 ease-out focus-within:border-[#CBB98B]">
                  <input
                    value={email}
                    onChange={(event) => { setEmail(event.target.value); if (error) setError(''); }}
                    type="email"
                    className={`min-w-0 flex-1 bg-transparent px-5 py-4 text-[16px] outline-none placeholder:text-[#49372D]/55 ${isAr ? 'font-arabic' : ''}`}
                    placeholder={isAr ? 'إيميلك' : 'Your email'}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? 'newsletter-error' : undefined}
                    data-testid="input-newsletter-email"
                  />
                  <button type="submit" className={`min-w-20 shrink-0 bg-[#49372D] px-6 text-[16px] font-medium text-[#F5F0E8] transition-colors duration-300 ease-out hover:bg-[#CBB98B] hover:text-[#49372D] ${isAr ? 'font-arabic' : ''}`} data-testid="button-newsletter-submit">
                    {isAr ? 'تم' : 'Done'}
                  </button>
                </div>
                {error && <p id="newsletter-error" className={`mt-2 text-[13px] text-[#49372D] ${isAr ? 'font-arabic' : ''}`} data-testid="text-newsletter-error">{error}</p>}
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Favorites({ lang, favorites, addToBag, toggleFavorite }: { lang: Lang; favorites: string[]; addToBag: (p: Product) => void; toggleFavorite: (id: string) => void }) {
  const isAr = lang === 'ar';
  const savedProducts = [...featuredGifts, ...products].filter((product) => favorites.includes(product.id));
  return (
    <main className="mx-auto min-h-[65vh] max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
      <div className="border-t border-[#49372D]/20 pt-8">
        <h1 className={`text-6xl font-light md:text-8xl ${isAr ? 'font-arabic leading-[1.15]' : 'font-display'}`}>{isAr ? 'المفضلة' : 'Favorites'}</h1>
        {savedProducts.length === 0 ? (
          <div className="py-24 text-center">
            <Heart className="mx-auto" size={30} strokeWidth={1.2} />
            <p className={`mt-6 text-2xl ${isAr ? 'font-arabic' : 'font-display'}`}>{isAr ? 'ما حفظت أي اختيار للحين.' : 'Nothing saved yet.'}</p>
            <Link href="/picks" className="line-draw mt-8 inline-block text-xs font-bold">{isAr ? 'شوف اختياراتنا' : 'Explore our picks'}</Link>
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-3 md:gap-x-8">
            {savedProducts.map((product, index) => <ProductTile key={product.id} product={product} lang={lang} index={index} addToBag={addToBag} toggleFavorite={toggleFavorite} isFavorite />)}
          </div>
        )}
      </div>
    </main>
  );
}

function Account({ lang }: { lang: Lang }) {
  const isAr = lang === 'ar';
  return (
    <main className="mx-auto min-h-[65vh] max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
      <div className="border-t border-[#49372D]/20 pt-8">
        <h1 className={`text-6xl font-light md:text-8xl ${isAr ? 'font-arabic leading-[1.15]' : 'font-display'}`}>{isAr ? 'الحساب' : 'Account'}</h1>
        <p className={`mt-6 max-w-md text-sm leading-7 opacity-65 ${isAr ? 'font-arabic' : ''}`}>{isAr ? 'من هني تقدر تتابع هداياك وتحفظ اختياراتك. تسجيل الدخول بيتوفر قريباً.' : 'This is where you’ll manage gifts and saved picks. Sign-in is coming soon.'}</p>
      </div>
    </main>
  );
}

function BagPage({ lang, bag, setBag, setToast }: { lang: Lang; bag: Product[]; setBag: (items: Product[]) => void; setToast: (message: string) => void }) {
  const isAr = lang === 'ar';
  const total = bag.reduce((sum, item) => sum + item.price, 0);
  return (
    <main className="mx-auto min-h-[65vh] max-w-[1000px] px-5 py-16 md:px-10 md:py-24">
      <div className="border-t border-[#49372D]/20 pt-8">
        <h1 className={`text-6xl font-light md:text-8xl ${isAr ? 'font-arabic leading-[1.15]' : 'font-display'}`}>{isAr ? 'شنطة الهدايا' : 'Gift bag'}</h1>
        {bag.length === 0 ? (
          <div className="py-24 text-center">
            <ShoppingBag className="mx-auto" size={30} strokeWidth={1.2} />
            <p className={`mt-6 text-2xl ${isAr ? 'font-arabic' : 'font-display'}`}>{isAr ? 'الشنطة فاضية.' : 'It’s quiet in here.'}</p>
            <Link href="/#gift-start" className="line-draw mt-8 inline-block text-xs font-bold">{isAr ? 'ابدأ هدية' : 'Start a gift'}</Link>
          </div>
        ) : (
          <div className="mt-12">
            <div className="divide-y divide-[#49372D]/15 border-y border-[#49372D]/20">
              {bag.map((item, index) => (
                <div className="flex items-center gap-4 py-5" key={`${item.id}-${index}`}>
                  <div className="flex h-20 w-16 items-center justify-center bg-[#E8D59E]"><span className="font-display text-2xl">L’</span></div>
                  <div className="flex flex-1 items-center justify-between gap-4">
                    <div><p className={`text-sm font-bold ${isAr ? 'font-arabic' : ''}`}>{isAr ? item.ar : item.name}</p><p className="mt-1 text-[11px] opacity-55">{item.price} KD</p></div>
                    <button onClick={() => setBag(bag.filter((_, itemIndex) => itemIndex !== index))} className="text-[11px] underline opacity-60">{isAr ? 'حذف' : 'Remove'}</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between text-sm font-bold"><span>{isAr ? 'المجموع' : 'Total'}</span><span>{total} KD</span></div>
            <button onClick={() => setToast(isAr ? 'قريباً — بنكمّلها معاك' : 'Almost there — checkout is coming soon')} className="mt-6 flex w-full items-center justify-center gap-3 bg-[#49372D] py-4 text-xs font-bold text-[#FAF7F0]">{isAr ? 'كمل الهدية' : 'Continue the gift'}<ArrowUpRight size={15} /></button>
          </div>
        )}
      </div>
    </main>
  );
}

function Footer({ lang, setLang }: { lang: Lang; setLang: (lang: Lang) => void }) {
  const isAr = lang === 'ar';
  const groups = [
    {
      title: isAr ? 'أهدِ' : 'Gift',
      links: [
        { label: isAr ? 'أهدِ الآن' : 'Gift now', href: '/#gift-start', testId: 'link-footer-shop' },
        { label: isAr ? 'اختياراتنا' : 'Our picks', href: '/picks', testId: 'link-footer-picks' },
        { label: isAr ? 'بطاقة هدية' : 'Gift card', href: '/gift-card', testId: 'link-footer-cards' },
      ],
    },
    {
      title: isAr ? 'لأنّك' : 'L’ANAK',
      links: [
        { label: isAr ? 'عن لأنّك' : 'About', href: '/about', testId: 'link-footer-about' },
        { label: isAr ? 'حسابي' : 'My account', href: '/account', testId: 'link-footer-account' },
        { label: isAr ? 'المفضلة' : 'Favorites', href: '/favorites', testId: 'link-footer-favorites' },
      ],
    },
  ];
  const helpLinks = isAr
    ? ['الأسئلة الشائعة', 'التوصيل', 'تواصل معنا']
    : ['Frequently asked questions', 'Delivery', 'Contact us'];

  return (
    <footer className="bg-[#49372D] px-5 pb-8 pt-14 text-[#F5F0E8] md:px-10 md:pb-9 md:pt-20" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-14 md:grid-cols-[0.8fr_1.2fr] md:items-start md:gap-14 lg:gap-20">
          <div className="flex flex-col items-start gap-7">
            <Link href="/" className="font-display text-[clamp(4.75rem,9vw,8.5rem)] leading-[0.72] tracking-[-.07em] text-[#F5F0E8]" data-testid="link-footer-logo">
              L’ANAK
            </Link>

            <div className="group relative h-36 w-36 shrink-0 text-[#CBB98B] md:ms-5" aria-label={isAr ? 'ختم لأنّك، من هني بكل ود، الكويت 2026' : 'L’ANAK origin seal, Kuwait 2026'} data-testid="footer-origin-seal">
              <svg className="absolute inset-0 h-full w-full overflow-visible transition-transform duration-[650ms] ease-out motion-reduce:transition-none group-hover:rotate-[10deg]" viewBox="0 0 160 160" aria-hidden="true">
                <defs>
                  <path id="footer-seal-path" d="M 80,80 m -61,0 a 61,61 0 1,1 122,0 a 61,61 0 1,1 -122,0" />
                </defs>
                <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="0.75" className="opacity-45 transition-opacity duration-[650ms] group-hover:opacity-80" />
                <circle cx="80" cy="80" r="54" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-30" />
                <text fill="currentColor" fontSize="8.5" letterSpacing="1.45">
                  <textPath href="#footer-seal-path" startOffset="50%" textAnchor="middle">
                    من هني، بكل ود. · KUWAIT · 2026
                  </textPath>
                </text>
              </svg>
              <img src={`${import.meta.env.BASE_URL}brand/l-anak-monogram.png`} alt="" className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 object-contain" />
            </div>
          </div>

          <nav className="footer-navigation grid max-w-[620px] grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 sm:gap-x-10 md:justify-self-end lg:gap-x-14" dir={isAr ? 'rtl' : 'ltr'} aria-label={isAr ? 'روابط التذييل' : 'Footer navigation'}>
            {groups.map((group) => (
              <div className="footer-nav-group" key={group.title}>
                <h2 className={`footer-nav-heading mb-6 text-[14px] font-medium text-[#CBB98B] ${isAr ? 'font-nav-ar' : 'uppercase tracking-[.18em]'}`}>{group.title}</h2>
                <ul className="space-y-4">
                  {group.links.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className={`footer-link text-[13px] opacity-90 ${isAr ? 'font-arabic' : ''}`} data-testid={item.testId}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="footer-nav-group">
              <h2 className={`footer-nav-heading mb-6 text-[14px] font-medium text-[#CBB98B] ${isAr ? 'font-nav-ar' : 'uppercase tracking-[.18em]'}`}>{isAr ? 'مساعدة' : 'Help'}</h2>
              <ul className="space-y-4">
                {helpLinks.map((label) => (
                  <li key={label}>
                    <span className={`footer-link cursor-default text-[13px] opacity-90 ${isAr ? 'font-arabic' : ''}`} aria-disabled="true">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-12 border-t border-[#CBB98B]/35 pt-6 md:mt-14">
          <div className="flex flex-col-reverse gap-6 text-[10px] font-semibold uppercase tracking-[.14em] sm:flex-row sm:items-center sm:justify-between">
            <span className="opacity-65">© 2026 L’ANAK</span>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3" dir="ltr">
              <span className="footer-link cursor-default opacity-65" aria-disabled="true">Instagram</span>
              <span className="footer-link cursor-default opacity-65" aria-disabled="true">TikTok</span>
              <div className="flex items-center gap-2" aria-label="Language selector" data-testid="footer-language-toggle">
                <button onClick={() => setLang('ar')} className={`footer-link ${lang === 'ar' ? 'text-[#CBB98B]' : 'opacity-65'}`}>AR</button>
                <span className="opacity-30">|</span>
                <button onClick={() => setLang('en')} className={`footer-link ${lang === 'en' ? 'text-[#CBB98B]' : 'opacity-65'}`}>EN</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

export default App;
