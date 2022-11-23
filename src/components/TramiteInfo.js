import { getBeatyDate } from "../utils/functions.utils";

function TramiteInfo({ tramite, handleCloseTramite, handleEditTramite }) {
  const { id, title, description, inCharge, start, finished } = tramite;
  return (
    <div className="px-16 py-14 space-y-1">
      <p>
        Id: <strong>{id}</strong>
      </p>
      <p>
        Responsável: <strong>{inCharge}</strong>
      </p>
      <p>Início: {getBeatyDate(start)}</p>
      {finished ? <p>Finalizado: {getBeatyDate(finished)}</p> : ""}

      <div className="w-full h-full">
        <div className="flex items-center justify-between">
          <h2 className="mt-8 font-semibold text-lg">
            <strong className="tracking-wide">Título do trâmite:</strong>{" "}
            {title}
          </h2>
          <div className="flex justify-between items-center">
            <button
                  onClick={() => handleEditTramite(tramite)}
                  className="px-3 py-2 mx-4 rounded-xl bg-yellow-400 hover:bg-yellow-500 transition duration-150 active:scale-95"
                >
                  Editar Tramite
                </button>
            {finished ? (
                ''
            ) : (
              <button
                  onClick={() => handleCloseTramite(tramite)}
                  className="px-3 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition duration-150 active:scale-95"
                >
                  Finalizar trâmite
                </button>
            )}{" "}
          </div>
        </div>
        <p className="mt-1">{description}</p>
      </div>

      <div className="w-full border-b-2 pt-2 border-black" />
    </div>
  );
}

export default TramiteInfo;
