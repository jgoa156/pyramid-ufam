import { useState, useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useBreadcrumb } from "contexts/BreadcrumbContext";
import { restrictPageForLoggedUsers } from "utils";

// Shared
import Wrapper from "components/shared/Wrapper";
import Spinner from "components/shared/Spinner";

// Custom
import FormAddSubmission from "components/shared/forms/FormAddSubmission";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";

export default function NovaSolicitacao() {
  const router = useRouter();
  const userLogged = useSelector<IRootState, IUserLogged>(state => state.user);
  const [loaded, setLoaded] = useState(false);
  const { setLinks } = useBreadcrumb();

  // Setting links used in breadcrumb
  useEffect(() => {
    setLinks([
      {
        title: "Minhas submissões",
        route: "/minhas-solicitacoes"
      },
      {
        title: "Nova submissão"
      }
    ]);
  }, []);

  // Verifying user
  useEffect(() => {
    if (!userLogged.logged) {
      router.replace("/entrar");
    } else if (userLogged.selectedCourse == null) {
      router.replace("/conta/curso");
    } else {
      setTimeout(() => setLoaded(true), 250);
    }
    restrictPageForLoggedUsers(userLogged, router, setLoaded, [3]);
  }, [userLogged]);

  return (
    <>
      <Head>
        <title>Nova submissão - {process.env.title}</title>
      </Head>

      {loaded
        ? <Wrapper>
          <FormAddSubmission userLogged={userLogged} />
        </Wrapper>
        : <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spinner size={"30px"} color={"var(--primary-color)"} />
        </div>
      }
    </>
  );
}