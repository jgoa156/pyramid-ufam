import { useState, useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useBreadcrumb } from "contexts/BreadcrumbContext";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { restrictPageForLoggedUsers } from "utils";

// Shared
import Wrapper from "components/shared/Wrapper";
import Spinner from "components/shared/Spinner";

// Custom
import MySubmissionList from "components/pages/Solicitacoes/MySubmissionList";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";

export default function MinhasSolicitacoes() {
  const router = useRouter();
  const user = useSelector<IRootState, IUserLogged>((state) => state.user);
  const [loaded, setLoaded] = useState(false);
  const { setLinks } = useBreadcrumb();

  // Setting links used in breadcrumb
  useEffect(() => {
    const url = router.asPath;
    if (!url.includes("page") || !url.includes("search") || !url.includes("status")) {
      router.push(`${url.split("?")[0]}?page=1&search=&status=1`);
    }

    setLinks([
      {
        title: "Minhas submissões",
      },
    ]);
  }, []);

  // Verifying user
  useEffect(() => {
    restrictPageForLoggedUsers(user, router, setLoaded, [3]);
  }, [user]);

  // Submissions
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [fetchingSubmissions, setFetchingSubmissions] = useState<boolean>(true);

  // Fetching submissions
  const {
    page: pageInitial,
    search: searchInitial,
    status: statusInitial,
    sort: sortInitial,
    order: orderInitial
  } = router.query;

  const [page, setPage] = useState<number>(pageInitial ? parseInt(pageInitial as string) : 1);
  const [search, setSearch] = useState<string>(searchInitial ? searchInitial as string : "");
  const [status, setStatus] = useState<string>(statusInitial ? statusInitial as string : "1");
  const [sort, setSort] = useState<string>(sortInitial ? sortInitial as string : "");
  const [order, setOrder] = useState<string>(orderInitial ? orderInitial as string : "");

  const [totalPages, setTotalPages] = useState<number>(0);
  const itensPerPage = 15;
  const [totalItens, setTotalItens] = useState<number>(0);

  useEffect(() => {
    const {
      page: pageReload,
      search: searchReload,
      status: statusReload,
      sort: sortReload,
      order: orderReload
    } = router.query;

    const _page = parseInt(pageReload as string);
    const _search = searchReload as string;
    const _status = statusReload as string;
    const _sort = sortReload as string;
    const _order = orderReload as string;

    if (_page !== undefined && _status !== undefined && _search !== undefined) {
      setPage(_page);
      setSearch(_search);
      setStatus(_status);

      if (_sort !== undefined) {
        setSort(_sort);
      }
      if (_order !== undefined) {
        setOrder(_order);
      }

      fetchSubmissions(_page, _search, _status, _sort, _order);
    }
  }, [router]);

  async function fetchSubmissions(_page, _search, _status, _sort, _order) {
    setFetchingSubmissions(true);

    const options = {
      url: `${process.env.api}/users/${user.id}/submissions?page=${_page}&limit=${itensPerPage}&search=${_search}&status=${_status}${_sort ? `&sort=${_sort}` : ""}${_order ? `&order=${_order}` : ""}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`,
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        setSubmissions(response.data.submissions);
        setTotalPages(response.data.totalPages);
        setTotalItens(response.data.totalItens);
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast.error(code in errorMessages ? errorMessages[code] : errorMessages[0]);
      });

    setFetchingSubmissions(false);
  }

  return (
    <>
      <Head>
        <title>Minhas submissões - {process.env.title}</title>
      </Head>

      {loaded ? (
        <Wrapper>
          <MySubmissionList
            submissions={submissions}
            loading={fetchingSubmissions}
            totalPages={totalPages}
            itensPerPage={itensPerPage}
            totalItens={totalItens}

            onChange={() => fetchSubmissions(page, search, status, sort, order)}
          />
        </Wrapper>
      ) : (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Spinner size={"30px"} color={"var(--primary-color)"} />
        </div>
      )}
    </>
  );
}