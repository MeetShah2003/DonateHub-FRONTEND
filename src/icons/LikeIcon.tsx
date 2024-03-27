const LikeIcon: React.FC<{ isLike: boolean }> = ({ isLike }) => {
  return (
    // <svg
    //   width="24px"
    //   height="24px"
    //   viewBox="0 0 24 24"
    //   fill={isLike ? "#674CC4" : "none"}
    //   xmlns="http://www.w3.org/2000/svg"
    // >
    //   <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    //   <g
    //     id="SVGRepo_tracerCarrier"
    //     stroke-linecap="round"
    //     stroke-linejoin="round"
    //   ></g>
    //   <g id="SVGRepo_iconCarrier">
    //     {" "}
    //     <g clip-path="url(#clip0_15_121)">
    //       {" "}
    //       <rect width="24" height="24" fill="white"></rect>{" "}
    //       <path
    //         d="M3 12.5C3 11.3954 3.89543 10.5 5 10.5H6C7.10457 10.5 8 11.3954 8 12.5V18.5C8 19.6046 7.10457 20.5 6 20.5H5C3.89543 20.5 3 19.6046 3 18.5V12.5Z"
    //         stroke="#674CC4"
    //         stroke-linecap="round"
    //         stroke-linejoin="round"
    //       ></path>{" "}
    //       <path
    //         d="M8 12.5C9 12.5 13 10 13 5C13 3 16 3 16 5C16 7 16 8 15 10.5H21C21.5523 10.5 22 10.9477 22 11.5V14.7396C22 15.2294 21.8202 15.7022 21.4948 16.0683L18.5967 19.3287C18.2172 19.7557 17.6731 20 17.1019 20H10.3333C10.117 20 9.90643 19.9298 9.73333 19.8L8 18.5"
    //         stroke="#674CC4"
    //         stroke-linecap="round"
    //         stroke-linejoin="round"
    //       ></path>{" "}
    //     </g>{" "}
    //     <defs>
    //       {" "}
    //       <clipPath id="clip0_15_121">
    //         {" "}
    //         <rect width="24" height="24" fill="white"></rect>{" "}
    //       </clipPath>{" "}
    //     </defs>{" "}
    //   </g>
    // </svg>
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill={isLike ? "#ED2939" : "none"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z"
          stroke="#000000"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>{" "}
      </g>
    </svg>
  );
};

export default LikeIcon;
