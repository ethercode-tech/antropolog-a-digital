// import { Card, CardContent } from "@/components/ui/card";

// export default function Honorarios() {
//   return (
//     <div className="animate-fade-in">
//       {/* Header */}
//       <section className="bg-secondary py-16 md:py-24">
//         <div className="container-main">
//           <h1 className="section-title text-center">
//             Honorarios orientativos
//           </h1>
//           <p className="section-subtitle text-center max-w-2xl mx-auto">
//             Valores de referencia para el ejercicio profesional de la
//             antropología en la provincia de Jujuy.
//           </p>
//         </div>
//       </section>

//       {/* Content */}
//       <section className="py-16 md:py-24">
//         <div className="container-main">
//           <div className="max-w-4xl mx-auto">

//             {/* Valor base */}
//             <Card className="mb-8">
//               <CardContent className="p-8 md:p-10">
//                 <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
//                   Valor Honorario Profesional (VHP)
//                 </h2>

//                 <p className="text-muted-foreground leading-relaxed mb-4">
//                   El Valor Honorario Profesional (VHP) constituye la unidad de
//                   referencia utilizada para estimar los honorarios mínimos
//                   orientativos para la actividad profesional de la antropología
//                   en la provincia.
//                 </p>

//                 <p className="text-muted-foreground leading-relaxed mb-4">
//                   Valor vigente de referencia (diciembre 2025):
//                 </p>

//                 <p className="text-3xl font-bold text-primary mb-2">
//                   $31.890
//                 </p>

//                 <p className="text-sm text-muted-foreground">
//                   Este valor puede ser actualizado periódicamente por el Colegio
//                   según criterios institucionales.
//                 </p>
//               </CardContent>
//             </Card>

//             {/* Consultas profesionales */}
//             <Card className="mb-8">
//               <CardContent className="p-8 md:p-10">
//                 <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
//                   Consultas profesionales
//                 </h2>

//                 <div className="space-y-3 text-muted-foreground">
//                   <p>
//                     Persona física — consulta verbal: <strong>$159.450</strong>
//                   </p>
//                   <p>
//                     Persona física — consulta escrita: <strong>$255.120</strong>
//                   </p>
//                   <p>
//                     Persona jurídica — consulta verbal: <strong>$191.340</strong>
//                   </p>
//                   <p>
//                     Persona jurídica — consulta escrita: <strong>$287.010</strong>
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Trabajo profesional */}
//             <Card className="mb-8">
//               <CardContent className="p-8 md:p-10">
//                 <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
//                   Trabajo profesional
//                 </h2>

//                 <div className="space-y-3 text-muted-foreground">
//                   <p>
//                     Trabajo en gabinete / oficina — por hora:{" "}
//                     <strong>$31.890</strong>
//                   </p>

//                   <p>
//                     Trabajo en gabinete / oficina — jornada completa:{" "}
//                     <strong>$255.120</strong>
//                   </p>

//                   <p>
//                     Relevamiento fuera de oficina — por hora:{" "}
//                     <strong>$35.079</strong>
//                   </p>

//                   <p>
//                     Relevamiento fuera de oficina — jornada completa:{" "}
//                     <strong>$280.632</strong>
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Zonas desfavorables */}
//             <Card className="mb-8">
//               <CardContent className="p-8 md:p-10">
//                 <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
//                   Zonas desfavorables
//                 </h2>

//                 <p className="text-muted-foreground leading-relaxed mb-4">
//                   En trabajos realizados fuera del área urbana de San Salvador
//                   de Jujuy pueden aplicarse adicionales por zona desfavorable.
//                   Estas zonas se clasifican según distancia y condiciones de
//                   accesibilidad del territorio.
//                 </p>

//                 <ul className="list-disc pl-6 text-muted-foreground space-y-2">
//                   <li>Zona desfavorable baja</li>
//                   <li>Zona desfavorable media</li>
//                   <li>Zona desfavorable alta</li>
//                 </ul>
//               </CardContent>
//             </Card>

//             {/* Aclaración institucional */}
//             <Card className="mb-8">
//               <CardContent className="p-8 md:p-10">
//                 <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
//                   Carácter orientativo
//                 </h2>

//                 <p className="text-muted-foreground leading-relaxed">
//                   Los honorarios aquí presentados constituyen valores mínimos
//                   orientativos para el ejercicio profesional de la antropología.
//                   Los montos pueden variar según la complejidad del trabajo,
//                   la duración de la intervención, el contexto territorial y
//                   las condiciones particulares de cada proyecto o servicio
//                   profesional.
//                 </p>
//               </CardContent>
//             </Card>

//             {/* Documentos */}
//             <Card>
//               <CardContent className="p-8 md:p-10">
//                 <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
//                   Documentos de referencia
//                 </h2>

//                 <p className="text-muted-foreground mb-4">
//                   Para mayor detalle pueden consultarse los documentos
//                   institucionales que establecen estos criterios de honorarios.
//                 </p>

//                 <div className="space-y-2">
//                   <a
//                     href="/documentos/balance-2025.pdf"
//                     target="_blank"
//                     className="text-primary hover:underline block"
//                   >
//                     Descargar referencia de honorarios 2025
//                   </a>

//                   <a
//                     href="/documentos/balance-2023.pdf"
//                     target="_blank"

//                     className="text-primary hover:underline block"
//                   >
//                     Documento de referencia 2023
//                   </a>

//                   <a
//                     href="/documentos/balance-2022.pdf"
//                     target="_blank"

//                     className="text-primary hover:underline block"
//                   >
//                     Documento de referencia 2022
//                   </a>
//                 </div>
//               </CardContent>
//             </Card>

//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

import { Card, CardContent } from "@/components/ui/card";

export default function Honorarios() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container-main">
          <h1 className="section-title text-center">
            Referencia de Honorarios
          </h1>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            El monto de los honorarios profesionales es un
            valor de referencia que establece el CGAJ para
            cobrar una jornada laboral denominado Valor
            Honorario Profesional (VHP)
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">

            {/* Valor base */}
            <Card className="mb-8">
              <CardContent className="p-8 md:p-10">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                  Valor Honorario Profesional (VHP)
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  El monto de los honorarios profesionales es un valor de referencia que establece el CGAJ para cobrar una jornada laboral.
                </p>
                <p className="text-3xl font-bold text-primary mb-2">
                  VHP: $31.890
                </p>
                <p className="text-sm text-muted-foreground italic">
                  Este VHP se establece como una base mínima que el/la Antropólogo/a debe cobrar.
                </p>
              </CardContent>
            </Card>

            {/* Consultas profesionales de Grado */}
            <Card className="mb-8">
              <CardContent className="p-8 md:p-10">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
                  Consultas de profesionales de Grado
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>Consulta persona física verbal: <strong>$159.450</strong> </p>
                  <p>Consulta persona física escrita: <strong>$255.120</strong> </p>
                  <p>Consulta persona jurídica verbal: <strong>$191.340</strong> </p>
                  <p>Consulta persona jurídica escrita: <strong>$287.010</strong> </p>
                </div>
              </CardContent>
            </Card>

            {/* Trabajo de Campo - Profesionales de Grado */}
            <Card className="mb-8">
              <CardContent className="p-8 md:p-10">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
                  Trabajo de Campo (Título de Grado)
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <p className="font-semibold text-foreground">Trabajo de oficina o gabinete:</p>
                    <p>Por hora: <strong>$31.890</strong> | Jornada (8hs): <strong>$255.120</strong> </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Relevamiento fuera de oficina:</p>
                    <p>Por hora: <strong>$35.079</strong> | Jornada (8hs): <strong>$280.632</strong></p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground underline">Fuera de oficina por zona desfavorable:</p>
                    <p><strong>Baja:</strong> $38.268 (hora) / $306.144 (jornada) </p>
                    <p><strong>Media:</strong> $39.862,5 (hora) / $318.950 (jornada) </p>
                    <p><strong>Alta:</strong> $41.457 (hora) / $331.356 (jornada)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trabajo de Campo - Auxiliares Técnicos */}
            <Card className="mb-8">
              <CardContent className="p-8 md:p-10">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
                  Trabajo de Campo (Auxiliares Técnicos)
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <p className="font-semibold text-foreground">Trabajo de oficina o gabinete:</p>
                    <p>Por hora: <strong>$19.134</strong> | Jornada (8hs): <strong>$153.072</strong> </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Relevamiento fuera de oficina:</p>
                    <p>Por hora: <strong>$21.047,4</strong> | Jornada (8hs): <strong>$168.379</strong> </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground underline">Fuera de oficina por zona desfavorable:</p>
                    <p><strong>Baja:</strong> $22.960,8 (hora) / $183.686,4 (jornada) </p>
                    <p><strong>Media:</strong> $23.917,5 (hora) / $191.340 (jornada) </p>
                    <p><strong>Alta:</strong> $24.874,2 (hora) / $198.993,6 (jornada) </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Aclaración institucional */}
            <Card className="mb-8 border-primary/20 bg-primary/5">
              <CardContent className="p-8 md:p-10">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                  Aclaraciones Importantes
                </h2>
                <p className="text-destructive leading-relaxed italic">
                  "De acuerdo a las características particulares del trabajo que se realizará, este monto puede aumentar, quedando a criterio del/de la profesional establecer el valor final para la ejecución de las tareas implicadas".
                </p>
              </CardContent>
            </Card>

            {/* Documentos */}
            <Card>
              <CardContent className="p-8 md:p-10">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                  Documentos de referencia
                </h2>
                <div className="space-y-2">
                  <a
                    href="/documentos/balance-2025.pdf"
                    target="_blank"
                    className="text-primary hover:underline block font-medium"
                  >
                    Descargar Referencia de Honorarios (Diciembre 2025)
                  </a>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
}