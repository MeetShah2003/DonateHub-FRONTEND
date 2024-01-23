import React from "react";

const DoubleArrowIcon = ({ className }: { className: string }) => {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M14.8769 15.209L16.0146 14.0712L12.319 10.3675L16.0146 6.6638L14.8769 5.52606L10.0354 10.3675L14.8769 15.209Z"
        fill="#53596F"
      />
      <path
        d="M9.55952 15.209L10.6973 14.0712L7.00161 10.3675L10.6973 6.6638L9.55952 5.52606L4.71806 10.3675L9.55952 15.209Z"
        fill="#53596F"
      />
    </svg>
  );
};

export default DoubleArrowIcon;
