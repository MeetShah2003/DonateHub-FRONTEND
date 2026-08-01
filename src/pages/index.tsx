import Visitor from "@/components/Visitor";
import Link from "next/link";

const home = () => {
  const HOW_IT_WORKS: { id: number; title: string; description: string }[] = [
    {
      id: 1,
      title: "Explore Causes",
      description:
        "Browse our curated list of causes, ranging from global issues to local initiatives.",
    },
    {
      id: 2,
      title: "Choose a Charity",
      description:
        "Select a charity that aligns with your values and interests.",
    },
    {
      id: 3,
      title: "Make a Donation",
      description:
        "Contribute to the cause by making a one-time or recurring donation through our secure payment gateway.",
    },
    {
      id: 4,
      title: "Stay Informed",
      description:
        " Receive updates on the impact of your donations and learn more about the organizations you support.",
    },
  ];
  return (
    <div>
      <div className="navbar sticky top-0 bg-white z-10">
        <Visitor />
      </div>
      <div className="bg-indigo-50">
        <div className="relative isolate px-4 py-10 lg:px-8">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          ></div>
          <div className="mx-auto max-w-2xl py-10 sm:py-20 lg:py-10">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Make a Difference Today
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Join us in supporting various causes and making a positive
                impact in the world. Your donation can change lives.
              </p>
              <div className="mt-10 flex flex-col items-center sm:flex-row sm:justify-center sm:gap-x-6">
                <Link
                  href="/login"
                  className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mb-4 sm:mb-0"
                >
                  Donate Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-full w-90% mx-auto">
        <div className="flex flex-col gap-7 items-center justify-center my-10 w-full">
          <h1 className="text-3xl font-bold font-inter text-gray-900/75 text-center">
            Why Donate Hub?
          </h1>
          <p className="text-lg max-w-[90%] leading-7 tracking-wide text-gray-600 text-center">
            At Donate Hub, we prioritize providing you with an effortless and
            enriching donation experience. Our user-friendly interface ensures
            easy navigation, allowing you to explore various categories of
            causes and charities seamlessly. Whether you&apos;re passionate
            about environmental conservation, education, healthcare, or social
            justice, finding the cause that resonates with you has never been
            easier. When it comes to making donations, your security and privacy
            are paramount. That&apos;s why we&apos;ve implemented robust
            measures to safeguard your transactions and personal information.
            With Donate Hub, you can donate with confidence, knowing that your
            data is protected at all times. But our commitment doesn&apos;t stop
            at secure transactions. We believe in the power of impactful giving.
            With Donate Hub, you have the opportunity to track the impact of
            your donations and witness firsthand how they&apos;re making a
            difference in the lives of others.
          </p>
        </div>
        <div className="flex flex-col gap-10 items-center justify-center my-10 w-full">
          <h1 className="text-3xl font-bold font-inter text-gray-900/75 text-center">
            How It Works
          </h1>
          <div className="gap-5 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-center items-center">
            {HOW_IT_WORKS &&
              HOW_IT_WORKS.length &&
              HOW_IT_WORKS.map(({ id, description, title }, index) => {
                return (
                  <div
                    key={index}
                    className="border rounded-md shadow-md gap-3 h-full bg-indigo-50 p-3 flex flex-col items-center"
                  >
                    <h1 className="text-xl font-extrabold font-inter text-black/75">
                      {title}
                    </h1>
                    <p className="text-gray-700 text-center">{description}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className="bg-indigo-50 py-10">
        <div className="relative isolate lg:px-8">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          ></div>
          <div className="mx-auto max-w-2xl py-10 sm:py-20 lg:py-10">
            <div className="text-center">
              <h1 className="text-2xl lg:text-3xl w-full font-bold tracking-tight text-gray-900 sm:text-4xl">
                Join Us in Making a Difference
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Together, we can create positive change in the world. Join
                Donate Hub today and be a part of a community dedicated to
                making a difference.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="py-10 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-full w-90% mx-auto">
            <h1 className="flex justify-center py-5 text-3xl lg:text-4xl font-bold mb-4 font-inter text-gray-900/75 text-center">
              Our Team
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
      </div> */}
      <div className="bg-primary py-10 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-lg font-semibold leading-7 text-indigo-200">
              Why Choose Us?
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Trusted by thousands of donors worldwide
            </p>
            <p className="mt-6 text-lg leading-8 text-indigo-200">
              We&apos;re committed to providing a seamless donation experience
              with transparent processes and impactful results.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  Secure Donation Processing
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-indigo-200">
                  <p className="flex-auto">
                    All donations are securely processed to protect donor
                    information
                  </p>
                  <p className="mt-6">
                    <a
                      href="#"
                      className="text-sm font-semibold leading-6 text-white"
                    >
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  Tax Deductible Receipts
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-indigo-200">
                  <p className="flex-auto">
                    Donors receive tax deductible receipts for their
                    contributions
                  </p>
                  <p className="mt-6">
                    <a
                      href="#"
                      className="text-sm font-semibold leading-6 text-white"
                    >
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  Transparency
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-indigo-200">
                  <p className="flex-auto">
                    Full transparency on how donations are used and impact they
                    make
                  </p>
                  <p className="mt-6">
                    <a
                      href="#"
                      className="text-sm font-semibold leading-6 text-white"
                    >
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <div className="py-10 lg:py-20">
        <div className="relative isolate lg:px-8">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          ></div>
          <div className="mx-auto max-w-2xl py-10 sm:py-20 lg:py-10">
            <div className="text-center">
              <h1 className="text-3xl w-full font-bold tracking-tight text-gray-900 sm:text-4xl">
                Community Engagement
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Encourage visitors to join the Donate Hub community by signing
                up for newsletters, following social media accounts, or
                participating in forums or discussion groups. Foster a sense of
                belonging and connection among donors who share a common
                interest in giving back.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full py-5 border-t-2 flex justify-center items-center">
        &copy; Donate Hub Right Reserved 2026
      </div>
    </div>
  );
};

export default home;
