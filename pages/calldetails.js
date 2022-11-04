import { useRouter } from "next/router";
import { selectAllCalls } from "../src/store/callsSlicer/calls.selector";
import { useSelector } from "react-redux";

export default function CallDetails() {
  const router = useRouter();
  const selectCalls = useSelector(selectAllCalls);
  const callId = router.query.id;

  console.log(selectCalls[callId]);

  return <div>Hello world {callId}</div>;
}
