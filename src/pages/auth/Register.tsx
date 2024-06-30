import { Button, IconButton, Paper, TextField, Tooltip, Typography } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { useEffect, useState } from "react"
import { RegisterForm, User } from "../../types/auth"
import throwFormErrors from "../../utils/FormErrorsHandling"
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone'
import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone'
import useGlobalStore from "../../store/useGlobalStore"
import axios, { AxiosError } from "axios"
import { API_URL } from "../../config/constants"
import throwAxiosErros from "../../utils/AxiosErrorsHandling"
import useAuthStore from "../../store/useAuthStore"
import { toast } from "sonner"

const Register = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const { setLoading } = useGlobalStore()
  const { setUser } = useAuthStore()
  const navigate = useNavigate()

  const loginSchema = z.object({
    firstName: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
    lastName: z.string().min(2, { message: 'El apellido debe tener al menos 2 caracteres' }),
    email: z.string().email({ message: 'Por favor, ingresa una dirección de correo válida' }),
    password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
    username: z.string().min(6, { message: 'El nombre de usuario debe tener al menos 6 caracteres' })
  })
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    try {
      const res = await axios.post<User>(`${API_URL}/users/register`, data)
      setUser(res.data)
      window.localStorage.setItem('user', JSON.stringify(res.data))
      toast.success(`Bienvenido, ${res.data.firstName}!`)
      navigate('/app')
    } catch (err) {
      throwAxiosErros(err as AxiosError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => throwFormErrors(errors), [errors])

  return (
    <div className='w-full h-screen flex items-center justify-center'>

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
          <Typography variant='h6' textAlign='center'>Registrarse</Typography>
          <div className='flex gap-4'>
            <TextField
              fullWidth
              label='Nombre'
              variant='outlined'
              size='small'
              required
              {...register('firstName')}
              error={errors.firstName ? true : false}
            />
            <TextField
              fullWidth
              label='Apellido'
              variant='outlined'
              size='small'
              required
              {...register('lastName')}
              error={errors.lastName ? true : false}
            />
          </div>
          <TextField
            fullWidth
            label='Correo electrónico'
            variant='outlined'
            size='small'
            required
            {...register('email')}
            error={errors.email ? true : false}
          />
          <TextField
            fullWidth
            label='Nombre de usuario'
            variant='outlined'
            size='small'
            required
            {...register('username')}
            error={errors.username ? true : false}
          />
          <TextField
            fullWidth
            label='Contraseña'
            variant='outlined'
            size='small'
            type={showPassword ? 'text' : 'password'}
            required
            error={errors.password ? true : false}
            {...register('password')}
            InputProps={{
              endAdornment: (
                <Tooltip title='hola'>
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityTwoToneIcon /> : <VisibilityOffTwoToneIcon />}
                  </IconButton>
                </Tooltip>
              )
            }}
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
        </form>

        <Typography variant='body2'>
          ¿Ya tienes una cuenta? <Link to='/login'>Inicia sesión</Link>
        </Typography>

      </Paper>

    </div>
  )
}

export default Register
