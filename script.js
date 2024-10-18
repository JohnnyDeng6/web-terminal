import * as util from './util.js';
import * as tree from './fileTree.js';
util.func();
//Make the DIV element draggagle:
dragElement(document.getElementById("terminal"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;  
    e.preventDefault();

    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;

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

var help = "clear - clears terminal\n cd [location] - change directory\n ls [location] - list out current directory\n ./ [location] - displays webpage/content\n tree [location] - displays tree visualization of directory\n echo [msg] - prints message\n exit - closes webpage\n help - help manual\n";
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
    let temp_curr = curr;
    const terminal = document.getElementById('terminal');
    terminal.addEventListener('drop', handleDrop, false);

    if (commandArray[0] == "mkdir") {
        const newDirectory = new tree.TreeNode(commandArray[1], 0);
        temp_curr.addChild(newDirectory);
        return "";
    }
    else if (commandArray[0] == "touch") {
        if (!file) {return util.commandError(commandArray[0], path); }
        let type = file.type == "text/html" ? 1 : 2;
        const newPage = new tree.TreeNode(commandArray[1], type, file);
        temp_curr.addChild(newPage);
        return "";
    }



    if (commandArray[0] == "echo") {
        commandArray[0] = "";
        let temp = commandArray.toString();
        return temp.replace(/,/g, ' ') + '\n';
    }

    else if (commandArray[0] == "help") {
        return help;
    }

    else if (commandArray[0] == "exit") {
        if(confirm("are you sure you want to exit") == true) {
            window.close();
            var myWindow = window.open("", "_self");
            myWindow.document.write("your browser doesn't allow 'window.close()' to work anymore, so this is the best i can do :/");
        } else {return "";}
    }

    else if (commandArray[0] == "clear") {
        pastCommands = [];
        return "CLEAR_COMMAND_CALLED";
    } 

    //must be either path related or error
    if (path != undefined) {
        temp_curr = tree.handlePath(path, temp_curr);
        if (typeof temp_curr === 'string' || temp_curr instanceof String)  {
            return util.commandError(commandArray[0], path); 
        } 
    } 

    if (command[0] + command[1] == "./") {
        path = command.substr(2);
        commandArray[0] = "./";
        temp_curr = tree.handlePath(path, temp_curr);
        if (typeof temp_curr === 'string' || temp_curr instanceof String)  {
            return util.commandError(commandArray[0], path); 
        } 
    }

    if (commandArray[0] == "cd") {
        if (temp_curr.type == 0) {
            curr = temp_curr;
        } else { return util.commandError(commandArray[0], path)}
    }



    else if (commandArray[0] == "ls") {
        if (commandArray.length == 1){
            temp_curr = curr;
        }
        return temp_curr.children.map(child => child.name).toString().replace(/,/g, ' ') + '\n';
    }

    else if (commandArray[0] == "./") {
        switch (temp_curr.type) {
            case 0:
                return util.commandError(commandArray[0], path)
            case 1: //for html files
                const htmlOutput = document.getElementById('htmlOutput');
                const reader = new FileReader();
                reader.onload = function(event) {
                    const fileContent = event.target.result;
                    htmlOutput.innerHTML = fileContent;
                };
                reader.readAsText(temp_curr.file);
                break;
            case 2: //for content
                const link = document.createElement('a');
                const url = URL.createObjectURL(temp_curr.file);
                link.href = url;
                link.download = temp_curr.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                // link.href = temp_curr.file;
                // link.download = temp_curr.name;
                break;
            case 3: //for external links
                window.open(temp_curr.link);
                return "";
            default:
                console.log("how did we get here");
        }
        return "";
    }

    else if (commandArray[0] == "tree") {
        return tree.root.traverseToString(temp_curr);
    }

    else { //command not found
        return "Command '" + command + "'" + " not found\n"
    }

    return msg;
}


////////////
    const fileInfo = document.getElementById('fileInfo');
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
            fileInfo.textContent = fileName;
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