import Image from "next/image";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  

  function handleLogin(e) {
    e.preventDefault();
    router.push('/helpdesk')
  }

  return (
    // Containers
    <div className="h-screen w-[100%] flex justify-center items-center relative bg-[#7a7a7a]">
      <div className="md:w-[572px] md:mt-[-150px] md:px-24 md:py-16 md:h-[505px] rounded-[33px] bg-[#bebebe]">
        
        {/* SVG e HelpDesk */}
        <div className="flex items-baseline justify-start space-x-2">
          <Image width={44} height={33} src="/Vector Help Desk.svg" alt="" />
          <p className="text-lg text-white">Help Desk</p>
        </div>

        {/* Titulo */}
        <p className="text-white text-xl mt-12">Faça login na sua conta</p>

        {/* Formulário */}
        <form className="flex flex-col space-y-10 mt-8" action="">
          <input className="input" placeholder="Usuário" type="text" />
          <input className="input" placeholder="Senha" type="text" />
          <button onClick={handleLogin} className="btnLogin">Login</button>
        </form>
      </div>
    </div>
  );
}
