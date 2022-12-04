import * as React from "react";
import * as Toast from "@radix-ui/react-toast";
import Image from "next/image";

export default function InviteMessageToast({ status, info, open, setOpen }) {
  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className="bg-white rounded-md shadow p-4 flex flex-col toast-animations"
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className="mb-1 font-medium text-base">
          Status:
        </Toast.Title>
        <Toast.Description className="flex items-center gap-6">
          <div className="text-gray-500">{info.message}</div>
          {info.status === "ok" ? (
            <Image src={"/okok.png"} height={32} width={32} alt="ok icon" />
          ) : (
            <Image src={"/cross.png"} height={32} width={32} alt="ok icon" />
          )}
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport className="p-6 absolute bottom-0 right-0 flex flex-col gap-2 w-96 z-50" />
    </Toast.Provider>
  );
}
