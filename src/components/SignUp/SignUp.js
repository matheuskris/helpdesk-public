import Loading from "../Loading";
import Link from "next/link";
import { useSignUp } from "./useSignUp";

export default function SignUp() {
  const [formFields, signUpError, isLoading, handleChange, handleSignUp] =
    useSignUp();

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
