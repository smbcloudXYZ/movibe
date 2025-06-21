use tauri::App;

pub fn setup(app: &App) -> Result<(), Box<dyn std::error::Error>> {
    log::debug!("App identifier: {}", app.config().identifier);
    // Initialize the git repository
    Ok(())
}
