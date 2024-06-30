import { toast } from "sonner";
import { ApiError } from "../types/api";
import { AxiosError } from "axios";

const throwAxiosErros = (error: AxiosError): void => {
  if (error.code === 'ERR_BAD_REQUEST') {
    const errors = error.response?.data?.errors as ApiError[]
    errors.forEach(err => { toast.error(err.message) })
    return
  }
  if (error.code === 'ERR_NETWORK') {
    toast.error('No se pudo conectar al servidor, por favor, intenta de nuevo más tarde.')
    return
  }
  toast.error('Ocurrió un error inesperado, por favor, intenta de nuevo más tarde.')
}

export default throwAxiosErros