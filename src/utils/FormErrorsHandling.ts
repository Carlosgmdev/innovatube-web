import { FieldErrors } from "react-hook-form";
import { toast } from "sonner";

const throwFormErrors = (errors: FieldErrors): void => {
  if (Object.entries(errors).length) {
    Object.entries(errors).forEach(([ key, value ]) => {
      console.log(key)
      toast.error(value!.message as string)
    })
  }
}

export default throwFormErrors