import { HttpErrorResponse } from '@angular/common/http';

export interface ErrorInfo {
  status: number;
  titulo: string;
  mensaje: string;
  campos: Record<string, string>;
}

const MENSAJES: Record<number, { titulo: string; mensaje: string }> = {
  0: { titulo: 'Sin conexión', mensaje: 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.' },
  400: { titulo: 'Datos inválidos (400)', mensaje: 'La solicitud contiene datos inválidos.' },
  401: { titulo: 'Sesión no válida (401)', mensaje: 'Tu sesión expiró o las credenciales son incorrectas.' },
  403: { titulo: 'Acceso denegado (403)', mensaje: 'No tienes permisos para realizar esta acción.' },
  404: { titulo: 'No encontrado (404)', mensaje: 'El recurso solicitado no existe.' },
  409: { titulo: 'Conflicto (409)', mensaje: 'El registro ya existe o está relacionado con otros datos.' },
  500: { titulo: 'Error del servidor (500)', mensaje: 'Ocurrió un error inesperado en el servidor.' },
};

/** Convierte un error HTTP en un título y mensaje claros para el usuario. */
export function describirError(err: unknown): ErrorInfo {
  const e = err as HttpErrorResponse;
  const status = e?.status ?? 0;
  const cuerpo = e?.error && typeof e.error === 'object' ? e.error : {};
  const base =
    MENSAJES[status] ??
    (status >= 500 ? MENSAJES[500] : { titulo: `Error ${status}`, mensaje: 'Ocurrió un error inesperado.' });

  const campos: Record<string, string> = cuerpo.fieldErrors || {};
  const detalle = Object.values(campos).join('. ');
  const mensaje = detalle
    ? `${cuerpo.message || base.mensaje}: ${detalle}`
    : cuerpo.message || base.mensaje;

  return { status, titulo: base.titulo, mensaje, campos };
}