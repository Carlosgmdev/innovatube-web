import { Button, IconButton, Paper, TextField, Tooltip, Typography } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { useEffect, useState } from "react"
import { LoginResponse, RegisterForm } from "../../types/auth"
import throwFormErrors from "../../utils/FormErrorsHandling"
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone'
import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone'
import useGlobalStore from "../../store/useGlobalStore"
import axios, { AxiosError } from "axios"
import { API_URL, RECAPTCHA_SITE_KEY } from "../../config/constants"
import throwAxiosErros from "../../utils/AxiosErrorsHandling"
import useAuthStore from "../../store/useAuthStore"
import { toast } from "sonner"
import { setCookie } from "../../utils/Cookies"
import ReCAPTCHA from 'react-google-recaptcha'

const Register = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const { setLoading } = useGlobalStore()
  const { setUser, setToken } = useAuthStore()
  const navigate = useNavigate()
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')
  const [reCaptcha, setReCaptcha] = useState<string>('')

  const loginSchema = z.object({
    firstName: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
    lastName: z.string().min(2, { message: 'El apellido debe tener al menos 2 caracteres' }),
    email: z.string().email({ message: 'Por favor, ingresa una dirección de correo válida' }),
    password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
    username: z.string().min(6, { message: 'El nombre de usuario debe tener al menos 6 caracteres' })
  })
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: RegisterForm): Promise<void> => {
    setLoading(true)
    try {
      if (data.password !== passwordConfirm) {
        toast.error('Las contraseñas no coinciden')
        return
      }
      if (!reCaptcha) {
        toast.error('Por favor, completa el reCAPTCHA')
        return
      }
      const res = await axios.post<LoginResponse>(`${API_URL}/users/register`, { ...data, reCaptcha })
      const { user, token } = res.data
      setUser(user)
      setCookie('jwtToken', token, 30)
      setToken(token)
      window.localStorage.setItem('user', JSON.stringify(user))
      toast.success(`Bienvenido, ${user.firstName}!`)
      navigate('/app/home')
    } catch (err) {
      throwAxiosErros(err as AxiosError)
    } finally {
      setLoading(false)
    }
  }

  const handleReCaptcha = (token: string | null) => setReCaptcha(token || '')

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
          <div className='flex items-center gap-2'>
            <TextField
              fullWidth
              label='Contraseña'
              variant='outlined'
              size='small'
              type={showPassword ? 'text' : 'password'}
              required
              error={errors.password ? true : false}
              {...register('password')}
            />
            <TextField
              fullWidth
              label='Confirmar contraseña'
              variant='outlined'
              size='small'
              type={showPassword ? 'text' : 'password'}
              required
              error={errors.password ? true : false}
              name='passwordConfirm'
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
            <Tooltip title='hola'>
              <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOffTwoToneIcon /> : <VisibilityTwoToneIcon />}
              </IconButton>
            </Tooltip>
          </div>
          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={handleReCaptcha}
            className='self-center'
          />
          <Button
            fullWidth
            variant='contained'
            color='primary'
            type='submit'
            onClick={handleSubmit(onSubmit)}
          >
            Registrarse
          </Button>
        </form>


        <div className='flex flex-col items-center gap-1'>
          <Typography variant='body2'>
            ¿Ya tienes una cuenta? <Link to='/login' className='font-bold'>Inicia sesión</Link>
          </Typography>
          <Typography variant='body2'>
            ¿Olvidaste tu contraseña? <Link to='/forgot' className='font-bold'>Recupérala</Link>
          </Typography>
        </div>

      </Paper>

    </div>
  )
}

export default Register
