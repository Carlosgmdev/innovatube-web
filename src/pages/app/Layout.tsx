import { Container } from '@mui/material'
import Header from '../../components/Header'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <Container maxWidth='lg'>
      <Header />
      <div>
        <Outlet />
      </div>
    </Container>
  )
}

export default Layout
