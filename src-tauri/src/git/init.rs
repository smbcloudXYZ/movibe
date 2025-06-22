use git2::{Error, Repository};
use log::debug;
use std::path::Path;

/// Initializes a new git repository at the given path.
/// Returns Ok(()) if successful, or Err(git2::Error) if initialization fails.
pub fn init_repo(repo_path: &Path) -> Result<(), Error> {
    debug!("Initializing git repository at {:?}", repo_path);
    let result = Repository::init(repo_path);
    match &result {
        Ok(_) => debug!("Successfully initialized git repository at {:?}", repo_path),
        Err(e) => debug!(
            "Failed to initialize git repository at {:?}: {:?}",
            repo_path, e
        ),
    }
    result.map(|_| ())
}
