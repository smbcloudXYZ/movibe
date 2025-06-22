use super::fc;

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
pub fn create_project(project_path: &str) -> String {
    match fc::create_directory(project_path) {
        Ok(_) => String::from("OK"),
        Err(_) => String::from("ERROR"),
    }
}
