use crate::{git::clone::clone, model::GitError};
use tauri::{AppHandle, Manager};

#[tauri::command]
pub async fn ssh_clone(app: AppHandle, repo_url: &str) -> Result<(), GitError> {
    log::debug!("Cloning repository: {}", repo_url);

    let app_data_dir = match app.path().app_data_dir() {
        Ok(path) => path,
        Err(_) => {
            eprintln!("Failed to get app data directory");
            return Err(GitError {
                message: "Failed to get app data directory".to_string(),
            });
        }
    };
    clone(repo_url, &app_data_dir);
    Ok(())
}
