export type User = {
  id: number;
  name: string;
  email: string;
  has_pic: boolean;
  pic_hash: null | string;
  active_flag: boolean;
  value: number;
};

export type Person = {
  active_flag: boolean;
  name: string;
  email: Contact[];
  phone: Contact[];
  value: number;
};

export type Contact = {
  label: string;
  value: string;
  primary: boolean;
};

export type Organization = {
  name: string;
  people_count: number;
  owner_id: number;
  address: string;
  active_flag: boolean;
  cc_email: string;
  value: number;
};

export type Time = {
  y: number;
  m: number;
  d: number;
  h: number;
  i: number;
  s: number;
  total_seconds: number;
};

export type PipelineStages = {
  times_in_stages: Record<string, number>;
  order_of_stages: number[];
};

export type AdditionalData = {
  dropbox_email: string;
};

export type Stage = {
  id: number;
  company_id: number;
  order_nr: number;
  name: string;
  active_flag: boolean;
  deal_probability: number;
  pipeline_id: number;
  rotten_flag: boolean;
  rotten_days: null | number;
  add_time: string;
  update_time: string;
  pipeline_name: string;
  pipeline_deal_probability: boolean;
};

export type Pipeline = {
  id: number;
  name: string;
  url_title: string;
  order_nr: number;
  active: boolean;
  deal_probability: boolean;
  add_time: string;
  update_time: string;
};

export type Picture = {
  item_type: string;
  item_id: number;
  active_flag: boolean;
  add_time: string;
  update_time: string;
  added_by_user_id: number;
  pictures: Record<string, string>;
  value: number;
};

export type Value = {
  amount: number;
  currency: string;
};
