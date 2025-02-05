import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "utils";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";

// Shared
import { H3 } from "components/shared/Titles";
import Filter, { FilterCollapsible, IFilterOption, ActiveFilters, SearchBar } from "components/shared/Filter";
import { ButtonGroupTop, DangerButtonAlt, InfoButton } from "components/shared/Table";
import Paginator from "components/shared/Paginator";
import { DefaultWrapper } from "components/shared/Wrapper/styles";
import Spinner from "../Spinner";

// Custom
import {
  HeaderWrapper,
  AddUserLink,
  ListStyled,
  Disclaimer
} from "./styles";
import User from "./User";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";
interface IUserListProps {
  title: string;
  courseId?: number | null | undefined;
  users?: any[];
  loading?: boolean;
  totalPages: number;
  itensPerPage: number;
  totalItens: number;

  subRoute?: string;
  onChange?: Function;
  filtersChanged?: boolean;

  children?: React.ReactNode;
}

export default function UserList({
  title,
  courseId,
  users = [],
  loading,
  totalPages,
  itensPerPage,
  totalItens,

  subRoute = "",
  onChange = () => { },

  children
}: IUserListProps) {
  const loggedUser = useSelector<IRootState, IUserLogged>((state) => state.user);
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [checkedIds, setCheckedIds] = useState<number[]>([]);

  const subRoutes = {
    "alunos": {
      icon: "people",
      singleTitle: "aluno"
    },
    "coordenadores": {
      icon: "person-workspace",
      singleTitle: "coordenador"
    },
    "secretarios": {
      icon: "person-badge",
      singleTitle: "secretário"
    },
  }

  // Filter options
  const [filterChanged, setFilterChanged] = useState<boolean>(false)
  
  const [fetchingFilter, setFetchingFilter] = useState<boolean>(false);
  const statuses = router.query.status?.toString().split("-");
  const [filterOptions, setFilterOptions] = useState<IFilterOption[]>([
    { title: "Ativos", value: 1, accent: "var(--success)", checked: statuses?.includes("1") },
    { title: "Inativos", value: 0, accent: "var(--danger)", checked: statuses?.includes("0") },
  ]);

  useEffect(() => {
    setFetchingFilter(true);
    const debounce = setTimeout(() => {
      const status = filterOptions.map(option => option.checked ? `${option.value}-` : "").join("").slice(0, -1);
      router.push({
        query: { ...router.query, status },
      });

      setFilterChanged(true)
      setFetchingFilter(false);
    }, 1000);

    return () => {
      clearTimeout(debounce);
      setFilterChanged(false)
    }
  }, [filterOptions]);

  // Delete functions
  const [fetchingDelete, setFetchingDelete] = useState<boolean>(false);
  async function fetchDelete(id: string) {
    setFetchingDelete(true);

    const options = {
      url: `${process.env.api}/users/${id}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application",
        "Authorization": `Bearer ${getToken()}`,
      }
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {

        toast.success("Usuário desativado com sucesso.");
        onChange();
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast.error(code in errorMessages ? errorMessages[code] : errorMessages[0]);
      });

    setFetchingDelete(false);
  }

  const [fetchingMassDelete, setFetchingMassDelete] = useState<boolean>(false);
  async function fetchMassDelete(ids: string) {
    setFetchingMassDelete(true);

    const options = {
      url: `${process.env.api}/users/${ids}/mass-remove`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      }
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        const count = response.data.count;
        if (count === 0) {
          toast.info("Nenhum usuário foi desativado.");
        } else {
          toast.success(`${count} usuários desativados com sucesso.`);
        }

        setCheckedIds([]);
        onChange();
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast.error(code in errorMessages ? errorMessages[code] : errorMessages[0]);
      });

    setFetchingMassDelete(false);
  }

  // Restore functions
  const [fetchingRestore, setFetchingRestore] = useState<boolean>(false);
  async function fetchRestore(id: string) {
    setFetchingRestore(true);

    const options = {
      url: `${process.env.api}/users/${id}/restore`,
      method: "PATCH",
      headers: {
        "Content-Type": "application",
        "Authorization": `Bearer ${getToken()}`,
      }
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {

        toast.success("Usuário reativado com sucesso.");
        onChange();
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast.error(code in errorMessages ? errorMessages[code] : errorMessages[0]);
      });

    setFetchingRestore(false);
  }

  const [fetchingMassRestore, setFetchingMassRestore] = useState<boolean>(false);
  async function fetchMassRestore(ids: string) {
    setFetchingMassRestore(true);

    const options = {
      url: `${process.env.api}/users/${ids}/mass-restore`,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      }
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        const count = response.data.count;
        if (count === 0) {
          toast.info("Nenhum usuário foi reativado.");
        } else {
          toast.success(`${count} usuários reativados com sucesso.`);
        }

        setCheckedIds([]);
        onChange();
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast.error(code in errorMessages ? errorMessages[code] : errorMessages[0]);
      });

    setFetchingMassRestore(false);
  }

  function AddUserButton() {
    return (
      <Link href={`/usuarios/novo?tipo=${subRoutes[subRoute].singleTitle}`}>
        <AddUserLink>
          <i className={`bi bi-${subRoutes[subRoute].icon}`}>
            <i className="bi bi-plus" />
          </i>
          Adicionar {subRoutes[subRoute].singleTitle}
        </AddUserLink>
      </Link>
    );
  }

  function MassActionsButtonGroup() {
    return (
      <>
        <DangerButtonAlt onClick={() => fetchMassDelete(checkedIds.join(","))} disabled={fetchingMassDelete}>
          {fetchingMassDelete
            ? <Spinner size={"20px"} color={"var(--danger)"} />
            : <><i className="bi bi-x-lg" /> Desativar selecionados</>
          }
        </DangerButtonAlt>

        <InfoButton onClick={() => fetchMassRestore(checkedIds.join(","))} disabled={fetchingMassRestore}>
          {fetchingMassRestore
            ? <Spinner size={"20px"} color={"var(--success)"} />
            : <><i className="bi bi-exclamation-lg" /> Reativar selecionados</>
          }
        </InfoButton>
      </>
    );
  }

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [users]);

  return (
    <DefaultWrapper>
      <HeaderWrapper>
        <H3>{title}</H3>

        {!isMobile && <ButtonGroupTop>{checkedIds?.length > 0 ? <MassActionsButtonGroup /> : <AddUserButton />}</ButtonGroupTop>}
      </HeaderWrapper>

      <Filter>
        <div className="filter-bar">
          <FilterCollapsible
            options={filterOptions}
            setOptions={setFilterOptions}
            fetching={fetchingFilter}
          />
          <SearchBar placeholder="Pesquisar usuários" />
        </div>
      </Filter>

      {isMobile && <ButtonGroupTop>{checkedIds?.length > 0 ? <MassActionsButtonGroup /> : <AddUserButton />}</ButtonGroupTop>}

      {users?.length > 0 ?
        (<ListStyled>
          <User header={true} checkedIds={checkedIds} setCheckedIds={setCheckedIds} subRoute={subRoute} />
          {users.map((user, index) =>
            <User
              key={index}
              user={user}
              courseId={courseId}
              subRoute={subRoute}
              loading={loading}

              fetchingDelete={fetchingDelete}
              onDelete={() => fetchDelete(user?.id)}
              fetchingRestore={fetchingRestore}
              onRestore={() => fetchRestore(user?.id)}
              onChange={onChange}
              filtersChanged={filterChanged}

              checkedIds={checkedIds}
              setCheckedIds={setCheckedIds}

              disableMenu={loggedUser?.id === user?.id}
            />
          )}
          {children}
        </ListStyled>)
        : (<Disclaimer>Nenhum {subRoutes[subRoute].singleTitle} encontrado. Tente alterar a busca, filtro ou página.</Disclaimer>)
      }

      {totalItens > 0 &&
        <Paginator
          page={parseInt(router.query.page as string)}
          totalPages={totalPages}
          itensPerPage={itensPerPage}
          totalItens={totalItens}
        />}
    </DefaultWrapper>
  );
}
