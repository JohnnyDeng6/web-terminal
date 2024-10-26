import * as util from './util.js';
import * as tree from './fileTree.js';
util.func();

const DIRECTORY = 0;
const HTML_PAGE = 1;
const DOWNLOADABLE = 2;

//Make the DIV element draggagle:
dragElement(document.getElementById("terminal"));
dragElement(document.getElementById("terminal-minimized"));
 
let isDrag = false;

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e;
    e.preventDefault();

    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;

    isDrag = false;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e;
    e.preventDefault();

    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    if (Math.abs(pos1) > 5 || Math.abs(pos2) > 5) {
        isDrag = true;
    }
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
///////////////////////////////////////////////////////////////////

let minimized = document.getElementById("terminal-minimized");
let minimizeButton = document.getElementById("minimize");
let terminal = document.getElementById("terminal");
let minimizeCookie = util.getCookie("minimize");

minimized.style.display = "none";
if (minimizeCookie == "true") { //first time or terminal is displayed
    minimized.style.display = "block";
    terminal.style.display = "none";
} 

minimized.addEventListener("click", function() {
    if (isDrag) {
        isDrag = false;
        return;
    }
    minimized.style.display = "none";
    terminal.style.display = "block";
    util.setCookie("minimize", "false", 1);
    util.scrollTop();
});
minimizeButton.addEventListener("click", function() {
    minimized.style.display = "block";
    terminal.style.display = "none";
    util.setCookie("minimize", "true", 1);
});

////////////////////////////////////////////////////////////
let curr = tree.root.root;
let currPathName = '/';
// let currPathName = util.getCookie("path");
// if (currPathName != "") {
//     curr = tree.handlePath(currPathName, tree.root.root);
// } else { currPathName = '/'; }

var user = "User@Desktop:" + currPathName + "$ ";
document.getElementById("command-label").textContent = user;

var history = util.getCookie("history");
if (!history) {history=[];}

var help = "clear - clears terminal\n cd [location] - change directory\n ls [location] - list out current directory\n ./[location] - displays/gets webpage/content\n tree [location] - displays tree visualization of directory\n echo [msg] - prints message\n exit - closes webpage\n mkdir [location+Name] - makes directory\n rmdir/rm [location] - removes file/directory\n touch [file] - drag and drop a file\n help - help manual\n";
let pastCommands = util.getCookie("commands");
if (!pastCommands) {
    pastCommands = [];
    pastCommands.push(help);
    document.getElementById("past-input").innerText = pastCommands;
} else {
    document.getElementById("past-input").innerText = pastCommands.join("");
    const terminalBody = document.querySelector('.terminalbody');
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

//given array of command, it returns a msg
function handleCommand(command, file) {

    let commandArray = command.split(" ");
    let msg = "";
    let path = commandArray[1];
    let cmd = commandArray[0];
    let temp_curr = curr;
    const terminal = document.getElementById('terminal');
    terminal.addEventListener('drop', handleDrop, false);

    let type = DIRECTORY;
    if (cmd == "mkdir" || cmd == "touch") {
        if (cmd == "touch") {
            if (!file) {return util.commandError(cmd, path); }
            type = file.type == "text/html" ? HTML_PAGE : DOWNLOADABLE;
        }
        if (path != undefined) {
            return tree.makeNewPath(path, temp_curr, file, type);
        } 
        return util.commandError(cmd, path);
    }

    if (cmd == "echo") {
        cmd = "";
        let temp = commandArray.toString();
        return temp.replace(/,/g, ' ') + '\n';
    }

    else if (cmd == "help") {
        return help;
    }

    else if (cmd == "exit") {
        if(confirm("are you sure you want to exit") == true) {
            window.close();
            var myWindow = window.open("", "_self");
            myWindow.document.write("your browser doesn't allow 'window.close()' to work anymore, so this is the best i can do :/");
        } else {return "";}
    }

    else if (cmd == "clear") {
        pastCommands = [];
        return "CLEAR_COMMAND_CALLED";
    } 

    //must be either path related or error
    if (path != undefined) {
        temp_curr = tree.handlePath(path, temp_curr);
        if (typeof temp_curr === 'string' || temp_curr instanceof String)  {
            return util.commandError(cmd, path); 
        } 
    } 

    if (cmd[0] + cmd[1] == "./") { //first 2 characters of cmd
        path = command.substr(2);
        cmd = "./";
        temp_curr = tree.handlePath(path, temp_curr);
        if (typeof temp_curr === 'string' || temp_curr instanceof String)  {
            return util.commandError(cmd, path); 
        } 
    }

    if (cmd == "cd") {
        if (temp_curr.type == DIRECTORY) {
            curr = temp_curr;
        } else { return util.commandError(cmd, path)}
    }

    else if (cmd == "rmdir" || cmd == "rm") {
        if (temp_curr.type == DIRECTORY) {
            return tree.removeNodeRecursive(temp_curr);
        } else { return util.commandError(cmd, path)}
    }


    else if (cmd == "ls") {
        if (commandArray.length == 1){
            temp_curr = curr;
        }
        return temp_curr.children.map(child => child.name).toString().replace(/,/g, ' ') + '\n';
    }

    else if (cmd == "./") {
        switch (temp_curr.type) {

            case DIRECTORY:
                return util.commandError(cmd, path)

            case HTML_PAGE: //for html files
                const dynamicStyles = document.querySelectorAll('style[data-dynamic-style="true"]');
                dynamicStyles.forEach(style => style.remove());

                const reader = new FileReader();
                reader.onload = function(event) {
                    const fileContent = event.target.result;

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(fileContent, 'text/html');

                    const htmlContent = doc.body.innerHTML; // Extracts HTML
                    htmlOutput.innerHTML = htmlContent;

                    const styles = doc.querySelectorAll('style');
                    styles.forEach(style => {
                        const newStyle = document.createElement('style');
                        newStyle.textContent = style.textContent;
                        newStyle.setAttribute('data-dynamic-style', 'true');
                        document.head.appendChild(newStyle);
                    });

                    const scripts = doc.querySelectorAll('script');
                    scripts.forEach(script => {
                        const newScript = document.createElement('script');
                        newScript.textContent = script.textContent;
                            console.log(newScript)
                            document.body.appendChild(newScript);
                    });
                };
                reader.readAsText(temp_curr.file);
                break;

            case DOWNLOADABLE: //for content
                const link = document.createElement('a');
                const url = URL.createObjectURL(temp_curr.file);
                link.href = url;
                link.download = temp_curr.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                break;
            // case 3: //for external links
            //     window.open(temp_curr.link);
            //     return "";
            default:
                console.log("how did we get here");
        }
        return "";
    }

    else if (cmd == "tree") {
        return tree.root.traverseToString(temp_curr);
    }

    else { //command not found
        return "Command '" + command + "'" + " not found\n"
    }

    return msg;
}


////////////
    let curr_file;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        terminal.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Handle dropped files
    terminal.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];  // Get the first file
        
        if (file) {
            let fileName = file.name.replaceAll(' ', '_')
            let ccmd = document.getElementById("command").value;
            document.getElementById("command").value= ccmd + fileName;
            curr_file = file;
        }
    }
/////////////

var historyIndex = -1;
//handle on enter
var input = document.getElementById("command");
input.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();

    const command = document.getElementById("command").value;
    history.push(command);
    const msg = handleCommand(command, curr_file);

    if (msg != "CLEAR_COMMAND_CALLED") {
        pastCommands.push(user + command + "\n" + msg)
    }

    let currPath = tree.findPath(curr);
    user = "User@Desktop:" + currPath + "$ ";
    // document.cookie = currPath;
    // util.setCookie("path", currPath, 1);
    util.setCookie("commands", pastCommands, 1);
    util.setCookie("history", history, 1);

    document.getElementById("command-label").textContent = user;
    document.getElementById("command").value= "";
    document.getElementById("past-input").innerText = pastCommands.join("");
    util.scrollTop();
    historyIndex = -1;
    return;
  }
  else if (event.key === 'ArrowUp') {
    historyIndex = Math.min(historyIndex+1, history.length-1);
    document.getElementById("command").value = history[history.length-1-historyIndex];
  } else if (event.key === 'ArrowDown') {
    historyIndex = Math.max(historyIndex-1, 0);
    document.getElementById("command").value = history[history.length-1-historyIndex];
  }
});