export type RebrickableSet = {
  set_num: string;
  name: string;
  year: number;
  theme_id: number;
  num_parts: number;
  set_img_url: string;
  set_url: string;
  last_modified_dt: string;
};

export type RebrickableResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: RebrickableSet[];
};
