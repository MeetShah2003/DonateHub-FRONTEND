import Visitor from "@/components/Visitor";

const AboutUsPage = () => {
  return (
    <>
      <div className="navbar sticky top-0 bg-white z-10">
        <Visitor />
      </div>
      <div>
        <div className="bg-gradient-to-b bg-secondary rounded-md py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-8 text-white">Our Story</h2>
              <p className="text-lg text-white">
                DonateHub aims to bridge the gap between donors and charitable
                organizations by providing a platform for seamless and secure
                donations. We believe in the power of giving and strive to make
                the donation process as transparent and efficient as possible.
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
                <p className="text-lg">
                  Our mission is to facilitate a culture of generosity and
                  philanthropy by connecting donors with trusted charitable
                  organizations. We strive to make donating easy, accessible,
                  and impactful for everyone.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
                <p className="text-lg">
                  We envision a world where every act of kindness, no matter how
                  small, creates a ripple effect of positive change. Through
                  DonateHub, we aspire to create a global community of givers
                  who are empowered to make a difference in the lives of those
                  in need.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="flex justify-center py-10 text-3xl font-bold mb-4">
                Our Team
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-2">
                    Darshan Prajapati
                  </h3>
                  <p className="text-sm">Team Member</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-2">Meet Shah</h3>
                  <p className="text-sm">Team Member</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-2">Kishan Pandav</h3>
                  <p className="text-sm">Team Member</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-2">Parth Katariya</h3>
                  <p className="text-sm">Team Member</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-secondary py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-4xl font-bold mb-8">Contact Us</h2>
              <p className="text-lg">
                We&apos;`d love to hear from you! If you have any questions,
                feedback, or inquiries, feel free to reach out to us.
              </p>
              <p className="text-lg">
                Email: contact@donatehub.com <br />
                Phone: +123-456-7890
              </p>
            </div>
          </div>
        </div>
        <div className="w-full py-5 border-t-2 flex justify-center items-center">
          &copy; Donate Hub Right Reserved 2024
        </div>
      </div>
    </>
  );
};

export default AboutUsPage;
