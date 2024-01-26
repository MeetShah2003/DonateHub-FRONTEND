import { useRouter } from "next/router";
const TrustApprovalModal: React.FC<{
  title: string;
  description: string;
  trustImage: string;
  onVerify: () => void;
}> = ({ description, title, trustImage, onVerify }, index) => {
  console.log(title);
  return (
    <div
      key={index}
      className="w-full border-2 shadow-sm rounded-md flex justify-between items-center pr-5"
    >
      <div className="flex">
        <div className="m-2">
          <img className="rounded-md h-14 w-fit" src={trustImage}></img>
        </div>
        <div className="flex flex-col m-2">
          <p className="text-2xl font-semibold text-gray-600">{title}</p>
          <p className="text-base font-semibold text-gray-600">{description}</p>
        </div>
      </div>
      <div className="bg-primary text-white py-2 px-5 rounded-sm">
        <button onClick={onVerify} className="font-medium">
          Verify
        </button>
      </div>
    </div>
  );
};

export default TrustApprovalModal;
