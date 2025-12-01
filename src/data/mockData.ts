// Mock data for the Colegio de Antropología website

export interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  imageUrl?: string;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  publishedAt: string;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  altText: string;
  position: number;
}

export const mockNews: News[] = [
  {
    id: "1",
    title: "Jornadas de Antropología Social 2024",
    content: `El Colegio de Antropología tiene el agrado de anunciar las Jornadas de Antropología Social 2024, un evento académico que reunirá a profesionales, investigadores y estudiantes de toda la región.

Durante tres días intensivos, se presentarán ponencias, mesas redondas y talleres sobre las temáticas más relevantes de la disciplina antropológica contemporánea.

Los ejes temáticos incluyen:
- Antropología urbana y procesos de transformación social
- Patrimonio cultural y comunidades locales
- Metodologías etnográficas en contextos digitales
- Antropología médica y sistemas de salud

Las inscripciones estarán abiertas a partir del 15 de marzo. Se entregarán certificados de asistencia y participación.`,
    excerpt: "El Colegio de Antropología tiene el agrado de anunciar las Jornadas de Antropología Social 2024, un evento académico que reunirá a profesionales...",
    publishedAt: "2024-03-01",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop"
  },
  {
    id: "2",
    title: "Nuevo convenio con universidades latinoamericanas",
    content: `Nos complace informar que el Colegio de Antropología ha firmado un importante convenio de colaboración académica con diversas universidades de América Latina.

Este acuerdo permitirá el intercambio de profesionales, la realización de investigaciones conjuntas y la organización de eventos académicos internacionales.

Las instituciones participantes incluyen universidades de México, Colombia, Perú, Chile y Argentina, fortaleciendo así la red de antropólogos profesionales de la región.

El convenio entrará en vigencia a partir del próximo semestre académico.`,
    excerpt: "Nos complace informar que el Colegio de Antropología ha firmado un importante convenio de colaboración académica con diversas universidades...",
    publishedAt: "2024-02-15",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop"
  },
  {
    id: "3",
    title: "Convocatoria: Revista de Estudios Antropológicos",
    content: `La Revista de Estudios Antropológicos del Colegio abre su convocatoria permanente para la recepción de artículos, ensayos y reseñas bibliográficas.

Invitamos a los colegiados y a la comunidad académica en general a enviar sus contribuciones siguiendo las normas editoriales disponibles en nuestra página web.

Los trabajos serán sometidos a evaluación por pares ciegos y los seleccionados serán publicados en los próximos números de la revista.

Fecha límite para el próximo número: 30 de abril de 2024.`,
    excerpt: "La Revista de Estudios Antropológicos del Colegio abre su convocatoria permanente para la recepción de artículos, ensayos y reseñas...",
    publishedAt: "2024-02-01",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop"
  },
  {
    id: "4",
    title: "Taller de Etnografía Digital",
    content: `El próximo mes se realizará el Taller de Etnografía Digital, dirigido a profesionales interesados en las nuevas metodologías de investigación antropológica en entornos virtuales.

El taller abordará técnicas de observación participante en redes sociales, análisis de comunidades digitales y consideraciones éticas en la investigación online.

Cupos limitados. Inscripciones abiertas para colegiados activos.`,
    excerpt: "El próximo mes se realizará el Taller de Etnografía Digital, dirigido a profesionales interesados en las nuevas metodologías...",
    publishedAt: "2024-01-20",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop"
  },
  {
    id: "5",
    title: "Asamblea General Ordinaria 2024",
    content: `Se convoca a todos los colegiados a la Asamblea General Ordinaria que se llevará a cabo el día 15 de febrero de 2024 a las 18:00 horas en la sede del Colegio.

Orden del día:
1. Lectura y aprobación del acta anterior
2. Informe de la Junta Directiva
3. Informe financiero 2023
4. Plan de actividades 2024
5. Elección de nuevos miembros de comisiones
6. Asuntos varios

Se requiere quórum reglamentario para la toma de decisiones.`,
    excerpt: "Se convoca a todos los colegiados a la Asamblea General Ordinaria que se llevará a cabo el día 15 de febrero de 2024...",
    publishedAt: "2024-01-10"
  }
];

export const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Código de Ética Profesional",
    description: "Documento que establece los principios éticos y normas de conducta para el ejercicio profesional de la antropología.",
    fileUrl: "https://example.com/codigo-etica.pdf",
    publishedAt: "2023-06-15"
  },
  {
    id: "2",
    title: "Reglamento Interno del Colegio",
    description: "Normativa que rige el funcionamiento interno del Colegio de Antropología.",
    fileUrl: "https://example.com/reglamento.pdf",
    publishedAt: "2023-05-01"
  },
  {
    id: "3",
    title: "Memoria Anual 2023",
    description: "Informe de actividades, logros y estados financieros del año 2023.",
    fileUrl: "https://example.com/memoria-2023.pdf",
    publishedAt: "2024-01-30"
  },
  {
    id: "4",
    title: "Guía de Ejercicio Profesional",
    description: "Manual con orientaciones para el ejercicio ético y competente de la profesión antropológica.",
    fileUrl: "https://example.com/guia-ejercicio.pdf",
    publishedAt: "2023-09-10"
  },
  {
    id: "5",
    title: "Estatutos del Colegio",
    description: "Documento fundacional que establece la naturaleza, fines y estructura del Colegio de Antropología.",
    fileUrl: "https://example.com/estatutos.pdf",
    publishedAt: "2020-03-15"
  }
];

export const mockGalleryImages: GalleryImage[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop",
    altText: "Conferencia de Antropología 2023",
    position: 1
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1559223607-180d0c16c333?w=600&h=400&fit=crop",
    altText: "Trabajo de campo etnográfico",
    position: 2
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=400&fit=crop",
    altText: "Seminario de metodología",
    position: 3
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&h=400&fit=crop",
    altText: "Reunión de colegiados",
    position: 4
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=600&h=400&fit=crop",
    altText: "Exposición de investigaciones",
    position: 5
  },
  {
    id: "6",
    imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop",
    altText: "Ceremonia de incorporación",
    position: 6
  },
  {
    id: "7",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop",
    altText: "Taller de formación continua",
    position: 7
  },
  {
    id: "8",
    imageUrl: "https://images.unsplash.com/photo-1558008258-3256797b43f3?w=600&h=400&fit=crop",
    altText: "Encuentro interinstitucional",
    position: 8
  }
];

export const services = [
  {
    id: "1",
    title: "Ejercicio Profesional",
    description: "Orientación y respaldo para el ejercicio ético y competente de la profesión antropológica. Incluye certificación, habilitación profesional y asesoría legal.",
    icon: "Briefcase"
  },
  {
    id: "2",
    title: "Formación Continua",
    description: "Programas de actualización, cursos, talleres y seminarios para el desarrollo profesional permanente de los colegiados.",
    icon: "GraduationCap"
  },
  {
    id: "3",
    title: "Actividades Académicas",
    description: "Organización de congresos, jornadas, conferencias y eventos que promueven el debate y la difusión del conocimiento antropológico.",
    icon: "BookOpen"
  },
  {
    id: "4",
    title: "Investigación",
    description: "Promoción y apoyo a proyectos de investigación aplicada que contribuyan al desarrollo de la disciplina y al bienestar social.",
    icon: "Search"
  },
  {
    id: "5",
    title: "Publicaciones",
    description: "Edición de revistas, libros y materiales académicos que difunden el trabajo de los antropólogos profesionales.",
    icon: "FileText"
  },
  {
    id: "6",
    title: "Vinculación Institucional",
    description: "Convenios y alianzas con universidades, organismos públicos y organizaciones de la sociedad civil para fortalecer la profesión.",
    icon: "Users"
  }
];

export const usefulLinks = [
  { title: "Ministerio de Cultura", url: "#" },
  { title: "Universidad Nacional", url: "#" },
  { title: "Consejo Latinoamericano de Ciencias Sociales", url: "#" },
  { title: "Asociación Latinoamericana de Antropología", url: "#" },
  { title: "Museo Nacional de Antropología", url: "#" }
];
