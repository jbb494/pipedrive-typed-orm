import { Value } from "../../base";

export type LeadDetailResponse = {
  id: string;
  title: string;
  owner_id: number;
  creator_id: number;
  label_ids: string[];
  person_id: number;
  organization_id: null | number;
  source_name: string;
  is_archived: boolean;
  was_seen: boolean;
  value: Value;
  expected_close_date: null | string;
  next_activity_id: number;
  add_time: string;
  update_time: string;
  visible_to: string;
  cc_email: string;
};
