import Visitor from "@/components/Visitor";

const AboutUsPage = () => {
  return (
    <>
      <div className="navbar sticky top-0 bg-white z-10">
        <Visitor />
      </div>
      <div className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="rounded-[32px] bg-gradient-to-r from-violet-700 via-primary to-fuchsia-600 p-[1px] shadow-[0_25px_70px_-30px_rgba(109,40,217,0.7)]">
            <div className="rounded-[31px] bg-white/95 px-6 py-10 md:px-10">
              <div className="mx-auto max-w-4xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  Our story
                </p>
                <h2 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
                  Building trust in every donation
                </h2>
                <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                  DonateHub aims to bridge the gap between donors and charitable
                  organizations by providing a platform for seamless and secure
                  donations. We believe in the power of giving and strive to make
                  the donation process as transparent and efficient as possible.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-4 md:py-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-900">Our Mission</h3>
              <p className="mt-3 text-lg leading-8 text-slate-600">
                Our mission is to facilitate a culture of generosity and
                philanthropy by connecting donors with trusted charitable
                organizations. We strive to make donating easy, accessible,
                and impactful for everyone.
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-900">Our Vision</h3>
              <p className="mt-3 text-lg leading-8 text-slate-600">
                We envision a world where every act of kindness, no matter how
                small, creates a ripple effect of positive change. Through
                DonateHub, we aspire to create a global community of givers
                who are empowered to make a difference in the lives of those
                in need.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
          <div className="rounded-[28px] bg-gradient-to-r from-slate-900 via-primary to-violet-800 px-6 py-10 text-center text-white shadow-[0_25px_60px_-30px_rgba(109,40,217,0.9)]">
            <h2 className="text-4xl font-bold">Contact Us</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/90">
              We&apos;d love to hear from you! If you have any questions,
              feedback, or inquiries, feel free to reach out to us.
            </p>
            <p className="mt-4 text-lg text-white/90">
              Email: contact@donatehub.com <br />
              Phone: +123-456-7890
            </p>
          </div>
        </div>

        <div className="w-full border-t border-slate-200 py-5 text-center text-sm text-slate-600">
          &copy; Donate Hub Right Reserved 2026
        </div>
      </div>
    </>
  );
};

export default AboutUsPage;
