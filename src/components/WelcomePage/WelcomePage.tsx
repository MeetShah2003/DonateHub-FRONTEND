const WelcomePage = () => {
  return (
    <div className="max-w-full w-full h-screen flex">
      <div className="w-3/5 bg-primary">
        <div className="text-white text-7xl font-josefinSans font-semibold w-full h-full flex flex-col justify-start p-20 items-start">
          <p className="my-5">Welcome To</p>
          <p>DonateHub</p>
        </div>
      </div>
      <div className="w-2/5">
        <form className="flex flex-col gap-5 py-10">
          <h4 className="pl-20 font-bold font-josefinSans text-4xl">Sign Up</h4>
          <div className="flex flex-col px-20 gap-1">
            <label className="text-lg tracking-wider">Username</label>
            <input
              type="text"
              className="outline-none border focus:border-primary rounded-md w-full p-2"
              placeholder="Enter Username"
            />
          </div>
          <div className="flex flex-col px-20 gap-1">
            <label className="text-lg tracking-wider">Email</label>
            <input
              type="text"
              className="outline-none border tracking-widest focus:border-primary rounded-md w-full p-2"
              placeholder="johndoe@gmail.com"
            />
          </div>
          <div className="flex flex-col px-20 gap-1">
            <label className="text-lg tracking-wider">Password</label>
            <input
              type="text"
              className="outline-none border focus:border-primary rounded-md w-full p-2"
              placeholder="Enter password"
            />
          </div>
          <div className="flex flex-col px-20 gap-1">
            <label className="text-lg tracking-wider">Role</label>
            <select className="outline-none border focus:border-primary rounded-md w-full p-2">
              <option value="user">User</option>
              <option value="trust">Trust</option>
            </select>
          </div>
          <div className="flex flex-col px-20 gap-1">
            <button className="outline-none bg-primary text-white rounded-md w-full p-2">
              Sign Up
            </button>
          </div>
          <div className="flex flex-col px-20 gap-1">
            <button className="bg-white text-gray-700 border border-gray-300 rounded-md w-full p-2 flex items-center justify-center gap-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400">
              <svg
                width="21"
                height="21"
                viewBox="0 0 256 262"
                preserveAspectRatio="xMidYMid"
              >
                <path
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  fill="#4285F4"
                ></path>
                <path
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  fill="#34A853"
                ></path>
                <path
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  fill="#EB4335"
                ></path>
              </svg>
              Continue with Google
            </button>
          </div>
          <div className="flex flex-col px-20 gap-1">
            <button className="bg-white text-gray-700 border border-gray-300 rounded-md w-full p-2 flex items-center justify-center gap-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 256 256"
                preserveAspectRatio="xMidYMid"
              >
                <path
                  fill="#24292e"
                  d="M128 0C57.308 0 0 57.308 0 128c0 56.469 36.525 104.341 87.187 121.343 6.373 1.17 8.712-2.771 8.712-6.166 0-3.051-.11-13.212-.169-24.01-35.525 7.724-43.053-15.358-43.053-15.358-5.798-14.727-14.154-18.646-14.154-18.646-11.617-7.94.876-7.768.876-7.768 12.849.903 19.629 13.205 19.629 13.205 11.427 19.58 29.955 13.93 37.243 10.66 1.151-8.277 4.463-13.932 8.129-17.105-28.503-3.24-58.427-14.25-58.427-63.404 0-14.004 4.992-25.456 13.206-34.423-1.333-3.236-5.719-16.322 1.242-33.979 0 0 10.78-3.454 35.303 13.145a120.778 120.778 0 0163.68 0c24.478-16.6 35.24-13.145 35.24-13.145 6.974 17.657 2.579 30.743 1.246 33.979 8.224 8.967 13.192 20.419 13.192 34.423 0 49.313-30.994 60.144-59.927 63.336 4.708 3.977 8.901 11.81 8.901 23.836 0 17.207-.155 31.072-.155 35.281 0 3.419 2.312 7.37 8.773 6.129C219.482 232.259 256 184.421 256 128 256 57.308 198.692 0 128 0z"
                ></path>
              </svg>
              Continue with GitHub
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WelcomePage;
