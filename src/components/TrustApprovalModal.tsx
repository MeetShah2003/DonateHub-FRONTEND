const TrustApprovalModal: React.FC<{
  title: string;
  description: string;
  trustImage: string;
  founder: string;
  creationDate: string;
  onVerify: () => void;
}> = (
  { description, title, trustImage, creationDate, founder, onVerify },
  index
) => {
  console.log(title);

  const maxLines = 2; // Adjust the number of lines to show
  return (
    <div
      key={index}
      className="w-full border shadow-sm rounded-md flex flex-col sm:flex-row justify-between items-center"
    >
      <div className="flex flex-col sm:flex-row w-full">
        <div className="m-2 flex sm:flex-shrink-0">
          <img className="rounded-md sm:h-14 w-full " src={trustImage}></img>
        </div>
        <div className="flex flex-col m-2">
          <p className="text-base font-semibold font-inter">{title}</p>
          <p
            className="text-sm font-semibold text-gray-500"
            style={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              textOverflow: "ellipsis",
              WebkitLineClamp: maxLines,
            }}
          >
            {description}
          </p>
        </div>
      </div>
      <div className="flex w-full my-5 justify-around items-center">
        <div className="flex flex-col font-inter items-center justify-center">
          <p className="text-base">Founder</p>
          <p className="text-gray-500 text-sm">{founder}</p>
        </div>
        <div className="flex flex-col font-inter items-center justify-center">
          <p className="text-md">Creation Date</p>
          <p className="text-gray-500 text-sm">{creationDate}</p>
        </div>
      </div>
      <div className="flex justify-center w-full sm:w-fit p-2 text-white  ">
        <button
          onClick={onVerify}
          className="font-medium w-full bg-primary py-2 px-5 rounded-sm"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default TrustApprovalModal;
