import logo from "@/shared/assets/logo.webp";
const Footer = () => {
  return (
    <footer className="w-full bg-[#221510] text-white pt-20 pb-10 px-4 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-20">
          <div className="max-w-lg">
            <h2 className="text-4xl font-black mb-4">Join the Community</h2>
            <p className="text-white/60 text-lg">
              Subscribe to get special offers, early access to drops, and
              exclusive deals.
            </p>
          </div>
          <div className="flex w-full max-w-md gap-3">
            <input
              className="flex-1 bg-white/10 border-none rounded-xl px-6 focus:ring-2 focus:ring-primary text-white placeholder:text-white/40"
              placeholder="Enter your email"
              type="email"
            />
            <button className="text-black dark:text-primary-foreground bg-primary hover:bg-primary/90 font-black px-8 py-4 rounded-xl transition-all">
              Join
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/10 pt-20">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <span className="">
                  <img src={logo} alt="" />
                </span>
              </div>
              <h2 className="text-white text-xl font-black">ShoeStore</h2>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Redefining performance and lifestyle through innovative footwear
              design and curated collections.
            </p>
            <div className="flex gap-4">
              <div className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-sm">share</span>
              </div>
              <div className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-sm">
                  camera_enhance
                </span>
              </div>
              <div className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-sm">
                  play_circle
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h4 className="font-bold text-lg uppercase tracking-wider text-primary">
              Shop
            </h4>
            <ul className="flex flex-col gap-3 text-white/60">
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  New Arrivals
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Best Sellers
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Sale
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Gift Cards
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <h4 className="font-bold text-lg uppercase tracking-wider text-primary">
              Support
            </h4>
            <ul className="flex flex-col gap-3 text-white/60">
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Help Center
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Order Tracker
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Shipping &amp; Returns
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <h4 className="font-bold text-lg uppercase tracking-wider text-primary">
              Legal
            </h4>
            <ul className="flex flex-col gap-3 text-white/60">
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Terms of Service
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-sm">
            © 2024 ShoeStore. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-white/40 text-sm">
            <span>Visa</span>
            <span>MasterCard</span>
            <span>PayPal</span>
            <span>Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
