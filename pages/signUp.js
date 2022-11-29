import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, setName } from "../src/store/userSlicer/userSlicer";
import Loading from "../src/components/Loading";
import Link from "next/link";
import { useRouter } from "next/router";
import { createAuthUserWithEmailAndPassword } from "../src/utils/firebase.utils";

const initialState = {
  email: "",
  password: "",
  confirmPassword: "",
  username: "",
};

export default function SignUp() {
  const [formFields, setFormFields] = useState(initialState);
  const [signUpError, setSignUpError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  function handleChange(event) {
    const { value } = event.target;
    const { name } = event.target;

    setFormFields({ ...formFields, [name]: value });
  }

  async function handleSignUp(e) {
    e.preventDefault();

    if (formFields.password !== formFields.confirmPassword) {
      setSignUpError("insira duas senhas iguais");
      return;
    }
    if (formFields.username.length > 12) {
      setSignUpError("insira um username curto");
      return;
    }
    if (!formFields.email || !formFields.password || !formFields.username) {
      setlogInError("insira dados válidos");
      setFormFields(initialState);
      return;
    }
    setLoading(true);

    try {
      const user = await createAuthUserWithEmailAndPassword(
        formFields.email,
        formFields.password,
        formFields.username
      );

      dispatch(setUser(user));
      dispatch(setName(formFields.username));
    } catch (error) {
      console.log(error.code);
    }
    router.push("/");
    setLoading(false);
    setFormFields(initialState);
  }

  return (
    <div className="h-screen w-[100%] flex justify-center items-center relative bg-[#7a7a7a]">
      <div className="w-[572px] px-24 py-16 rounded-[33px] bg-[#bebebe]">
        {/* Titulo */}
        <p className="text-white text-xl mt-12">Cadastro</p>

        {/* Formulário */}
        <form className="flex flex-col space-y-10 mt-8" action="">
          <input
            className="input"
            placeholder="Insira seu email"
            type="email"
            name="email"
            value={formFields.email}
            onChange={handleChange}
          />
          <input
            className="input"
            placeholder="Insira seu nome"
            type="text"
            name="username"
            value={formFields.username}
            onChange={handleChange}
          />
          <input
            className="input"
            placeholder="Insira sua Senha"
            type="password"
            name="password"
            onChange={handleChange}
            value={formFields.password}
          />
          <input
            className="input"
            placeholder="Confirme sua Senha"
            type="password"
            name="confirmPassword"
            onChange={handleChange}
            value={formFields.confirmPassword}
          />
          {signUpError ? (
            <p className="text-red-600 font-bold">{signUpError}</p>
          ) : (
            ""
          )}
          <button
            disabled={isLoading}
            onClick={handleSignUp}
            className="btnLogin"
          >
            {isLoading ? <Loading /> : "Cadastrar"}
          </button>
        </form>
        <Link href="/">Já tem uma conta? clique aqui para entrar!</Link>
      </div>
    </div>
  );
}
