use super::fc;
use crate::git::init::init_repo;
use tauri::AppHandle;
use tauri::Manager;
use uuid::Uuid;

#[tauri::command]
pub fn open_folder(folder_path: &str) -> String {
    let files = fc::read_directory(folder_path);
    files
}

#[tauri::command]
pub fn get_file_content(file_path: &str) -> String {
    let content = fc::read_file(file_path);
    content
}

#[tauri::command]
pub fn write_file(file_path: &str, content: &str) -> String {
    fc::write_file(file_path, content);
    String::from("OK")
}

#[tauri::command]
pub fn create_project(app: AppHandle) -> String {
    // Get the app data directory safely
    let app_data_dir = match app.path().app_data_dir() {
        Ok(path) => path,
        Err(_) => return String::from("ERROR"),
    };

    // Generate uuid project name
    let project_name = Uuid::new_v4().to_string();
    let project_path = app_data_dir.join(&project_name);

    match fc::create_directory(project_path.to_str().unwrap_or("")) {
        Ok(_) => {
            // Initialize git repository
            if let Err(_e) = init_repo(&project_path) {
                return String::from("ERROR");
            }
            // Return the full project path as a string
            project_path.to_string_lossy().to_string()
        }
        Err(_) => String::from("ERROR"),
    }
}
