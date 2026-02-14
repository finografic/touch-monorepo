/** Shared type definitions for the deployment build system. */

export type Platform = 'windows' | 'linux' | 'macos' | 'universal';
export type Arch = 'x64' | 'arm64' | 'universal';

export interface BuildConfig {
  distDir: string;
  workspaceRoot: string;
  clientDir: string;
  serverDir: string;
  dataDir: string;
  configDir: string;
  buildDir: string;
  templatesDir: string;
  targetPlatform?: Platform;
  targetArch?: Arch;
  includeNode?: boolean;
  standalone?: boolean;
}

export interface BuildOptions {
  platform?: Platform;
  arch?: Arch;
  includeNode?: boolean;
  standalone?: boolean;
  zip?: boolean;
  outputDir?: string;
}
