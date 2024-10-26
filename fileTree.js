const DIRECTORY = 0;
const HTML_PAGE = 1;
const DOWNLOADABLE = 2;

export class TreeNode {
    constructor(name, type, file) {
        this.name = name; // file/directory name
        this.parent = null;
        this.children = [];
        this.type = type; //0-directory,1-webpage,2-downloadable
        this.file = file;
    }

    addChild(childNode) {
        this.children.push(childNode);
        childNode.parent = this;
        console.log(childNode.name)
        console.log(childNode.parent.name)
    }


}
export class Tree {
    constructor(rootValue) {
        this.root = new TreeNode(rootValue, DIRECTORY);
    }
    traverseToString(node, prefix = '', isLast = true) { //dfs in string
        let treeString = prefix + (isLast ? '└── ' : '├── ') + node.name + '\n';
        console.log(treeString);

        const newPrefix = prefix + (isLast ? '    ' : '│   ');

        node.children.forEach((child, index) => {
            const lastChild = index === node.children.length - 1;
            treeString += this.traverseToString(child, newPrefix, lastChild); // Append child string
        });

        return treeString;
    }
}

export function removeNodeRecursive(childNode) {
    const parentNode = childNode.parent;
    if (!parentNode) {
        return "Cannot remove root directory";
    }
    const index = parentNode.children.indexOf(childNode);
    if (index > -1) {
        if (childNode.children.length > 0) {
            childNode.children.forEach((child) => {
                removeNodeRecursive(child);
            })}
        parentNode.children.splice(index, 1);
    }
    return "";
}

export function makeNewPath(path, curr , file, type) {
    let error = ": " + path + ": No such file or directory"
    let pathList = path.split('/').filter(Boolean);
    for (let i = 0; i<pathList.length; i++) {
        if (pathList[i] == "..") {
            curr = curr.parent;
            if (curr == null) {return error;}
        } else {
            const matchingChild = curr.children.find(child => child.name === pathList[i]);
            if (matchingChild) {
                curr = matchingChild
            } else {
                for (let j = 0; j<pathList.length-i;j++) {
                    let curr_type = j+1==pathList.length-i ? type : DIRECTORY;
                    const newNode = new TreeNode(pathList[i+j], curr_type, file);
                    curr.addChild(newNode);
                    curr = newNode;
                }
                return "";
            }
        }
    }
    return error;
}

export function handlePath(path, curr) {
    if (path == '/') {
        return root.root;
    }

    let error = ": " + path + ": No such file or directory"
    let pathList = path.split('/').filter(Boolean);
    for (let i = 0; i<pathList.length; i++) {
        if (pathList[i] == "..") {
            curr = curr.parent;
            if (curr == null) {return error;}
        } else {
            const matchingChild = curr.children.find(child => child.name === pathList[i]);
            if (matchingChild) {
                curr = matchingChild
            } else {
                return error;
            }
        }
    }
    console.log(curr.name);
    return curr;
}

export function findPath(curr) {
    let path = curr.name;
    while (curr.parent != null && curr.name != '/') {
        curr = curr.parent;
        if (curr.name == '/') {
            return curr.name+path;
        }
        path = curr.name + "/" + path;
    }
    return path;

}

export const root = new Tree("/");


const guideContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Terminal Commands</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
        }
        h1 {
            text-align: center;
            font-size: 2.5em;
            margin-bottom: 20px;
        }
        .commands {
            font-size: 1.5em;
            white-space: pre-wrap;
            text-align: left;
            margin: auto;
            max-width: 1000px; 
        }
    </style>
</head>
<body>
    <h1>Custom Terminal Commands</h1>
    <div class="commands">
        clear - clears terminal<br>
        cd [location] - change directory<br>
        ls [location] - list out current directory<br>
        ./[location] - displays/gets webpage/content<br>
        tree [location] - displays tree visualization of directory<br>
        echo [msg] - prints message<br>
        exit - closes webpage<br>
        mkdir [location+Name] - makes directory<br>
        rmdir/rm [location] - removes file/directory<br>
        touch [file] - drag and drop a file<br>
        help - help manual<br>
    </div>
</body>
</html>`;

const blob = new Blob([guideContent], { type: "text/html" });
const file = new File([blob], "root.html", { type: "text/html" });

const rootPage = new TreeNode("root.html", 1, file);
root.root.addChild(rootPage);