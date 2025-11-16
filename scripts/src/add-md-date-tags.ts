#!/usr/bin/env tsx
/**
 * Script to add or update date tags in markdown files
 *
 * Format: 📅 Nov 15, 2025
 * Location: Line 3 (below the main title)
 *
 * Uses git commit date (first commit) as primary source,
 * falls back to file modification date if git date unavailable.
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, statSync, readdirSync, lstatSync } from 'fs';
import { join, relative } from 'path';

interface DateTagInfo {
  hasTag: boolean;
  tagLine?: number;
  dateString: string;
}

/**
 * Get git commit date for a file (first commit)
 */
function getGitCommitDate(filePath: string, repoRoot: string): string | null {
  try {
    const relativePath = relative(repoRoot, filePath);
    const command = `git log --format="%ai" --follow -- "${relativePath}" | tail -1`;
    const result = execSync(command, { cwd: repoRoot, encoding: 'utf-8' }).trim();

    if (!result) return null;

    // Parse ISO date format: "2025-11-15 13:11:48 +0100"
    const date = new Date(result);
    if (isNaN(date.getTime())) return null;

    // Format as "Nov 15, 2025"
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    return null;
  }
}

/**
 * Get file modification date
 */
function getFileModificationDate(filePath: string): string {
  try {
    const stats = statSync(filePath);
    const date = new Date(stats.mtime);

    // Format as "Nov 15, 2025"
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    // Fallback to current date if stat fails
    return new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}

/**
 * Check if file already has a date tag and get its info
 */
function checkDateTag(content: string): DateTagInfo {
  const lines = content.split('\n');

  // More flexible regex to match date tag formats
  // Matches: 📅 Nov 15, 2025 (with or without qualifiers like "(approx)" or "(last modified)")
  const dateTagRegex = /^📅\s+([A-Za-z]{3}\s+\d{1,2},\s+\d{4})(\s*\([^)]+\))?\s*$/;

  // Check first 10 lines for date tag (most likely near the top)
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i].trim();
    const match = line.match(dateTagRegex);

    if (match) {
      return {
        hasTag: true,
        tagLine: i,
        dateString: match[1], // Extract the date part
      };
    }

    // Also check for any line containing the calendar emoji (more lenient)
    if (line.includes('📅') && !match) {
      // Try to extract date even if format is slightly off
      const looseMatch = line.match(/📅\s*([A-Za-z]{3}\s+\d{1,2},\s+\d{4})/);
      if (looseMatch) {
        return {
          hasTag: true,
          tagLine: i,
          dateString: looseMatch[1],
        };
      }
      // If we found 📅 but can't parse date, still mark as having tag
      return {
        hasTag: true,
        tagLine: i,
        dateString: '',
      };
    }
  }

  return {
    hasTag: false,
    dateString: '',
  };
}

/**
 * Add or update date tag in markdown content
 */
function addOrUpdateDateTag(content: string, dateString: string, repoRoot: string, filePath: string): string {
  const lines = content.split('\n');
  const tagInfo = checkDateTag(content);

  // Get date (prefer git, fallback to file modification)
  const gitDate = getGitCommitDate(filePath, repoRoot);
  const finalDate = gitDate || getFileModificationDate(filePath);
  const finalTag = `📅 ${finalDate}`;

  // If tag already exists, update it in place
  if (tagInfo.hasTag && tagInfo.tagLine !== undefined) {
    lines[tagInfo.tagLine] = finalTag;

    // Ensure there's a blank line after the tag
    const nextLineIndex = tagInfo.tagLine + 1;
    if (nextLineIndex >= lines.length || lines[nextLineIndex].trim() !== '') {
      lines.splice(nextLineIndex, 0, '');
    }

    return lines.join('\n');
  }

  // No existing tag - add new one on line 3
  // Ensure we have at least 2 lines (title and blank line)
  while (lines.length < 2) {
    lines.push('');
  }

  // Insert date tag on line 3 (after title and blank line)
  // If line 2 is not blank, insert a blank line first
  // Always ensure a blank line after the tag
  if (lines[1].trim() !== '') {
    lines.splice(2, 0, '', finalTag, '');
  } else {
    lines.splice(2, 0, finalTag, '');
  }

  return lines.join('\n');
}

/**
 * Find all markdown files in the repository
 */
function findMarkdownFiles(repoRoot: string, dir: string = repoRoot, files: string[] = []): string[] {
  const ignoreDirs = ['node_modules', '.git', 'dist', 'build', '.next', '.turbo', '.cursor'];

  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);

      // Skip ignored directories
      if (ignoreDirs.includes(entry)) {
        continue;
      }

      try {
        const stat = lstatSync(fullPath);

        if (stat.isDirectory()) {
          // Recursively search subdirectories
          findMarkdownFiles(repoRoot, fullPath, files);
        } else if (entry.endsWith('.md')) {
          files.push(fullPath);
        }
      } catch {
        // Skip files we can't access
        continue;
      }
    }
  } catch {
    // Skip directories we can't access
  }

  return files;
}

/**
 * Main function
 */
async function main() {
  const repoRoot = process.cwd();
  console.log(`📅 Adding date tags to markdown files in: ${repoRoot}\n`);

  const mdFiles = findMarkdownFiles(repoRoot);
  console.log(`Found ${mdFiles.length} markdown files\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const filePath of mdFiles) {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const tagInfo = checkDateTag(content);

      // Get date
      const gitDate = getGitCommitDate(filePath, repoRoot);
      const fileDate = getFileModificationDate(filePath);
      const finalDate = gitDate || fileDate;
      const dateSource = gitDate ? 'git' : 'file';

      // Check if update is needed (only skip if tag exists AND date matches)
      if (tagInfo.hasTag && tagInfo.dateString && tagInfo.dateString === finalDate) {
        console.log(`⏭️  Skipped (already up-to-date): ${relative(repoRoot, filePath)}`);
        skipped++;
        continue;
      }

      // Add or update tag
      const updatedContent = addOrUpdateDateTag(content, finalDate, repoRoot, filePath);

      if (updatedContent !== content) {
        writeFileSync(filePath, updatedContent, 'utf-8');
        const action = tagInfo.hasTag ? 'Updated' : 'Added';
        console.log(`✅ ${action} (${dateSource}): ${relative(repoRoot, filePath)} → ${finalDate}`);
        updated++;
      } else {
        console.log(`⏭️  Skipped (no changes): ${relative(repoRoot, filePath)}`);
        skipped++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${relative(repoRoot, filePath)}:`, error);
      errors++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Updated/Added: ${updated}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📄 Total: ${mdFiles.length}`);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { main, addOrUpdateDateTag, getGitCommitDate, getFileModificationDate };
