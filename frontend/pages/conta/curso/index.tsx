import { useState, useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { restrictPageForUsersWithoutSelectedCourse } from "utils";

// Shared
import Wrapper from "components/shared/Wrapper";
import Spinner from "components/shared/Spinner";

// Custom
import CourseSelector from "components/pages/Curso/CourseSelector";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";

export default function Curso() {
  const router = useRouter();
  const user = useSelector<IRootState, IUserLogged>(state => state.user);
  const [loaded, setLoaded] = useState(false);

  // Verifying user
  useEffect(() => {
    restrictPageForUsersWithoutSelectedCourse(user, router, setLoaded);
  }, [user]);

  return (
    <>
      <Head>
        <title>Curso - {process.env.title}</title>
      </Head>

      {loaded
        ? <Wrapper centerAlign={true} maxWidth={992}>
          <CourseSelector />
        </Wrapper>
        : <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spinner size={"30px"} color={"var(--primary-color)"} />
        </div>
      }
    </>
  );
}