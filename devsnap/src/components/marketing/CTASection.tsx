import Link from 'next/link';

export default function CTASection({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <section className="py-20 pb-28">
      <div className="max-w-[1100px] mx-auto px-7">
        <div
          className="rounded-[18px] px-7 py-20 text-center border border-indigo-500/20"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.07) 0%, rgba(99,102,241,0.09) 50%, rgba(236,72,153,0.05) 100%)',
          }}
        >
          <h2 className="text-[clamp(2rem,4.5vw,3rem)] font-extrabold tracking-[-1.5px] mb-4 leading-[1.15] text-[#e2e8f0]">
            Ready to Organize<br />Your Knowledge?
          </h2>
          <p className="text-[#7a8499] text-[1.0625rem] mb-9">
            Join developers who stopped losing their best work.
          </p>
          <Link
            href={isSignedIn ? '/dashboard' : '/register'}
            className="inline-flex items-center justify-center text-base px-[30px] py-[13px] rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-semibold hover:opacity-90 hover:-translate-y-px transition-all"
          >
            {isSignedIn ? 'Go to Dashboard' : 'Get Started for Free'}
          </Link>
        </div>
      </div>
    </section>
  );
}
