import { CircularProgress } from '@mui/material'

const Spinner = () => {
  return (
    <div className='absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <CircularProgress />
    </div>
  )
}

export default Spinner
