import { User, Organization, Contact, Picture } from "../../base";

export type PersonDetailResponse = {
  id: number;
  company_id: number;
  owner_id: User;
  org_id: Organization;
  name: string;
  first_name: string;
  last_name: string;
  open_deals_count: number;
  related_open_deals_count: number;
  closed_deals_count: number;
  related_closed_deals_count: number;
  participant_open_deals_count: number;
  participant_closed_deals_count: number;
  email_messages_count: number;
  activities_count: number;
  done_activities_count: number;
  undone_activities_count: number;
  files_count: number;
  notes_count: number;
  followers_count: number;
  won_deals_count: number;
  related_won_deals_count: number;
  lost_deals_count: number;
  related_lost_deals_count: number;
  active_flag: boolean;
  phone: Contact[];
  email: Contact[];
  primary_email: string;
  first_char: string;
  update_time: string;
  add_time: string;
  visible_to: string;
  marketing_status: string;
  picture_id: Picture;
  next_activity_date: string;
  next_activity_time: string;
  next_activity_id: number;
  last_activity_id: number;
  last_activity_date: string;
  last_incoming_mail_time: string;
  last_outgoing_mail_time: string;
  label: number;
  org_name: string;
  owner_name: string;
  cc_email: string;
};
