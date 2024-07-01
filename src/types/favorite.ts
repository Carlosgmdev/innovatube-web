export interface Favorite {
  kind:    string;
  etag:    string;
  id:      string;
  snippet: Snippet;
}

export interface Snippet {
  publishedAt:          Date;
  channelId:            string;
  title:                string;
  description:          string;
  thumbnails:           Thumbnails;
  channelTitle:         string;
  tags:                 string[];
  categoryId:           string;
  liveBroadcastContent: string;
  defaultLanguage:      string;
  localized:            Localized;
  defaultAudioLanguage: string;
}

export interface Localized {
  title:       string;
  description: string;
}

export interface Thumbnails {
  default:  Default;
  medium:   Default;
  high:     Default;
  standard: Default;
  maxres:   Default;
}

export interface Default {
  url:    string;
  width:  number;
  height: number;
}

export interface FavoriteFilters {
  search : string;
}
