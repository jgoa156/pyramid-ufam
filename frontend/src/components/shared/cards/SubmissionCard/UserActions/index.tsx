import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { StatusSubmissions } from "constants/statusSubmissions.constants";
import Async from "react-promise";
import { getFirstAndLastName, getImage, parseDateAndTime } from "utils";

// Shared
import Spinner from "components/shared/Spinner";
import toggleModalForm from "components/shared/ModalForm";
import toast from "components/shared/Toast";
import FormUpdateStatusSubmission from "components/shared/forms/FormUpdateStatusSubmission";
import {
  ButtonGroup,
  AcceptButton,
  DangerButtonAlt,
  InfoButton
} from "../styles";

// Custom
import { History, HistoryItem } from "./styles";

// Interfaces
import IUserLogged from "interfaces/IUserLogged";

interface IUserActionsProps {
  submission: any; //ISubmission;
  user: IUserLogged;
  onChange?: () => void;
}

export default function UserActions({
  submission,
  user,
  onChange = () => { }
}: IUserActionsProps) {
  const [confirmDeletion, setConfirmDeletion] = useState<boolean>(false);
  function handleDeletion(e) {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDeletion(!confirmDeletion);

    if (confirmDeletion) {
      // setShowModalRemove(true);
    }
  }

  // History
  const [fetchingHistory, setFetchingHistory] = useState<boolean>(true);
  const [history, setHistory] = useState<any[]>([]);
  async function fetchHistory() {
    setFetchingHistory(true);

    const options = {
      url: `${process.env.api}/submissions/${submission.id}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        setHistory(response.data.history);
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast("Erro", code in errorMessages ? errorMessages[code] : errorMessages[0], "danger");
      });

    setFetchingHistory(false);
  }

  useEffect(() => {
    if (submission.id) {
      fetchHistory();
    }
  }, [submission]);

  const colors = {
    "aprovou": "var(--success)",
    "rejeitou": "var(--danger)",
    "pré-aprovou": "var(--success-hover)",
    "submeteu": "var(--primary-color)",
  };

  function SubmissionHistory() {
    return (
      <History>
        {fetchingHistory ? (
          <Spinner size={"30px"} color={"var(--primary-color)"} />
        ) : (
          <>
            {history.map((item, index) => (
              <HistoryItem key={index} color={colors[item.action]}>
                <Async promise={getImage(user?.profileImage as string)} then={(url) => <img src={url as string} />} />
                <p>
                  <b>{getFirstAndLastName(item.user.name)}</b>{' '}
                  <span style={{ color: colors[item.action] }}>{item.action}</span> a solicitação em {parseDateAndTime(item.createdAt)}
                </p>
              </HistoryItem>
            ))}
          </>
        )}
      </History>
    );
  }

  return (
    <ButtonGroup>
      <InfoButton onClick={() =>
        toggleModalForm(
          "Histórico",
          <SubmissionHistory />,
          "md"
        )
      }>
        <i className="bi bi-clock-history" /> Histórico
      </InfoButton>

      {(user?.userTypeId == 1 && [1, 2].includes(submission.status)) && (
        <>
          <DangerButtonAlt
            onClick={() =>
              toggleModalForm(
                "Rejeitar submissão",
                <FormUpdateStatusSubmission submission={submission} user={user} onChange={onChange} status={"Rejeitado"} />,
                "md"
              )
            }>
            <i className="bi bi-x-lg" /> Rejeitar
          </DangerButtonAlt>

          <AcceptButton
            onClick={() =>
              toggleModalForm(
                "Aprovar submissão",
                <FormUpdateStatusSubmission submission={submission} user={user} onChange={onChange} status={"Aprovado"} />,
                "md"
              )
            }>
            <i className="bi bi-check2-all" /> Aprovar
          </AcceptButton>
        </>
      )}
      {(user?.userTypeId == 2 && [1].includes(submission.status)) && (
        <AcceptButton
          onClick={() =>
            toggleModalForm(
              "Pré-aprovar submissão",
              <FormUpdateStatusSubmission submission={submission} user={user} onChange={onChange} status={"Pré-aprovado"} />,
              "md"
            )
          }>
          <i className="bi bi-check2-all" /> Pré-aprovar
        </AcceptButton>
      )}
      {(user?.userTypeId == 3 && [1, 2].includes(submission.status)) && (
        <DangerButtonAlt
          onClick={() => {
            /*fetchUpdateStatus({
              userId: user.id,
              id: submission.id,
              status: StatusSubmissions["Cancelado"],
            })*/
          }}>
          <i className="bi bi-x-lg" /> Cancelar
        </DangerButtonAlt>
      )}
    </ButtonGroup>
  );
}