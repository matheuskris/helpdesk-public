import { useRouter } from "next/router";
import { selectAllCalls } from "../src/store/callsSlicer/calls.selector";
import { useSelector } from "react-redux";
import TramiteInfo from "../src/components/TramiteInfo";
import TramiteModal from "../src/components/TramiteModal";
import { useEffect, useState } from "react";
import { proceduresListener } from "../src/utils/firebase.utils";
import { editExistingCall } from "../src/utils/firebase.utils";
import EditTramiteModal from "../src/components/editTramiteModal";

export default function CallDetails(props) {
  const router = useRouter();
  const [isModalOpen, setModal] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tramiteCallToEdit, setTramiteCallToEdit] = useState({});
  const [tramiteToEdit, setTramiteToEdit] = useState({});

  const callId = router.query.id;

  const [proceduresCall, setProceduresCall] = useState({});

  const openTramiteModal = () => {
    setModal(true);
  };

  const handleEditTramite = (tramite) => {
    setIsEditModalOpen(true);
    setTramiteCallToEdit(proceduresCall);
    setTramiteToEdit(tramite);
  };

  const transformObjectToArray = (object) => {
    const newArray = [];
    for (const prop in object) {
      newArray.push(object[prop]);
    }
    return newArray;
  };

  useEffect(() => {
    const setUseStateCall = (newCall) => {
      setProceduresCall(newCall);
    };
    proceduresListener(setUseStateCall, callId);
  }, [callId]);

  const tramites = transformObjectToArray(proceduresCall?.tramites);
  tramites.reverse();
  async function handleCloseTramite(tramite) {
    const newDate = new Date();
    const sendDate = Date.parse(newDate);
    const objectToSend = {
      ...proceduresCall,
      tramites: {
        ...proceduresCall.tramites,
        [tramite.id]: {
          ...tramite,
          finished: sendDate,
        },
      },
    };

    await editExistingCall(objectToSend, proceduresCall.id);
  }

  return (
    <div className="p-6">
      {/* Call Infos */}
      <div className="bg-gray-300 p-6 rounded-lg">
        <div className="flex justify-between">
          <h1 className="text-4xl">
            <strong>Chamado: </strong>
            {callId || ""}
          </h1>
          <button
            onClick={() => openTramiteModal()}
            className="bg-green-500 rounded-2xl px-3 py-2 text-lg cursor-pointer hover:bg-green-600 transition duration-150 active:scale-95"
          >
            Abrir um trâmite
          </button>
        </div>
        <h2 className="text-2xl">
          <strong>Cliente:</strong> {proceduresCall?.client}
        </h2>
        <p className="text-2xl">Descrição do chamado:</p>
        <p className=" text-lg">{proceduresCall?.description}</p>
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
        isModalOpen={isModalOpen}
        setModal={setModal}
      />
      <EditTramiteModal
        isEditModalOpen={isEditModalOpen}
        setEditModal={setIsEditModalOpen}
        editChamado={tramiteCallToEdit}
        editTramite={tramiteToEdit}
        setTramiteToEdit={setTramiteToEdit}
      />
    </div>
  );
}
