import Image from "next/image";
import Loading from "../Loading";
import Link from "next/link";
import useLogin from "./useLogin";

export default function Login() {
  const [credential, logInError, isLoading, handleChange, handleLogin] =
    useLogin();

  return (
    <div className="h-screen w-[100%] flex justify-center items-center relative bg-gradient-to-r from-cyan-500 to-blue-500">
      <div className="w-[572px] shadow-xl px-24 py-16 rounded-[33px] bg-cyan-800">
        <div className="flex items-baseline justify-start space-x-2">
          <Image width={44} height={33} src="/Vector Help Desk.svg" alt="" />
          <p className="text-lg text-white">Help Desk</p>
        </div>
        <p className="text-white text-xl mt-12">Faça login na sua conta</p>
        <form className="flex flex-col space-y-10 mt-8" onSubmit={handleLogin}>
          <input
            className="input"
            placeholder="Usuário"
            type="email"
            name="email"
            value={credential.email}
            onChange={handleChange}
          />
          <input
            className="input"
            placeholder="Senha"
            type="password"
            name="password"
            onChange={handleChange}
            value={credential.password}
          />
          {logInError && <p className="text-red-600 font-bold">{logInError}</p>}
          <button
            disabled={isLoading}
            type="submit"
            className="btnLogin"
          >
            {isLoading ? <Loading /> : "Login"}
          </button>
        </form>
        <Link href="/signUp">
          <h2 className="mt-2 w-full text-white">
            Não tem uma conta? clique aqui para cadastrar!
          </h2>
        </Link>
      </div>
    </div>
  );
}
