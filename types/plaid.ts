export interface PlaidItem {
  ID: string;
  UserID: string;
  AccessToken: string;
  ItemID: string;
  Status: string;
  CreatedAt: {
    Time: string;
    Valid: boolean;
  };
  UpdatedAt: {
    Time: string;
    Valid: boolean;
  };
}
