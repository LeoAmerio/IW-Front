'use client'
import { ReportsTable } from "@/components/reports/report-table"
import { Report } from "@/interfaces/types";
import { useQuery } from "react-query"
import Cookies from "js-cookie"
import ReportsApi from "@/api/reports.api";
import { BackButton } from "@/components/ui/BackButton";

const fetchReports2 = async () => {
  const { data } = await ReportsApi.getReports();
  return data;
};

export default function ReportsPage() {
  const { data: reports = [] } = useQuery(['reports'], fetchReports2)

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <BackButton href="/dashboard" />
        <h1 className="text-3xl font-bold ml-2">Gestión de Denuncias</h1>
      </div>
      <ReportsTable initialReports={reports} />
    </div>
  )
}

// // This would be replaced with an actual API call
// async function fetchReports(): Promise<Report[]> {
//   // Simulating API call
//   return [
//     {
//       id: 1,
//       denunciante: {
//         id: 4,
//         email: "leoame99@gmail.com",
//         nombre: "Leonardo",
//         apellido: "Amerio",
//         rol_info: {
//           id: 2,
//           rol: "Colaborador",
//         },
//         is_active: true,
//         is_staff: false,
//         edificio: {
//           id: 1,
//           nombre: "Piedras Blancas",
//           direccion: "Belgrano",
//           numero: 550,
//           ciudad: "Rafaela",
//         },
//         piso: 1,
//         numero: "B",
//       },
//       tipo: "spam",
//       usuario_denunciado: null,
//       posteo_denunciado: {
//         id: 1,
//         titulo: "Ruidos!",
//         descripcion:
//           "Quisiera manifestar una queja debido al constante ruido de taladro que ha estado ocurriendo en el edificio. Esta situación genera molestias importantes, especialmente en horarios en los que muchos residentes estamos en casa. Agradecería si pudieran revisar el tema y coordinar estos trabajos en horarios que afecten lo menos posible la tranquilidad de todos",
//         usuario: {
//           id: 3,
//           nombre: "Pedro",
//           apellido: "Rodriguez",
//           piso: 1,
//           numero: "C",
//         },
//         tipo_posteo: {
//           id: 3,
//           tipo: "Reclamo",
//         },
//         imagen: "https://contenedor-bucket.s3.amazonaws.com/posteos/taladroPersona_rgyTwGK.jpg",
//         fecha_creacion_legible: "31 de marzo de 2025 a las 15:19",
//         respuestas: [],
//       },
//       evento_denunciado: null,
//       comentario: "aaaa",
//       fecha_creacion: "2025-04-05T00:17:12.506058-03:00",
//       estado: "pendiente",
//     },
//   ]
// }

