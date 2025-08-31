export interface BuildConfig {
  distDir: string;
  workspaceRoot: string;
  clientDir: string;
  serverDir: string;
  dataDir: string;
  configDir: string;
  buildDir: string;
  targetPlatform?: 'windows' | 'linux' | 'macos' | 'universal';
  targetArch?: 'x64' | 'arm64' | 'universal';
  includeNode?: boolean;
  standalone?: boolean;
}

export interface BuildOptions {
  platform?: 'windows' | 'linux' | 'macos' | 'universal';
  arch?: 'x64' | 'arm64' | 'universal';
  includeNode?: boolean;
  standalone?: boolean;
  zip?: boolean;
  outputDir?: string;
}

export type Platform = 'windows' | 'linux' | 'macos' | 'universal';
export type Architecture = 'x64' | 'arm64' | 'universal';
