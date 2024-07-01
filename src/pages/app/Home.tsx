import { Pagination, TextField, Typography, CircularProgress, Tooltip, IconButton } from "@mui/material";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'
import { Item, ToggleFavoriteResponse, VideoFilters, Videos } from "../../types/video";
import { useEffect, useState, useRef } from "react";
import axios, { AxiosError } from "axios";
import { API_URL } from "../../config/constants";
import throwAxiosErros from "../../utils/AxiosErrorsHandling";
import useVideoStore from "../../store/useVideoStore";
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import useAuthStore from "../../store/useAuthStore";
import { toast } from "sonner";

const Home = () => {
  const filtersInitialState: VideoFilters = { pageToken: '', search: '' };
  const [filters, setFilters] = useState<VideoFilters>(filtersInitialState);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loadingVideos, setLoadingVideos] = useState<boolean>(false);
  const { videos, setVideos, addFavoriteVideo, favorites, removeFavoriteVideo } = useVideoStore();
  const PAGE_SIZE = 5;
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { token } = useAuthStore();

  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    if (currentPage === value) return;
    if (value > currentPage) setFilters({ ...filters, pageToken: videos?.nextPageToken || '' });
    if (value < currentPage) setFilters({ ...filters, pageToken: videos?.prevPageToken || '' });
    setCurrentPage(value);
  };

  const fetchVideos = async (): Promise<void> => {
    try {
      setLoadingVideos(true);
      const res = await axios<Videos>(`${API_URL}/videos?search=${filters.search}&pageToken=${filters.pageToken}`, { headers: { Authorization: `Bearer ${token}` } });
      setTotalResults(Math.ceil(res.data.pageInfo.totalResults / PAGE_SIZE));
      setVideos(res.data);
      setLoadingVideos(false);
    } catch (error) {
      setLoadingVideos(false);
      throwAxiosErros(error as AxiosError);
    }
  };

  const handleToggleFavorite = async (video: Item): Promise<void> => {
    const { videoId } = video.id
    try {
      const res = await axios.post<ToggleFavoriteResponse>(`${API_URL}/videos/toggle-favorite`, { videoId }, { headers: { Authorization: `Bearer ${token}`}})
      if (res.data.action === 'add') {
        toast.success('Video agregado a favoritos')
        addFavoriteVideo(video)
      } else {
        toast.success('Video eliminado de favoritos')
        removeFavoriteVideo(video)
      }
    } catch (error) {
      throwAxiosErros(error as AxiosError);
    }
  }

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      fetchVideos();
    }, 500);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [filters]);

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ pageToken: '', search: event.target.value });
  };

  return (
    <div className='flex flex-col gap-16'>
      <Typography variant='h5' align='center' className='py-4'>Inicio</Typography>
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
      <div className='flex flex-col gap-8'>
        {videos?.items.map(v => (
          <div
            key={v.id.videoId}
            className='flex flex-col md:flex-row bg-zinc-900 rounded-lg p-4 gap-8 cursor-pointer'
          >
            <img
              src={v.snippet.thumbnails.high.url}
              alt={v.snippet.title}
              className='rounded-lg w-full md:w-60 object-cover'
            />
            <div className='flex flex-col justify-between items-start flex-1 gap-2'>
              <Typography variant='h6'>{v.snippet.title}</Typography>
              <Typography variant='body1' className='line-clamp-2'>{v.snippet.description}</Typography>
              <div className='flex w-full items-center justify-end gap-4'>
                <Tooltip title='Ver video'>
                  <IconButton onClick={() => window.open(`https://www.youtube.com/watch?v=${v.id.videoId}`, '_blank')}>
                    <PlayArrowOutlinedIcon fontSize='large' />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Marcar como favorito'>
                  <IconButton
                    onClick={() => handleToggleFavorite(v)}
                  >
                    {favorites?.find(f => f.id.videoId === v.id.videoId) ? <StarOutlinedIcon fontSize='large' color='warning' /> : <StarBorderOutlinedIcon fontSize='large' />}
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='flex items-center justify-center py-4'>
        <Pagination
          count={totalResults}
          color="primary"
          onChange={handleChangePage}
        />
      </div>
    </div>
  );
};

export default Home;
