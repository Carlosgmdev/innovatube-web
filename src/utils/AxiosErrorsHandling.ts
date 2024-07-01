import { toast } from "sonner";
import { ApiError } from "../types/api";
import { AxiosError } from "axios";

const throwAxiosErros = (error: AxiosError<unknown>): void => {
  if (error.code === 'ERR_BAD_REQUEST') {
    const responseData = error.response?.data;
    if (responseData && typeof responseData === 'object') {
      const errors = (responseData as { errors?: ApiError[] }).errors;
      if (errors && Array.isArray(errors)) {
        errors.forEach(err => {
          if (err && err.message) {
            toast.error(err.message);
          } else {
            toast.error('Error de formato en los errores recibidos.');
          }
        });
      } else {
        toast.error('No se encontraron errores detallados en la respuesta.');
      }
    } else {
      toast.error('Respuesta de servidor inválida.');
    }
    return;
  }
  if (error.code === 'ERR_NETWORK') {
    toast.error('No se pudo conectar al servidor, por favor, intenta de nuevo más tarde.');
    return;
  }
  toast.error('Ocurrió un error inesperado, por favor, intenta de nuevo más tarde.');
};

export default throwAxiosErros;
