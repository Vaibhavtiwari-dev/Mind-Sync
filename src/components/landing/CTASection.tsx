import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto glass-card p-12 md:p-24 rounded-3xl text-center relative overflow-hidden group">
        <div className="absolute -top-1/2 -left-1/2 size-full bg-primary/5 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">Ready to sync your mind?</h2>
          <p className="text-on-surface-variant text-lg mb-12 max-w-xl mx-auto">
            Join thousands of researchers, engineers, and creators building the future of intelligence.
          </p>
          <Link href="/sign-up">
            <button className="px-12 py-5 rounded-xl text-xl font-bold bg-primary text-on-primary shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all cursor-pointer">
              Upgrade to Premium
            </button>
          </Link>
          <p className="mt-8 text-xs font-label-sm text-outline uppercase tracking-widest">No credit card required for 14-day trial</p>
        </div>
      </div>
    </section>
  );
}
