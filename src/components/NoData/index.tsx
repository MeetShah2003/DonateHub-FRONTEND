import NoDataIcon from "@/icons/NoDataIcon";

const NoData = () => {
  return (
    <div className="w-full border-2 py-16 rounded-md flex justify-center items-center">
      <div className="flex flex-col gap-5 items-center justify-center">
        <div>
          <NoDataIcon />
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-xl font-semibold font-inter leading-8 text-black sm:text-[28px]">
            No data
          </h1>
          <p className="text-base font-medium leading-6 font-inter text-gray-400 text-base-700 sm:text-xl">
            No data, please try again later
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoData;
