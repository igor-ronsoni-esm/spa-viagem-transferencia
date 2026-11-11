import { Loading } from "@modules/components/feedbacks/loading/Loading";

type Props = {
  texto: string;
}

export default function LoadingViagem({ texto }: Readonly<Props>) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <Loading />
      <p>{texto}</p>
    </div>
  );
}