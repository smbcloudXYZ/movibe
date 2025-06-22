use git2::{Error, Repository};
use std::path::Path;

/// Initializes a new git repository at the given path.
/// Returns Ok(()) if successful, or Err(git2::Error) if initialization fails.
pub fn init_repo(repo_path: &Path) -> Result<(), Error> {
    Repository::init(repo_path)?;
    Ok(())
}
