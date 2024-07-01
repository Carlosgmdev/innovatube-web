import { TextField, Typography, CircularProgress, Tooltip, IconButton } from "@mui/material";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'
import { ToggleFavoriteResponse } from "../../types/video";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { API_URL } from "../../config/constants";
import throwAxiosErros from "../../utils/AxiosErrorsHandling";
import useVideoStore from "../../store/useVideoStore";
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import useAuthStore from "../../store/useAuthStore";
import { toast } from "sonner";
import { Favorite, FavoriteFilters } from "../../types/favorite";
import useFavoriteStore from "../../store/useFavoriteStore";

const Favorites = () => {
  const filtersInitialState: FavoriteFilters = { search: '' };
  const [filters, setFilters] = useState<FavoriteFilters>(filtersInitialState);
  const [loadingVideos, setLoadingVideos] = useState<boolean>(false);
  const { removeFavoriteVideoById } = useVideoStore();
  const { favorites, setFavorites, removeFavorite } = useFavoriteStore()
  const [favoritesToShow, setFavoritesToShow] = useState<Favorite[] | null>(null)
  const { token } = useAuthStore();

  const fetchFavorites = async (): Promise<void> => {
    try {
      setLoadingVideos(true);
      const res = await axios<Favorite[]>(`${API_URL}/videos/favorites`, { headers: { Authorization: `Bearer ${token}` } });
      setFavorites(res.data);
    } catch (error) {
      throwAxiosErros(error as AxiosError);
    } finally {
      setLoadingVideos(false);
    }
  };

  const handleToggleFavorite = async (video: Favorite): Promise<void> => {
    const { id } = video
    try {
      await axios.post<ToggleFavoriteResponse>(`${API_URL}/videos/toggle-favorite`, { id }, { headers: { Authorization: `Bearer ${token}`}})
      removeFavorite(video)
      removeFavoriteVideoById(id)
      setFavoritesToShow(favorites?.filter(f => f.id !== id) as Favorite[])
      toast.success('Video eliminado de favoritos')
    } catch (error) {
      throwAxiosErros(error as AxiosError);
    }
  }

  useEffect(() => {
    if (filters.search === '') return setFavoritesToShow(favorites)
    const favoritesFound = favorites?.filter(f => f.snippet.title.toLowerCase().includes(filters.search.toLowerCase()))
    setFavoritesToShow(favoritesFound!)
  }, [filters, favorites]);

  useEffect(() => {
    fetchFavorites()
  }, []);

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>): void => setFilters({ search: e.target.value })

  return (
    <div className='flex flex-col gap-16'>
      <Typography variant='h5' align='center' className='py-4'>Favoritos</Typography>
      <TextField
        id='search'
        label='Buscar videos'
        variant='outlined'
        fullWidth
        size='small'
        onChange={handleChangeSearch}
        value={filters.search}
        InputProps={{
          startAdornment: <SearchOutlinedIcon />,
          endAdornment: loadingVideos ? <CircularProgress size={20} /> : null
        }}
      />
      <div className='flex flex-col gap-8 mb-8'>
        {favoritesToShow?.map(f => (
          <div
            key={f.id}
            className='flex flex-col md:flex-row bg-zinc-900 rounded-lg p-4 gap-8 cursor-pointer'
          >
            <img
              src={f.snippet.thumbnails.high.url}
              alt={f.snippet.title}
              className='rounded-lg w-full md:w-60 object-cover'
            />
            <div className='flex flex-col justify-between items-start flex-1 gap-2'>
              <Typography variant='h6'>{f.snippet.title}</Typography>
              <Typography variant='body1' className='line-clamp-2'>{f.snippet.description}</Typography>
              <div className='flex w-full items-center justify-end gap-4'>
                <Tooltip title='Ver video'>
                  <IconButton onClick={() => window.open(`https://www.youtube.com/watch?f=${f.id}`, '_blank')}>
                    <PlayArrowOutlinedIcon fontSize='large' />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Marcar como favorito'>
                  <IconButton
                    onClick={() => handleToggleFavorite(f)}
                  >
                    <StarOutlinedIcon fontSize='large' color="warning" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
