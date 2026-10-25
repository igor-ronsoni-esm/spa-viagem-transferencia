"use client";

import { useContext, useState } from "react";

import { ViagemOutput } from "@modules/domain/viagem/schemas/viagem.schema";
import { X } from "lucide-react";
import Header from "./Header";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import TabsViagem from "./TabsViagem";
import { ViagemProvider } from "./context/ViagemProvider";
import ApreentacaoTelas from "./ApreentacaoTelas";
import { ViagemContext } from "./context/ViagemContext";

type Props = {
  viagem: ViagemOutput;
};

export default function DetalheViagem({ viagem }: Readonly<Props>) {
  const metodos = useForm();
  const { handleSalvarEdicao } = useContext(ViagemContext);

  return (
    <div className="flex flex-1 flex-col">
      <Header viagem={viagem} />
      <ViagemProvider>
        <FormProvider {...metodos}>
          <form onSubmit={metodos.handleSubmit(handleSalvarEdicao)}>
            <TabsViagem viagem={viagem} />
            <ApreentacaoTelas viagem={viagem}/>
          </form>
        </FormProvider>
      </ViagemProvider>
    </div>
  );
}
