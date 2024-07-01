import { Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import Avatar from './AvatarMenu'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'

const Header = () => {
  return (
    <header className='flex flex-col'>
      <div className='flex py-4 items-center justify-between'>
        <Typography variant='h5'>
          InnovaTube
        </Typography>
        <nav className='hidden md:flex gap-2 '>
          <Button
            startIcon={<HomeOutlinedIcon />}
            size='large'
            variant='text'
            color='inherit'
            component={Link}
            to='/app/home'
          >
            Inicio
          </Button>
          <Button
            startIcon={<StarBorderOutlinedIcon />}
            size='large'
            variant='text'
            color='inherit'
            component={Link}
            to='/app/favorites'
          >
            Mis favoritos
          </Button>
        </nav>
        <Avatar />
      </div>
      <nav className='flex md:hidden gap-2 items-center justify-center'>
        <Button
          startIcon={<HomeOutlinedIcon />}
          size='large'
          variant='text'
          color='inherit'
          component={Link}
          to='/app/home'
        >
          Inicio
        </Button>
        <Button
          startIcon={<StarBorderOutlinedIcon />}
          size='large'
          variant='text'
          color='inherit'
          component={Link}
          to='/app/favorites'
        >
          Mis favoritos
        </Button>
      </nav>
    </header>
  )
}

export default Header
