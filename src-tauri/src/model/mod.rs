use serde::{Deserialize, Serialize};
use std::{error::Error, fmt::Display};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GitError {
    pub message: String,
}

impl Display for GitError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "GitError: {}", self.message)
    }
}

impl Error for GitError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        None
    }
    fn description(&self) -> &str {
        "description() is deprecated; use Display"
    }
}
