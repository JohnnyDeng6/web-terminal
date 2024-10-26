# Web Terminal

A simple web terminal that allows users to interact with a local file system through various commands. Users can manage directories, list files, display content, and more directly from their web browser.

## Features

Commands

- **clear**: Clears the terminal screen.
- **cd [location]**: Change the current directory.
- **ls [location]**: List the contents of the specified directory or the current directory if no location is provided.
- **./[location]**: Displays or retrieves webpage content. If the file is an HTML file, it will render it on the screen; otherwise, it will trigger a download.
- **tree [location]**: Displays a tree visualization of the directory structure.
- **echo [msg]**: Prints the specified message to the terminal.
- **exit**: Closes the terminal webpage.
- **mkdir [location+Name]**: Creates a new directory at the specified location.
- **rmdir/rm [location]**: Removes the specified file or directory.
- **touch [file]**: Allows users to drag and drop a file to add it to the file system.
- **help**: Displays the help manual with available commands.

Extra Features

 - Using the `up-arrow` and `down-arrow` key will cycle through past commands
 - The Terminal is draggable by dragging the header
 - You can minimize the Terminal if it is blocking any content, a mini draggable terminal icon will appear


## How It Works

The web terminal operates on a simple command-line interface that interacts with a virtual file system stored in a tree structure. Here’s a breakdown of its components:

1. **File System Structure**: 
   - The file system is organized as a tree, where each node represents either a file or a directory. The root node contains all top-level directories and files. Directories can have child nodes, allowing for hierarchical storage of files.
   - Each directory can contain files and subdirectories, enabling users to navigate through the file system easily.

2. **Command Processing**: 
   - User commands are parsed and executed based on the input. Each command corresponds to a function that manipulates the file system accordingly.
   - Commands like `mkdir` and `rmdir` modify the tree structure by adding or removing nodes. 
   - The `ls` command traverses the tree to list contents, while `tree` visualizes the entire structure.

3. **File Handling**: 
   - When a user employs the `touch` command, the terminal listens for a drag-and-drop action, which adds the file to the current directory in the tree structure.
   - The `./[filename]` command checks the file type. If it’s an HTML file, it renders the content on the terminal screen; otherwise, it initiates a download.

4. **Storage**
   - Cookies are used to keep track of command history and the current directory on reloads
   - This project is currently client-sided only, so all user generated the directories/files will be cleared on reload of webpage.


## Usage

1. Open the web terminal in your browser.
2. Use the commands listed above to interact with the file system.
3. To add a file, use the `touch` command and drag a file into the terminal. Press enter to add the file.
4. To display an HTML file, use `./[filename]`. For other file types, it will download the file.

## Technologies
Made with pure JavaScript with some html/css

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/web-terminal.git
cd web-terminal

