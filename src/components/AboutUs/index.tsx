const AboutUs = () => {
  return (
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
                organizations. We strive to make donating easy, accessible, and
                impactful for everyone.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
              <p className="text-lg">
                We envision a world where every act of kindness, no matter how
                small, creates a ripple effect of positive change. Through
                DonateHub, we aspire to create a global community of givers who
                are empowered to make a difference in the lives of those in
                need.
              </p>
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
    </div>
  );
};

export default AboutUs;
