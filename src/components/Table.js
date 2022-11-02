import { getTimeStringFromMs } from "../utils/functions.utils";
import Image from "next/image";

function Table(props) {
  const {
    handleFilter,
    showClosedCalls,
    filteredCalls,
    checkDescription,
    handleShowFollowUp,
    handleEditModal,
    handleReopenCall,
    handleCloseCall,
  } = props;

  function showOnGoingTime(parsedDate) {
    const currentDate = new Date();
    const callDate = new Date(parsedDate);

    return getTimeStringFromMs(currentDate - callDate);
  }

  function showTimeSpent(chamado) {
    const timeSpentinMs = chamado.finished - chamado.start;
    return getTimeStringFromMs(timeSpentinMs);
  }

  return (
    <table className=" bg-white h-auto w-[100%] overflow-x-scroll text-lg ">
      <thead>
        <tr className="bg-[#c4c4c4] text-white text-left">
          <th
            className="th"
            onClick={() => {
              handleFilter("id");
            }}
          >
            ID
          </th>
          <th
            className="th"
            onClick={() => {
              handleFilter("client");
            }}
          >
            Cliente
          </th>
          <th
            className="th"
            onClick={() => {
              handleFilter("start");
            }}
          >
            Data Inicial
          </th>
          <th
            className="th"
            onClick={() => {
              handleFilter("title");
            }}
          >
            Título
          </th>
          <th className="th">Descrição</th>
          <th className="th">Follow up</th>
          <th
            className="th"
            onClick={() => {
              handleFilter("priority");
            }}
          >
            Prioridade
          </th>
          <th
            className="th"
            onClick={() => {
              handleFilter("inCharge");
            }}
          >
            Responsável
          </th>
          {showClosedCalls ? <th className="th">Tempo Consumido</th> : ""}
          <th className="th"></th>
          {showClosedCalls ? "" : <th className="th"></th>}
        </tr>
      </thead>
      <tbody>
        {filteredCalls.map((chamado) => (
          <tr
            key={chamado.id}
            className="border-b border-[#dddddd] even:bg-gray-200 mb-4"
          >
            <td className="td">{chamado.id}</td>
            <td className="td">{chamado?.client}</td>
            <td className="td">{showOnGoingTime(chamado.start)}</td>
            <td className="td">{chamado.title}</td>
            <td
              onClick={() => checkDescription(chamado.description)}
              className="td cursor-pointer whitespace-nowrap truncate max-w-[350px]"
            >
              {chamado.description}
            </td>
            <td className="td">
              <button
                onClick={() => handleShowFollowUp(chamado)}
                className="btnDetails"
              >
                Detalhes
              </button>
            </td>
            <td className="td flex justify-around items-center ">
              {chamado.priority}{" "}
              {chamado.priority === "Alta" && (
                <Image
                  width={30}
                  height={30}
                  src="/High Priority.png"
                  alt="Alta"
                />
              )}
              {chamado.priority === "Média" && (
                <Image
                  width={30}
                  height={30}
                  src="/Medium Priority.png"
                  alt="Média"
                />
              )}
              {chamado.priority === "Baixa" && (
                <Image
                  width={30}
                  height={30}
                  src="/Low Priority.png"
                  alt="Baixa"
                />
              )}
            </td>
            <td className="td">{chamado.inCharge}</td>
            {showClosedCalls ? (
              <td className="td">{showTimeSpent(chamado)}</td>
            ) : (
              <td className="td">
                <button
                  onClick={() => handleEditModal(chamado)}
                  className="btnEdit"
                >
                  Editar
                </button>
              </td>
            )}
            <td className="td">
              {showClosedCalls ? (
                <button
                  onClick={() => handleReopenCall(chamado)}
                  className="btnReopenCall"
                >
                  Reabrir
                </button>
              ) : (
                <button
                  onClick={() => handleCloseCall(chamado)}
                  className="btnCloseCall"
                >
                  Finalizar
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
