import Image from "next/image";
import { useRouter } from "next/router";

function Helpdesk() {
  const router = useRouter();

  // just an example of what the date should look like
  function data() {
    return `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()} às ${new Date().getHours()}:${new Date().getMinutes()}`
  }

  const chamados = [
    {
      numeroChamado: 1,
      dataInicial: data(),
      DataTermino: data(),
      Título: 'Computador lento',
      Descrição: 'Lento demais',
      Prioridade: 'A',
      Responsável: 'Patricia',
    },
    {
      numeroChamado: 2,
      dataInicial: data(),
      DataTermino: data(),
      Título: 'Computador não liga',
      Descrição: 'não liga',
      Prioridade: 'C',
      Responsável: 'Flávio',
    },
    {
      numeroChamado: 3,
      dataInicial: data(),
      DataTermino: data(),
      Título: 'Não consigo cadastrar compra',
      Descrição: 'ERP deu pau',
      Prioridade: 'B',
      Responsável: 'Monica',
    },
    {
      numeroChamado: 4,
      dataInicial: data(),
      DataTermino: data(),
      Título: 'internet caiu',
      Descrição: 'não fui eu',
      Prioridade: 'A',
      Responsável: 'Patricia',
    },
    {
      numeroChamado: 5,
      dataInicial: data(),
      DataTermino: data(),
      Título: 'internet caiu de novo',
      Descrição: 'não fui eu',
      Prioridade: 'C',
      Responsável: 'Monica',
    },
    {
      numeroChamado: 6,
      dataInicial: data(),
      DataTermino: data(),
      Título: 'Reposição de teclado',
      Descrição: 'Teclado quebrou',
      Prioridade: 'B',
      Responsável: 'Flávio',
    },
    // {
    //   numeroChamado: 7,
    //   dataInicial: data(),
    //   DataTermino: data(),
    //   Título: 'Reposição de teclado',
    //   Descrição: 'Teclado quebrou',
    //   Prioridade: 'B',
    //   Responsável: 'Flávio',
    // },
  ]

  function logout() {
    router.push("/");
  }

  function criarChamado() {
    router.push('criarchamado')
  }

  return (
    <div className="h-screen w-full relative bg-[#FFF]">

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
        <div className="w-[100%] lg:mt-[500px] xl:mt[700px] space-y-2">
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

      {/* Titulo tabela e botão  */}
      <div className='flex justify-between items-center pt-[50px]'>
        <h1 className=" text-3xl font-semibold ml-[136px] pl-16 mb-2">Painel de Controle</h1>
        <button onClick={criarChamado} className="btnAddChamado">Abrir um chamado</button>
      </div>

      {/* Tabela */}
      <div className=" mx-auto flex justify-center items-center ml-[136px]">
        <table className=" bg-white lg:w-[1300px] lg:h-[600px] xl:w- xl:h-  rounded-3xl border-collapse mx-[60px] my-0 text-lg ">    
            <thead>
              <tr className="bg-[#c4c4c4] text-white text-left">
                <th className="th">ID Chamado</th>
                <th className="th">Data Inicial</th>
                <th className="th">Data Término</th>
                <th className="th">Título</th>
                <th className="th">Descrição</th>
                <th className="th">Prioridade</th>
                <th className="th">Responsável</th>
              </tr>
            </thead>
            <tbody className="overflow-y-scroll"> 
              {chamados.map((chamado) => (
                <tr key={chamado.id} className='border-b border-[#dddddd] even:bg-gray-200'>
                  <td className="td">{chamado.numeroChamado}</td>
                  <td className="td">{chamado.dataInicial}</td>
                  <td className="td">{chamado.DataTermino}</td>
                  <td className="td">{chamado.Título}</td>
                  <td className="td">{chamado.Descrição}</td>
                  <td className="td">{chamado.Prioridade}</td>
                  <td className="td">{chamado.Responsável}</td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>

    </div>
  );
}

export default Helpdesk;
