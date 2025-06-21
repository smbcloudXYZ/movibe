use git2::Repository;
use std::path::Path;

pub fn clone(repo_url: &str, app_data_dir: &Path) {
    let repo = match Repository::clone(repo_url, app_data_dir.join("movibe")) {
        Ok(repo) => repo,
        Err(e) => panic!("failed to clone: {}", e),
    };
    log::debug!("Cloned repository: {:?}", repo.path().to_string_lossy());
}
