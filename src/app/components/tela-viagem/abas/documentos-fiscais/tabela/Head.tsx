export default function TabelaHead() {
  return (
    <thead>
      <tr className="bg-gray-50/50 border-b border-gray-100 select-none">
        <th className="w-[16%] px-3 py-2.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
          Documento
        </th>
        <th className="w-[16%] px-3 py-2.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
          Situação
        </th>
        <th className="w-[18%] px-3 py-2.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
          Número
        </th>
        <th className="w-[20%] px-3 py-2.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
          Geração
        </th>
        <th className="w-[20%] px-3 py-2.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
          Retorno
        </th>
        <th className="w-[10%] px-3 py-2.5 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right pr-4">
          Ações
        </th>
      </tr>
    </thead>
  );
}
