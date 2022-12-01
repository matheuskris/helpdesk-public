import TramiteInfo from "../TramiteInfo";
import TramiteModal from "../TramiteModal";
import EditTramiteModal from "../editTramiteModal";

import { useCallDetails } from "./useCallDetails";

export default function CallDetails() {
  const [
    isCreateTramiteModalOpen,
    setCreateTramiteModal,
    isEditModalOpen,
    setIsEditModalOpen,
    tramiteToEdit,
    setTramiteToEdit,
    proceduresCall,
    personsInProject,
    openTramiteModal,
    handleEditTramite,
    handleCloseTramite,
    goToCalls,
    tramites,
  ] = useCallDetails();

  return (
    <div className="p-6">
      {/* Call Infos */}
      <div className="flex flex-row justify-between bg-gray-300 p-6 rounded-lg">
        <div className="flex flex-col justify-between">
          <h1 className="text-4xl">
            <strong>Chamado: </strong>
            {proceduresCall?.id}
          </h1>
          <h2 className="text-2xl">
            <strong>Cliente:</strong> {proceduresCall?.client}
          </h2>
          <p className="text-2xl">Descrição do chamado:</p>
          <p className=" text-lg">{proceduresCall?.description}</p>
        </div>
        <div className="flex flex-col justify-between">
          <button
            onClick={openTramiteModal}
            className="bg-green-500 rounded-2xl px-3 py-2 text-lg cursor-pointer hover:bg-green-600 transition duration-150 active:scale-95"
          >
            Abrir um trâmite
          </button>
          <button
            onClick={goToCalls}
            className="bg-green-500 rounded-2xl px-3 py-2 text-lg cursor-pointer hover:bg-green-600 transition duration-150 active:scale-95"
          >
            Voltar para chamados
          </button>
        </div>
      </div>

      {/* Tramites Infos */}
      {tramites
        ? tramites.map((tramite) => (
            <TramiteInfo
              key={tramite.id}
              tramite={tramite}
              handleCloseTramite={handleCloseTramite}
              handleEditTramite={handleEditTramite}
            />
          ))
        : "Nenhum trâmite aberto"}
      <TramiteModal
        tramites={tramites}
        chamado={proceduresCall}
        isModalOpen={isCreateTramiteModalOpen}
        setModal={setCreateTramiteModal}
        persons={personsInProject}
      />
      <EditTramiteModal
        isEditModalOpen={isEditModalOpen}
        setEditModal={setIsEditModalOpen}
        editTramite={tramiteToEdit}
        setTramiteToEdit={setTramiteToEdit}
        persons={personsInProject}
        call={proceduresCall}
      />
    </div>
  );
}
