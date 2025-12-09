// Mock data for professionals and tramites

export type EstadoMatricula = 'activo' | 'inactivo' | 'en_revision' | 'suspendido';
export type EstadoSolicitud = 'pendiente' | 'en_revision' | 'observado' | 'aprobado' | 'rechazado';
export type EstadoDeuda = 'pagado' | 'pendiente';
export type TipoProfesional = 'licenciado' | 'tecnico' | 'otro';

export interface Profesional {
  id: string;
  nombre: string;
  dni: string;
  email: string;
  telefono: string;
  especialidad: string;
  matricula: string;
  estadoMatricula: EstadoMatricula;
  lugarTrabajo: string;
  cvPdfUrl?: string;
  tipo: TipoProfesional;
  createdAt: string;
}

export interface MatriculacionSolicitud {
  id: string;
  nombre: string;
  dni: string;
  email: string;
  telefono: string;
  especialidad: string;
  pdfUrl: string;
  estado: EstadoSolicitud;
  observaciones?: string;
  numeroMatriculaAsignado?: string;
  createdAt: string;
}

export interface Deuda {
  id: string;
  profesionalId: string;
  mes: string;
  monto: number;
  estado: EstadoDeuda;
  createdAt: string;
}

export interface ConstanciaSolicitud {
  id: string;
  profesionalId: string;
  estado: EstadoSolicitud;
  pdfFinalUrl?: string;
  createdAt: string;
}

export interface Factura {
  id: string;
  profesionalId: string;
  mes: string;
  pdfUrl: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  nombre: string;
  email: string;
  createdAt: string;
}

export const mockProfesionales: Profesional[] = [
  {
    id: "1",
    nombre: "María Elena García López",
    dni: "25789456",
    email: "maria.garcia@email.com",
    telefono: "+54 11 4567-8901",
    especialidad: "Antropología Social",
    matricula: "ANT-2024-001",
    estadoMatricula: "activo",
    lugarTrabajo: "Universidad Nacional de Buenos Aires",
    cvPdfUrl: "https://example.com/cv-maria.pdf",
    tipo: "licenciado",
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    nombre: "Carlos Alberto Rodríguez",
    dni: "30456789",
    email: "carlos.rodriguez@email.com",
    telefono: "+54 11 5678-9012",
    especialidad: "Antropología Forense",
    matricula: "ANT-2024-002",
    estadoMatricula: "activo",
    lugarTrabajo: "Instituto de Investigaciones Antropológicas",
    tipo: "licenciado",
    createdAt: "2024-02-10"
  },
  {
    id: "3",
    nombre: "Ana Lucía Fernández",
    dni: "28123456",
    email: "ana.fernandez@email.com",
    telefono: "+54 11 6789-0123",
    especialidad: "Antropología Cultural",
    matricula: "ANT-2023-015",
    estadoMatricula: "activo",
    lugarTrabajo: "Museo Nacional de Antropología",
    cvPdfUrl: "https://example.com/cv-ana.pdf",
    tipo: "licenciado",
    createdAt: "2023-06-20"
  },
  {
    id: "4",
    nombre: "Roberto Martín Pérez",
    dni: "32567890",
    email: "roberto.perez@email.com",
    telefono: "+54 11 7890-1234",
    especialidad: "Arqueología",
    matricula: "ANT-2024-003",
    estadoMatricula: "en_revision",
    lugarTrabajo: "Secretaría de Cultura",
    tipo: "tecnico",
    createdAt: "2024-03-01"
  },
  {
    id: "5",
    nombre: "Laura Patricia Gómez",
    dni: "27890123",
    email: "laura.gomez@email.com",
    telefono: "+54 11 8901-2345",
    especialidad: "Etnografía",
    matricula: "ANT-2022-008",
    estadoMatricula: "inactivo",
    lugarTrabajo: "Consultora Independiente",
    tipo: "licenciado",
    createdAt: "2022-11-15"
  },
  {
    id: "6",
    nombre: "Diego Alejandro Torres",
    dni: "33456789",
    email: "diego.torres@email.com",
    telefono: "+54 11 9012-3456",
    especialidad: "Antropología Médica",
    matricula: "ANT-2024-004",
    estadoMatricula: "activo",
    lugarTrabajo: "Hospital General",
    tipo: "tecnico",
    createdAt: "2024-01-28"
  }
];

export const mockMatriculacionSolicitudes: MatriculacionSolicitud[] = [
  {
    id: "1",
    nombre: "Juan Pablo Méndez",
    dni: "35678901",
    email: "juan.mendez@email.com",
    telefono: "+54 11 1234-5678",
    especialidad: "Antropología Visual",
    pdfUrl: "https://example.com/docs/solicitud-1.pdf",
    estado: "pendiente",
    createdAt: "2024-03-10"
  },
  {
    id: "2",
    nombre: "Sofía Beatriz Ramírez",
    dni: "34567890",
    email: "sofia.ramirez@email.com",
    telefono: "+54 11 2345-6789",
    especialidad: "Antropología Urbana",
    pdfUrl: "https://example.com/docs/solicitud-2.pdf",
    estado: "en_revision",
    observaciones: "Falta certificado de título legalizado",
    createdAt: "2024-03-05"
  },
  {
    id: "3",
    nombre: "Martín Eduardo Suárez",
    dni: "36789012",
    email: "martin.suarez@email.com",
    telefono: "+54 11 3456-7890",
    especialidad: "Arqueología",
    pdfUrl: "https://example.com/docs/solicitud-3.pdf",
    estado: "aprobado",
    numeroMatriculaAsignado: "ANT-2024-005",
    createdAt: "2024-02-20"
  }
];

export const mockDeudas: Deuda[] = [
  { id: "1", profesionalId: "1", mes: "2024-01", monto: 5000, estado: "pagado", createdAt: "2024-01-01" },
  { id: "2", profesionalId: "1", mes: "2024-02", monto: 5000, estado: "pagado", createdAt: "2024-02-01" },
  { id: "3", profesionalId: "1", mes: "2024-03", monto: 5500, estado: "pendiente", createdAt: "2024-03-01" },
  { id: "4", profesionalId: "2", mes: "2024-01", monto: 5000, estado: "pagado", createdAt: "2024-01-01" },
  { id: "5", profesionalId: "2", mes: "2024-02", monto: 5000, estado: "pendiente", createdAt: "2024-02-01" },
  { id: "6", profesionalId: "3", mes: "2024-03", monto: 5500, estado: "pendiente", createdAt: "2024-03-01" },
  { id: "7", profesionalId: "5", mes: "2023-12", monto: 4500, estado: "pendiente", createdAt: "2023-12-01" },
  { id: "8", profesionalId: "5", mes: "2024-01", monto: 5000, estado: "pendiente", createdAt: "2024-01-01" },
];

export const mockConstanciaSolicitudes: ConstanciaSolicitud[] = [
  { id: "1", profesionalId: "1", estado: "aprobado", pdfFinalUrl: "https://example.com/constancias/const-1.pdf", createdAt: "2024-03-01" },
  { id: "2", profesionalId: "2", estado: "pendiente", createdAt: "2024-03-12" },
  { id: "3", profesionalId: "3", estado: "aprobado", pdfFinalUrl: "https://example.com/constancias/const-3.pdf", createdAt: "2024-02-15" },
];

export const mockFacturas: Factura[] = [
  { id: "1", profesionalId: "1", mes: "2024-01", pdfUrl: "https://example.com/facturas/fact-1-01.pdf", createdAt: "2024-01-15" },
  { id: "2", profesionalId: "1", mes: "2024-02", pdfUrl: "https://example.com/facturas/fact-1-02.pdf", createdAt: "2024-02-15" },
  { id: "3", profesionalId: "2", mes: "2024-01", pdfUrl: "https://example.com/facturas/fact-2-01.pdf", createdAt: "2024-01-15" },
  { id: "4", profesionalId: "3", mes: "2024-03", pdfUrl: "https://example.com/facturas/fact-3-03.pdf", createdAt: "2024-03-15" },
];

export const mockAdminUsers: AdminUser[] = [
  { id: "1", nombre: "Administrador Principal", email: "admin@colegiodeantropologia.test", createdAt: "2024-01-01" },
];

// Helper functions
export const getProfesionalByDniMatricula = (dni: string, matricula: string): Profesional | undefined => {
  return mockProfesionales.find(p => p.dni === dni && p.matricula === matricula);
};

export const getProfesionalByDni = (dni: string): Profesional | undefined => {
  return mockProfesionales.find(p => p.dni === dni);
};

export const getDeudasByProfesional = (profesionalId: string): Deuda[] => {
  return mockDeudas.filter(d => d.profesionalId === profesionalId);
};

export const getFacturasByProfesional = (profesionalId: string): Factura[] => {
  return mockFacturas.filter(f => f.profesionalId === profesionalId);
};

export const getConstanciaByProfesional = (profesionalId: string): ConstanciaSolicitud | undefined => {
  return mockConstanciaSolicitudes.find(c => c.profesionalId === profesionalId);
};

export const getMatriculacionByDni = (dni: string): MatriculacionSolicitud | undefined => {
  return mockMatriculacionSolicitudes.find(m => m.dni === dni);
};
