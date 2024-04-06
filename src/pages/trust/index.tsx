import ReactBarChart from "@/components/ReactBarChart.tsx";
import ReactLineChart from "@/components/ReactLineChart";
import Spinner from "@/components/Spinner";
import TrustNavbar from "@/components/TrustNavbar";
import TrustRoute from "@/components/TrustRoute/TrustRoute";
import { BACKEND_BASE_URL } from "@/consts";
import { useAuth } from "@/context/auth";
import DisasterIcon from "@/icons/DisasterIcon";
import ProfileIcon from "@/icons/ProfileIcon";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Trust = () => {
  const { push } = useRouter();
  const access_token = Cookies.get("access_token");
  const [supporter, setSupporter] = useState();
  const [totalCollection, setTotalCollection] = useState<number>();
  const [disasterCount, setDisasterCount] = useState<number>();
  const [totalDisasterCollection, setTotalDisasterCollection] =
    useState<number>(0);
  const [incomeChart, setIncomeChart] = useState();
  const [suppChartData, setSuppChartData] = useState();
  const [disasterIncomeChart, setDisasterIncomeChart] = useState();
  const [loading, setLoading] = useState(false);

  const formatAmount = (amount: any) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  const getSupporterAndCollectionData = () => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/trust/myManualSupp`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSupporter(data.uniqueSupportersCount);
        setTotalCollection(data.totalManualDonation);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const manualIncomeChart = () => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/trust/myManualIncChart`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => {
        if (res && res.status === 200) {
          return res.json();
        }
      })
      .then((data: any) => {
        if (data) {
          setIncomeChart(data?.myIncomeData);
        }
      });
  };

  const disastersCount = () => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/trust/myDisaster`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => {
        if (res && res.status === 200) {
          return res.json();
        }
      })
      .then((data: any) => {
        if (data) {
          let totalCollection = 0;

          data.myDisasters.map((value: any) => {
            totalCollection += value.recievedFund;
            console.log("totalCollection>>", totalCollection);
            setTotalDisasterCollection(totalCollection);
          });

          setDisasterCount(data.countDisaster);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const disaterIncomChart = () => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/trust/myDisasterIncChart`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => {
        if (res && res.status === 200) {
          return res.json();
        }
      })
      .then((data: any) => {
        if (data) {
          setDisasterIncomeChart(data?.myIncomeData);
          console.log("data.myIncomeData", data.myIncomeData);
        }
      });
  };
  const suppChart = () => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/trust/myManualSupporterChart`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => {
        if (res && res.status === 200) {
          return res.json();
        }
      })
      .then((data: any) => {
        if (data) {
          setSuppChartData(data?.formattedData);
          console.log("data.myIncomeData", data.formattedData);
        }
      });
  };

  useEffect(() => {
    getSupporterAndCollectionData();
    manualIncomeChart();
    disaterIncomChart();
    disastersCount();
    suppChart();
  }, [access_token]);

  const supporterChartData = [
    { date: "12 jan", supporters: 2400 },
    { date: "13 jan", supporters: 1398 },
    { date: "14 jan", supporters: 9800 },
    { date: "15 jan", supporters: 3908 },
    { date: "16 jan", supporters: 4800 },
    { date: "17 jan", supporters: 3800 },
    { date: "18 jan", supporters: 4300 },
  ];
  const income = [
    { name: "01 jan", income: 2400, amt: 2400 },
    { name: "05 jan", income: 1398, amt: 2210 },
    { name: "09 jan", income: 9800, amt: 2290 },
    { name: "11 jan", income: 3908, amt: 2000 },
    { name: "16 jan", income: 4800, amt: 2181 },
    { name: "15 jan", income: 3800, amt: 2500 },
    { name: "18 feb", income: 4300, amt: 2100 },
  ];
  return (
    <TrustNavbar title="Home">
      {loading && <Spinner />}
      <div className="grid grid-cols-2 grid-rows-2 justify-between gap-5">
        <div
          onClick={() => {
            // router.push("/admin/manageuser");
          }}
          className="flex flex-col py-5 justify-center hover:scale-105 cursor-pointer hover:transition-all hover:duration-400 hover:ease-out items-center bg-primary w-full rounded-md text-white"
        >
          <h1 className="font-inter flex items-center justify-center gap-2 font-bold text-2xl">
            <span>
              <ProfileIcon color="#FFFFFF" />
            </span>
            {supporter}
          </h1>
          <p className="text-base font-medium">Suppoters</p>
        </div>

        <div
          onClick={() => {
            push(`/trust/transactions`);
          }}
          className="flex flex-col py-5 justify-center hover:scale-105 cursor-pointer hover:transition-all hover:duration-400 hover:ease-out items-center bg-secondary w-full rounded-md text-white"
        >
          <h1 className="font-inter font-bold text-2xl">
            <span className="font-normal">₹</span>{" "}
            {formatAmount(totalCollection)}
          </h1>
          <p className="text-base font-medium">Collection</p>
        </div>

        <div
          onClick={() => {
            push(`/trust/disasters`);
          }}
          className="flex flex-col py-5 justify-center hover:scale-105 cursor-pointer hover:transition-all hover:duration-400 hover:ease-out items-center bg-secondary w-full rounded-md text-white"
        >
          <h1 className="font-inter font-bold text-2xl">
            <span className="font-normal">₹</span>{" "}
            {formatAmount(totalDisasterCollection)}
          </h1>
          <p className="text-base font-medium">Disasters Collection</p>
        </div>
        <div
          onClick={() => {
            push("/trust/disasters");
          }}
          className="flex flex-col py-5 justify-center hover:scale-105 cursor-pointer hover:transition-all hover:duration-400 hover:ease-out items-center bg-primary w-full rounded-md text-white"
        >
          <h1 className="font-inter flex items-center justify-center gap-2 font-bold text-2xl">
            <span>
              <DisasterIcon color="#FFFFFF" />
            </span>
            {disasterCount}
          </h1>
          <p className="text-base font-medium">Disasters</p>
        </div>
      </div>
      <div>
        <h1 className="sm:block py-5 font-inter font-semibold text-steelGray text-xl sm:text-2xl">
          Analytics
        </h1>
      </div>
      <div className="flex flex-col md:flex-row -z-10 gap-5">
        <ReactLineChart data={suppChartData} title="Supporter Chart" />
        <ReactBarChart data={incomeChart} title="Income Chart" />
      </div>
      <div className="flex mt-5 flex-col md:flex-row -z-10 gap-5">
        <ReactBarChart
          data={disasterIncomeChart}
          title="Disaster Income Chart"
        />
      </div>
    </TrustNavbar>
  );
};

export default TrustRoute(Trust);
