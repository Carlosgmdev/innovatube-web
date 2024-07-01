import { Alert, Button, Paper, TextField, Typography } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { useEffect } from "react"
import { ForgotForm, ForgotResponse } from "../../types/auth"
import throwFormErrors from "../../utils/FormErrorsHandling"
import useGlobalStore from "../../store/useGlobalStore"
import axios, { AxiosError } from "axios"
import { API_URL } from "../../config/constants"
import { toast } from "sonner"
import throwAxiosErros from "../../utils/AxiosErrorsHandling"

const Forgot = () => {
  const { setLoading } = useGlobalStore()
  const navigate = useNavigate()

  const loginSchema = z.object({ email: z.string().email({ message: 'Por favor, ingresa una dirección de correo válida' }) })

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: ForgotForm): Promise<void> => {
    setLoading(true)
    try {
      const res = await axios.post<ForgotResponse>(`${API_URL}/users/forgot`, data)
      const { emailSent } = res.data
      if (emailSent) {
        toast.success('Se ha enviado un enlace a tu correo electrónico para restablecer tu contraseña')
        navigate('/login')
      }
      
    } catch (err) {
      throwAxiosErros(err as AxiosError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => throwFormErrors(errors), [errors])

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      {/* Forgot Card */}
      <Paper
        sx={{
          padding: 4,
          boxShadow: '0 0 240px 20px rgba(245,21,135,0.76)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'center',
          width: 400,
        }}
      >
        <Typography variant='h5'>InnovaTube</Typography>
        <form
          className='w-full flex flex-col gap-4'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Typography variant='h6' textAlign='center'>Recuperar contraseña</Typography>
          <Alert severity='info'>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña</Alert>
          <TextField
            fullWidth
            label='Nombre de usuario o correo'
            variant='outlined'
            size='small'
            required
            {...register('email')}
            error={errors.email ? true : false}
          />
          <Button
            fullWidth
            variant='contained'
            color='primary'
            type='submit'
            onClick={handleSubmit(onSubmit)}
          >
            Enviar
          </Button>
        </form>

        <div className='flex flex-col items-center gap-1'>
          <Typography variant='body2'>
            ¿No tienes una cuenta? <Link to='/register' className='font-bold'>Regístrate</Link>
          </Typography>
          <Typography variant='body2'>
            ¿Olvidaste tu contraseña? <Link to='/forgot' className='font-bold'>Recupérala</Link>
          </Typography>
        </div>

      </Paper>

    </div>
  )
}

export default Forgot
