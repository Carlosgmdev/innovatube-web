import { Alert, Button, Paper, TextField, Typography } from "@mui/material"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { useEffect, useState } from "react"
import { RecoveryForm, RecoveryResponse, ValidateRecoveryHashResponse } from "../../types/auth"
import throwFormErrors from "../../utils/FormErrorsHandling"
import useGlobalStore from "../../store/useGlobalStore"
import axios, { AxiosError } from "axios"
import { API_URL } from "../../config/constants"
import { toast } from "sonner"
import throwAxiosErros from "../../utils/AxiosErrorsHandling"

const Recovery = () => {
  const { userId, recoveryHash } = useParams()
  const [isValidHash, setIsValidHash] = useState<boolean>(false)
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')
  const { setLoading } = useGlobalStore()
  const navigate = useNavigate()

  const loginSchema = z.object({ password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }) })

  const { register, handleSubmit, formState: { errors } } = useForm<RecoveryForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: RecoveryForm): Promise<void> => {
    if (data.password !== passwordConfirm) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    try {
      const requestData: RecoveryForm = {
        password: data.password,
        userId: userId as string,
        recoveryHash: recoveryHash as string
      }
      const res = await axios.post<RecoveryResponse>(`${API_URL}/users/recovery`, requestData)
      const { passwordChanged } = res.data
      if (passwordChanged) {
        toast.success('Contraseña cambiada exitosamente, ya puedes iniciar sesión.')
        navigate('/login')
      }
    } catch (err) {
      throwAxiosErros(err as AxiosError)
    } finally {
      setLoading(false)
    }
  }

  const validateRecoveryHash = async (): Promise<void> => {
    setLoading(true)
    try {
      const res = await axios<ValidateRecoveryHashResponse>(`${API_URL}/users/recovery/${userId}/${recoveryHash}`)
      const { valid } = res.data
      setIsValidHash(valid)
    } catch (err) {
      throwAxiosErros(err as AxiosError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    validateRecoveryHash()
  }, [userId, recoveryHash])

  useEffect(() => throwFormErrors(errors), [errors])

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      {/* Recovery Card */}
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
          <Typography variant='h6' textAlign='center'>Cambiar contraseña</Typography>
          {isValidHash
            ? <>
              <Alert severity='info'>Ingresa tu nueva contraseña</Alert>
              <TextField
                fullWidth
                label='Contraseña'
                variant='outlined'
                size='small'
                type='password'
                required
                error={errors.password ? true : false}
                {...register('password')}
              />
              <TextField
                fullWidth
                label='Confirmar contraseña'
                variant='outlined'
                size='small'
                type='password'
                required
                error={errors.password ? true : false}
                onChange={e => setPasswordConfirm(e.target.value)}
              />
              <Button
                fullWidth
                variant='contained'
                color='primary'
                type='submit'
                onClick={handleSubmit(onSubmit)}
              >
                Iniciar sesión
              </Button>
            </>
            : <Alert severity='error'>El enlace de recuperación es inválido</Alert>
          }
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

export default Recovery
