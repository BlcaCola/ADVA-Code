// In its own file to avoid circular dependencies
export const FILE_EDIT_TOOL_NAME = 'Edit'

// Permission pattern for granting session-level access to the project's .adva/ folder
export const CLAUDE_FOLDER_PERMISSION_PATTERN = '/.adva/**'

// Permission pattern for granting session-level access to the global ~/.adva/ folder
export const GLOBAL_CLAUDE_FOLDER_PERMISSION_PATTERN = '~/.adva/**'

export const FILE_UNEXPECTEDLY_MODIFIED_ERROR =
  'File has been unexpectedly modified. Read it again before attempting to write it.'
