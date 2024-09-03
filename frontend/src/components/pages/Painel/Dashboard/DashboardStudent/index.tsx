import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { getToken } from "utils";

// Custom
import NumberTile from "../NumberTile";
import { getApprovedLabel, getConcludedHours, getPendingLabel, getPreApprovedLabel, getRejectedLabel, getStudentsLabel } from "../helpers";

// Interfaces
import { IDashboardProps } from "../interfaces";
export default function DashboardStudent({ userLogged }: IDashboardProps) {
  useEffect(() => {
    if (userLogged?.selectedCourse) fetchReport(userLogged?.id, userLogged?.selectedCourse?.id);
  }, []);

  const [report, setReport] = useState<any>(null);
  const [fetchingReport, setFetchingReport] = useState<boolean>(true);

  async function fetchReport(userId: number, courseId: number) {
    setFetchingReport(true);

    const options = {
      url: `${process.env.api}/users/${userId}/report/${courseId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        setReport(response.data);
      })
      .catch((error) => handleFetchError(error));

    setFetchingReport(false);
  }

  function handleFetchError(error) {
    const errorMessages = {
      0: "Oops, tivemos um erro. Tente novamente.",
      500: error?.response?.data?.message,
    };
    const code = error?.response?.status ? error.response.status : 500;
    toast.error(code in errorMessages ? errorMessages[code] : errorMessages[0]);
  }

  return (
    fetchingReport
      ? <>
        <NumberTile
          fetching={true}
        />
        <NumberTile
          fetching={true}
        />
        <NumberTile
          fetching={true}
        />
        <NumberTile
          fetching={true}
        />
        <NumberTile
          fetching={true}
        />
      </>
      : <>
        <NumberTile
          icon="file-earmark-check"
          accent="var(--success)"
          title={getConcludedHours(report?.workloadCount?.totalWorkload)}
          value={`${report?.workloadCount?.totalWorkload}/${report?.course.minWorkload}`}
          callToAction="Visualizar"
          link="/minhas-solicitacoes?page=1&search=&status=3"
        />
        <NumberTile
          icon="file-earmark-medical"
          title={getPendingLabel(report?.pendingSubmissions)}
          value={report?.pendingSubmissions}
          callToAction="Visualizar"
          link="/minhas-solicitacoes?page=1&search=&status=1"
        />
        <NumberTile
          icon="file-earmark-medical"
          accent="var(--danger)"
          title={getRejectedLabel(report?.rejectedSubmissions)}
          value={report?.rejectedSubmissions}
          callToAction="Visualizar"
          link="/minhas-solicitacoes?page=1&search=&status=4"
        />
        <NumberTile
          icon="file-earmark-medical"
          accent="var(--warning-hover)"
          title={getPreApprovedLabel(report?.preApprovedSubmissions)}
          value={report?.preApprovedSubmissions}
          callToAction="Visualizar"
          link="/minhas-solicitacoes?page=1&search=&status=2"
        />
        <NumberTile
          icon="file-earmark-medical"
          accent="var(--success)"
          title={getApprovedLabel(report?.approvedSubmissions)}
          value={report?.approvedSubmissions}
          callToAction="Visualizar"
          link="/minhas-solicitacoes?page=1&search=&status=3"
        />
      </>
  );
}
