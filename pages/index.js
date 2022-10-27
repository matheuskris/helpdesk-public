import Image from "next/image";
import Helpdesk from "./helpdesk";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  signInAuthWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "../src/utils/firebase.utils";

export default function Checking() {
  const [isUserLogged, setIsUserLogged] = useState(true);

  console.log(isUserLogged);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setIsUserLogged(true);
    } else {
      setIsUserLogged(false);
    }
  }, []);

  return <>{isUserLogged ? <Helpdesk /> : <Login />}</>;
}

function Login() {
  const [credential, setCredential] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      router.push("/helpdesk");
    }
  }, []);

  function handleChange(event) {
    const { value } = event.target;
    const { name } = event.target;

    setCredential({ ...credential, [name]: value });
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!credential.email || !credential.password) return;

    try {
      const userCredential = await signInAuthWithEmailAndPassword(
        credential.email,
        credential.password
      );
      const { user } = userCredential;
      console.log(user);

      localStorage.setItem("user", user);

      router.push("/helpdesk");
    } catch (error) {
      alert("Senha ou email incorretos");
    }
  }

  return (
    // Containers
    <div className="h-screen w-[100%] flex justify-center items-center relative bg-[#7a7a7a]">
      <div className="md:w-[572px] md:mt-[-100px] md:px-24 md:py-16 md:h-[505px] rounded-[33px] bg-[#bebebe]">
        {/* SVG e HelpDesk */}
        <div className="flex items-baseline justify-start space-x-2">
          <Image width={44} height={33} src="/Vector Help Desk.svg" alt="" />
          <p className="text-lg text-white">Help Desk</p>
        </div>

        {/* Titulo */}
        <p className="text-white text-xl mt-12">Faça login na sua conta</p>

        {/* Formulário */}
        <form className="flex flex-col space-y-10 mt-8" action="">
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
          <button onClick={handleLogin} className="btnLogin">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
