import { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { useDispatch } from "react-redux";
import { login, defaultCourse, authorize } from "redux/slicer/user";
import { useRouter } from "next/router";
import Link from "next/link";
import { validateEmail } from "utils";

// Shared
import Form from "components/shared/Form";
import { LinkWrapper, FormAlert } from "components/shared/Form/styles";
import TextInput from "components/shared/TextInput";
import { Button } from "components/shared/Button";
import Spinner from "components/shared/Spinner";
import { H3 } from "components/shared/Titles";

// Custom
import { Logo, Info, InstitutionalLogos } from "./styles";

export default function FormLogin() {
  const router = useRouter();

  // Inputs and validators
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Form login
  const [sent, setSent] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false); // Estado para visibilidade da senha

  // Função para alternar a visibilidade da senha
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Inverte o estado da visibilidade
  };

  function handleLogin(e) {
    e.preventDefault();
    setSent(true);

    if (validateEmail(email) && password.length !== 0) {
      fetchLogin({ email, password });
    }
  }

  const dispatch = useDispatch();
  async function fetchLogin(data) {
    setFetching(true);

    const options = {
      url: `${process.env.api}/auth/login`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "x-access-token, x-refresh-token"
      },
      data: {
        email: data.email,
        password: data.password,
      },
      credentials: "include"
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        setSuccess(true);

        if (response.data.user) {
          dispatch(authorize({
            token: response.headers["x-access-token"],
            refreshToken: response.headers["x-refresh-token"],
          }));
          dispatch(login(response.data.user));

          if (response.data.user.courses.length === 1) {
            dispatch(defaultCourse(response.data.user.courses[0]));

            setTimeout(() => router.push(
              response.data.user.userTypeId === 3
                ? "/minhas-solicitacoes/nova"
                : "/solicitacoes"
            ), 250);
          } else {
            setTimeout(() => router.push("/conta/curso"), 250);
          }
        }
      })
      .catch((error) => {
        const unauthorizedMessages = {
          "Invalid email": "Email inválido.",
          "Invalid password": "Senha inválida.",
        };

        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          401: unauthorizedMessages[error?.response?.data?.message],
          404: "Usuário não encontrado.",
          412: "Usuário desativado. Contate um administrador."
        };

        const code = error?.response?.status ? error.response.status : 0;
        setError(
          code in errorMessages ? errorMessages[code] : errorMessages[0]
        );
        setSuccess(false);
      });

    setFetching(false);
  }

  return (
    <>
      <Form>
        <Logo src={`${process.env.img}/full-logo.png`} />

        <Info>
          Bem vindo ao <b>Pyramid</b>! Uma plataforma para gerenciar suas
          atividades complementares.
        </Info>

        <TextInput
          label={"Email"}
          name={"email"}
          value={email}
          handleValue={setEmail}
          validate={validateEmail}
          required={true}
          alert={"Email inválido"}
          displayAlert={sent}
          maxLength={255}
        />

        {/* Campo de senha com botão de visibilidade do lado direito */}
        <div style={{ position: "relative", width: "100%" }}>
          <TextInput
            type={showPassword ? "text" : "password"}
            label={"Senha"}
            name={"password"}
            value={password}
            handleValue={setPassword}
            required={true}
            displayAlert={sent}
            maxLength={255}
            style={{ paddingRight: "40px" }} // Ajuste para garantir que o campo tenha espaço para o ícone
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            style={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--primary-color)",
              zIndex: 1,  // Garante que o ícone fique acima do campo
            }}
          >
            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi bi-eye"}`} />
          </button>
        </div>

        <Button style={{ marginTop: 15 }} onClick={(e) => handleLogin(e)}>
          {fetching ? (
            <Spinner size={"20px"} color={"var(--white-1)"} />
          ) : (
            <>
              <i className="bi bi-box-arrow-in-right" />
              Entrar
            </>
          )}
        </Button>

        {sent && !success && error?.length !== 0 && (
          <FormAlert>{error}</FormAlert>
        )}

        <LinkWrapper>
          <Link href="/cadastro">
            <a>Não tem conta?</a>
          </Link>
          <span>•</span>
          <Link href="/conta/senha">
            <a>Esqueceu sua senha?</a>
          </Link>
        </LinkWrapper>
      </Form>

      <InstitutionalLogos>
        <img src={`${process.env.img}/icomp.png`} />
        <img src={`${process.env.img}/ufam.png`} />
      </InstitutionalLogos>
    </>
  );
}
