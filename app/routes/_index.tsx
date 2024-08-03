import { useRootContext } from "remix-provider";

export default function Index() {
  // Get the value distributed to clients.
  const value = useRootContext();
  return <div className="whitespace-pre">{JSON.stringify(value, null, 2)}</div>;
}
