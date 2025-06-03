export interface PlaidItem {
  id: string;
  user_id: string;
  access_token: string;
  item_id: string;
  status: string;
  create_at: {
    Time: string;
    Valid: boolean;
  };
  updated_at: {
    Time: string;
    Valid: boolean;
  };
  cursor: string | null;
  sync_status: string;
  last_synced_at: {
    Time: string;
    Valid: boolean;
  };
}

export const SyncStatus = Object.freeze({
  IDLE: "idle",
  IN_PROGRESS: "in_progress",
  FAILED: "failed",
  PENDING: "pending",
});
