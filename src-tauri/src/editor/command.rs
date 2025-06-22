use super::fc;
use crate::git::init::init_repo;
use log::debug;
use tauri::AppHandle;
use tauri::Manager;
use uuid::Uuid;

#[tauri::command]
pub fn open_folder(folder_path: &str) -> String {
    debug!("open_folder called with folder_path: {}", folder_path);
    let files = fc::read_directory(folder_path);
    debug!("open_folder result: {}", files);
    files
}

#[tauri::command]
pub fn get_file_content(file_path: &str) -> String {
    debug!("get_file_content called with file_path: {}", file_path);
    let content = fc::read_file(file_path);
    debug!("get_file_content result length: {}", content.len());
    content
}

#[tauri::command]
pub fn write_file(file_path: &str, content: &str) -> String {
    debug!(
        "write_file called with file_path: {}, content length: {}",
        file_path,
        content.len()
    );
    fc::write_file(file_path, content);
    debug!("write_file completed for file_path: {}", file_path);
    String::from("OK")
}

#[tauri::command]
pub fn create_project(app: AppHandle) -> String {
    debug!("create_project called");
    // Get the app data directory safely
    let app_data_dir = match app.path().app_data_dir() {
        Ok(path) => path,
        Err(_) => {
            debug!("Failed to get app_data_dir");
            return String::from("ERROR");
        }
    };

    // Generate uuid project name
    let project_name = Uuid::new_v4().to_string();
    let project_path = app_data_dir.join(&project_name);
    debug!("Generated project_path: {:?}", project_path);

    match fc::create_directory(project_path.to_str().unwrap_or("")) {
        Ok(_) => {
            debug!("Directory created at {:?}", project_path);
            // Initialize git repository
            if let Err(e) = init_repo(&project_path) {
                debug!("Failed to initialize git repo: {:?}", e);
                return String::from("ERROR");
            }
            // Return the full project path as a string
            let path_str = project_path.to_string_lossy().to_string();
            debug!("Project created successfully at {}", path_str);
            path_str
        }
        Err(e) => {
            debug!("Failed to create directory: {:?}", e);
            String::from("ERROR")
        }
    }
}
