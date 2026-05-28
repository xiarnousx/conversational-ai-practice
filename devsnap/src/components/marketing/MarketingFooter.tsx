const footerLinks = [
  {
    heading: 'Product',
    links: ['Features', 'Pricing', 'Changelog'],
  },
  {
    heading: 'Resources',
    links: ['Documentation', 'API', 'Blog'],
  },
  {
    heading: 'Company',
    links: ['About', 'Privacy', 'Terms'],
  },
];

export default function MarketingFooter() {
  return (
    <footer className="border-t border-[#1e2235] pt-14 pb-8">
      <div className="max-w-[1100px] mx-auto px-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">⚡</span>
              <span className="font-bold text-[17px] tracking-tight text-[#e2e8f0]">DevStash</span>
            </div>
            <p className="text-[0.875rem] text-slate-400">Store Smarter. Build Faster.</p>
          </div>

          {/* Link columns */}
          {footerLinks.map(({ heading, links }) => (
            <div key={heading} className="flex flex-col gap-[10px]">
              <h4 className="text-[0.8125rem] font-bold text-[#e2e8f0] tracking-[0.5px] mb-1">{heading}</h4>
              {links.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-[0.875rem] text-slate-400 hover:text-[#7a8499] transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="border-t border-[#1e2235] pt-6 text-[0.8125rem] text-slate-400">
          © {new Date().getFullYear()} DevStash. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
