export interface DeleteProgress {
  totalCount: number;
  deletedCount: number;
  percent: number;
}

export interface PurgeOptions {
  dryRun?: boolean;
  verbose?: boolean;
  recursive?: boolean;
}
