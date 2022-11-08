import { getBeatyDate, getTimeStringFromMs } from "../utils/functions.utils";
import Image from "next/image";
import PersonsCard from "./PersonsCard";

function Table(props) {
  const {
    handleFilter,
    showClosedCalls,
    filteredCalls,
    checkDescription,
    handleShowTramites,
    handleEditModal,
    handleReopenCall,
    handleCloseCall,
    totalTime,
  } = props;

  function showOnGoingTime(parsedDate) {
    const currentDate = new Date();
    const callDate = new Date(parsedDate);

    return getTimeStringFromMs(currentDate - callDate);
  }

  // Function time open
  function showTimeOpen(chamado) {
    const timeSpentinMs = chamado.finished - chamado.start;
    return getTimeStringFromMs(timeSpentinMs);
  }
  // function time spent
  function showTimeSpent(chamado) {
    let time = 0;
    const tramcham = chamado.tramites;
    for (const prop in tramcham) {
      if (tramcham[prop].finished) {
        time = time + tramcham[prop].finished - tramcham[prop].start;
      }
    }

    const hora = parseInt((time / 3600000));
    const min = ((time % 3600000) / 60000).toFixed(0) + "min";

    if (hora < 1) {
      return min;
    } else {
      return `${hora}hr ${min}`;
    }
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
            Data de Abertura
          </th>
          {showClosedCalls ? (
            <th
              className="th"
              onClick={() => {
                handleFilter("start");
              }}
            >
              Data de fechamento
            </th>
          ) : (
            ""
          )}

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
          <th className="th">Tempo consumido</th>
          {showClosedCalls ? <th className="th">Tempo em aberto</th> : ""}
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
            <td className="td">{getBeatyDate(chamado.start)}</td>
            {showClosedCalls ? (
              <td className="td">{getBeatyDate(chamado.finished)}</td>
            ) : (
              ""
            )}
            <td className="td">{chamado.title}</td>
            <td
              onClick={() => checkDescription(chamado.description)}
              className="td cursor-pointer whitespace-nowrap truncate max-w-[250px]"
            >
              {chamado.description}
            </td>
            <td className="td">
              <button
                onClick={() => handleShowTramites(chamado)}
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
            <td className="td">
              <PersonsCard totalTime={totalTime} inCharge={chamado.inCharge} />
            </td>

            <td className="td">{showTimeSpent(chamado)}</td>

            {showClosedCalls ? (
              <td className="td">{showTimeOpen(chamado)}</td>
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
