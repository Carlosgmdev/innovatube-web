import { Button, Paper, TextField, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { useEffect } from "react"
import { LoginForm } from "../../types/auth"
import throwFormErrors from "../../utils/FormErrorsHandling"

const Login = () => {
  const loginSchema = z.object({
    email: z.string().email({ message: 'Por favor, ingresa una dirección de correo válida' }),
    password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  })

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = (data: LoginForm): void => {
    console.log(data)
  }

  useEffect(() => throwFormErrors(errors), [errors])

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      {/* Login Card */}
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
          <Typography variant='h6' textAlign='center'>Iniciar sesión</Typography>
          <TextField
            fullWidth
            label='Nombre de usuario o correo'
            variant='outlined'
            size='small'
            required
            {...register('email')}
            error={errors.email ? true : false}
          />
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
          ¿No tienes una cuenta? <Link to='/register'>Regístrate</Link>
        </Typography>

      </Paper>

    </div>
  )
}

export default Login
