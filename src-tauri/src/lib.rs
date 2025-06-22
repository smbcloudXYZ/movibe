use editor::command::{create_project, get_file_content, open_folder, write_file};
use git::command::ssh_clone;

mod editor;
mod git;
mod model;
mod setup;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            log::info!("Tauri application started");
            #[cfg(desktop)]
            {
                app.handle()
                    .plugin(tauri_plugin_global_shortcut::Builder::new().build())?;
            }
            setup::setup(app)
        })
        .invoke_handler(tauri::generate_handler![
            ssh_clone,
            open_folder,
            get_file_content,
            write_file,
            create_project
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
