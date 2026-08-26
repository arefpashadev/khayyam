import Image from "next/image";

const projects = [
  { title: "پشتیبانی هوشمند مشتریان", description: "پاسخ‌گویی سریع، دقیق و شبانه‌روزی به درخواست مشتریان", image: "https://images.unsplash.com/photo-1743485237407-e00bfb75163e?auto=format&fit=crop&w=1000&q=85" },
  { title: "داشبورد مدیریت محتوا", description: "مدیریت یکپارچه محتوا و گزارش عملکرد در یک محیط ساده", image: "https://images.unsplash.com/photo-1530435460869-d13625c69bbf?auto=format&fit=crop&w=1000&q=85" },
  { title: "دستیار تحلیل داده", description: "تبدیل داده‌های پراکنده به گزارش‌های شفاف و کاربردی", image: "https://images.unsplash.com/photo-1781914476939-91a41b914899?auto=format&fit=crop&w=1000&q=85" },
  { title: "اتوماسیون فرایند فروش", description: "پیگیری خودکار سرنخ‌ها و مدیریت منظم ارتباط با مشتری", image: "https://images.unsplash.com/photo-1770899621442-24237af4c8b4?auto=format&fit=crop&w=1000&q=85" },
  { title: "سامانه پردازش اسناد", description: "استخراج، دسته‌بندی و جست‌وجوی هوشمند اطلاعات سازمانی", image: "https://images.unsplash.com/photo-1744555270794-6d378b9e7cd3?auto=format&fit=crop&w=1000&q=85" },
  { title: "پلتفرم خدمات هوشمند", description: "راهکاری اختصاصی برای ارائه سریع‌تر و دقیق‌تر خدمات", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=85" },
];

export const AiPortfolio = () => (
  <section aria-labelledby="ai-portfolio-title" className="min-h-[780px] bg-gradient-to-r from-[#12a8f6] via-[#0795ef] to-[#09237f] px-5 py-20 text-white sm:px-8 sm:py-24 lg:min-h-[850px] lg:py-28">
    <div className="mx-auto w-full max-w-[920px]">
      <div className="text-right" dir="rtl">
        <h2 id="ai-portfolio-title" className="text-[28px] font-black leading-tight sm:text-[34px]">نمونه‌کارها</h2>
        <p className="mt-5 text-sm leading-7 text-white/90 sm:text-base">چند نمونه از پروژه‌هایی که برای کسب‌وکارها طراحی کرده‌ایم</p>
      </div>
      <div className="mt-14 grid grid-cols-1 gap-5 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <article key={project.title} className="overflow-hidden rounded-2xl bg-white text-[#151a1e] shadow-[0_16px_36px_rgba(2,24,73,0.18)]">
            <div className="relative aspect-[1.42/1] overflow-hidden bg-[#e8f4f7]">
              <Image src={project.image} alt={`نمایی از پروژه ${project.title}`} fill sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 45vw, 290px" priority={index < 3} className="object-cover" />
            </div>
            <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 py-3" dir="rtl">
              <div className="min-w-0 text-right">
                <h3 className="text-sm font-bold sm:text-base">{project.title}</h3>
                <p className="mt-1 truncate text-xs text-[#69757c]">{project.description}</p>
              </div>
              <a href="#contact" aria-label={`مشاهده ${project.title}`} className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#e5f5ff] outline-none transition-colors hover:bg-[#ccecff] focus-visible:ring-4 focus-visible:ring-white/40">
                <Image src="/icons/arrow-left.svg" alt="" width={20} height={20} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
