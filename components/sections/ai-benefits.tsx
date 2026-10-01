import {
  Crosshair,
  Headphones,
  Rocket,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

type Benefit = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

const benefits: Benefit[] = [
  { title: "پشتیبانی رایگان", description: "بعد از تحویل پروژه، تا سه ماه برای رفع مشکل، بهبود و همراهی کنار شما هستیم.", Icon: Headphones },
  { title: "راهکار اختصاصی", description: "متناسب با نیاز و مدل کاری شما، یک راهکار دقیق و بهینه طراحی می‌کنیم.", Icon: Crosshair },
  { title: "پرداخت اقساطی", description: "برای شروع همکاری، امکان پرداخت اقساطی در نظر گرفته‌ایم تا مسیر ساده‌تر باشد.", Icon: WalletCards },
  { title: "تحول فوری", description: "پروژه‌ها را با اولویت بالا و در بازه‌ای کوتاه، آماده و قابل استفاده می‌کنیم.", Icon: Rocket },
];

export const AiBenefits = () => (
  <section aria-labelledby="ai-benefits-title" className="px-5 py-24 sm:px-8 sm:py-28 lg:py-32">
    <div className="mx-auto w-full max-w-[1050px]">
      <div className="text-right">
        <h2 id="ai-benefits-title" className="text-[28px] font-black leading-[1.45] tracking-[-0.02em] text-[#171b1f] sm:text-[34px]">
          همکاری با خیام چه چیزی را برای شما بهتر می‌کند؟
        </h2>
        <p className="mt-5 max-w-[760px] text-sm leading-7 text-[#536169] sm:text-base sm:leading-8">
          از اجرای سریع‌تر تا راهکارهای اختصاصی، خیام کمک می‌کند هوش مصنوعی و فناوری را ساده‌تر، کاربردی‌تر و به‌صرفه‌تر وارد کسب‌وکارتان کنید.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-5">
        {benefits.map(({ title, description, Icon }) => (
          <article key={title} className="group flex min-h-[235px] flex-col rounded-2xl border border-white/90 bg-white/90 px-6 py-7 text-right shadow-[0_12px_35px_rgba(27,81,104,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(27,81,104,0.11)]">
            <span className="flex size-12 items-center justify-center rounded-full bg-[#f1f6ff] text-[#087fff] transition-colors group-hover:bg-[#e4f0ff]">
              <Icon aria-hidden="true" className="size-6" strokeWidth={1.8} />
            </span>
            <h3 className="mt-7 text-base font-extrabold text-[#20262a]">{title}</h3>
            <p className="mt-3 text-[13px] leading-6 text-[#65727a]">{description}</p>
            <a href="#contact" className="mt-auto pt-5 text-xs font-bold text-[#087fff] outline-none transition-colors hover:text-[#005fc9] focus-visible:underline">بیشتر ←</a>
          </article>
        ))}
      </div>
    </div>
  </section>
);
