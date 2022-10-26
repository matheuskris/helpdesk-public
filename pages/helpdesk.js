import Image from "next/image";
import { useRouter } from "next/router";

function Helpdesk() {
  const router = useRouter();

  function logout() {
    router.push("/");
  }

  function criarChamado() {
    router.push('criarchamado')
  }

  return (
    <div className="h-screen w-full relative">

      {/* Aside */}
      <div className="lg:absolute lg:w-[136px] lg:h-full bg-[#c4c4c4]">

        {/* Titulo e SVG Menu */}
        <div className="flex items-center justify-center">
          <h1 className="text-lg font-semibold text-white py-4 px-2">
            Help Desk
          </h1>
          <Image
            className="cursor-pointer"
            width={24}
            height={24}
            src="/menu.svg"
            alt="Ícone Menu"
          />
        </div>

        {/* Opções */}
        <div className="w-[100%] lg:mt-[700px] space-y-2">
          <div className="opcoes">
            <Image src="/phone.svg" width={18} height={18} alt="Ícone Telefone" />
            <p className="mx-1">Contato</p>
          </div>
          <div className="opcoes">
            <Image
              src="/mdi_help-circle-outline.svg"
              width={18}
              height={18}
              alt="Ícone Ajuda"
            />
            <p className="mx-1">Ajuda</p>
          </div>
          <div className="opcoes">
            <Image src="/mdi_login.svg" width={18} height={18} alt="Ícone Sair" />
            <p onClick={logout} className="mx-1 cursor-pointer">
              Sair
            </p>
          </div>
        </div>
      </div>
      {/* Final Aside */}

      {/* nav */}
      <div className="flex items-center justify-end lg:w-[calc(100% - 136px)] h-[120px] lg:ml-[136px] space-x-16 px-16">
        <p className="cursor-pointer font-bold text-black text-lg mr-[-60px]">
            Equipe Suporte:
        </p>
        <select className="cursor-pointer text-black text-lg outline-none">
            <option value="Flávio" selected>Flávio</option>
            <option value="Patricia">Patricia</option>
            <option value="Monica">Monica</option>
        </select>
        <p className="cursor-pointer text-black text-lg">Configurações</p>
      </div>
      {/* Final Nav */}



      {/* Titulo tabela e botão  */}
      <div className='flex justify-between items-center'>
        <h1 className=" text-lg font-semibold ml-[136px] pl-16 mb-2">Painel de Controle</h1>
        <button onClick={criarChamado} className="btnAddChamado">Adicionar um chamado</button>
      </div>

      {/* Tabela */}
      <div className="w-[calc(100% - 136px)] h-[70%] mx-auto flex justify-center items-center ml-[136px]">
        <table className="w-[100%] h-[100%] bg-red-400 px-10 py-12 rounded-3xl">    
            <thead>
              <tr>
                <th>Número do Chamado</th>
                <th>Título</th>
                <th>Descrição</th>
                <th>Prioridade</th>
                <th>Responsável</th>
              </tr>
            </thead>
        </table>
      </div>

    </div>
  );
}

export default Helpdesk;
