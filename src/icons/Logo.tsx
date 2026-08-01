const Logo = () => {
  return (
    <svg
      width="220"
      height="64"
      viewBox="0 0 220 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="DonateHub logo"
    >
      <defs>
        <linearGradient id="logoGradient" x1="8" y1="8" x2="44" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F46E5" />
          <stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
      </defs>

      <rect x="6" y="8" width="44" height="44" rx="14" fill="url(#logoGradient)" />
      <path
        d="M26 19.2C24.2 17.1 21 16.4 18.8 18.1C16.6 19.8 16.2 23.1 17.8 25.3C18.8 26.6 20.4 27.4 22 27.4C23.6 27.4 25.2 26.6 26.2 25.3C27.8 23.1 27.4 19.8 25.2 18.1C25.1 18 25.1 18 26 19.2Z"
        fill="#FFFFFF"
      />
      <path
        d="M20.5 17.7C20.5 15.6 22.1 14 24.2 14C26.3 14 27.9 15.6 27.9 17.7C27.9 19.2 26.8 20.5 25.4 21.1C24.7 21.4 23.9 21.4 23.2 21.1C21.8 20.5 20.7 19.2 20.5 17.7Z"
        fill="#F8FAFC"
      />
      <path
        d="M32.2 19.8C33.4 18.7 35.2 18.7 36.4 19.8L39.1 22.2C40.3 23.3 40.3 25 39.1 26.1L36.4 28.5C35.2 29.6 33.4 29.6 32.2 28.5L29.5 26.1C28.3 25 28.3 23.3 29.5 22.2L32.2 19.8Z"
        fill="#FFFFFF"
        opacity="0.92"
      />

      <text x="62" y="29" fill="#0F172A" fontSize="20" fontWeight="700" fontFamily="Arial, sans-serif">
        Donate
      </text>
      <text x="62" y="49" fill="#4F46E5" fontSize="20" fontWeight="700" fontFamily="Arial, sans-serif">
        Hub
      </text>
      <circle cx="190" cy="24" r="8" fill="#F59E0B" opacity="0.16" />
      <path d="M190 18.5V29.5" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M184.5 24H195.5" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
};

export default Logo;
