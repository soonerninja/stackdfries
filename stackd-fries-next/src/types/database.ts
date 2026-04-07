export interface TrackerStatus {
  id: string;
  is_live: boolean;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  went_live_at: string | null;
  went_offline_at: string | null;
  created_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  share_price: number | null;
  category: string;
  image_url: string | null;
  video_url: string | null;
  images: string[] | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CurrentDrop {
  id: string;
  name: string;
  teaser_text: string | null;
  available_date: string | null;
  start_date: string | null;
  end_date: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface EmailSignup {
  id: string;
  email: string;
  signed_up_at: string;
}

export interface CateringInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  event_date: string;
  headcount: number;
  event_type: string;
  message: string | null;
  status: string;
  created_at: string;
}
