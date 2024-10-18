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
        this.root = new TreeNode(rootValue, 0);
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

export function addChildByFile(file, currNode) {
    //given file, add to child to currNode
    

}

//CREATION OF FILE STRUCTURE
export const root = new Tree("/"); // Home, Education, Project


//     const home = new TreeNode("Home", 0); // 
//     root.root.addChild(home);

//         const homePage = new TreeNode("home.html", 1);
//         home.addChild(homePage);

//         const meJPG = new TreeNode("me.jpg", 2);
//         home.addChild(meJPG);
//         //what to add on home page?
//         //stuff about me?
//         //linkden?
//         //email?
//         //idk man

//     const education = new TreeNode("Education", 0); // education.html, resume, transcript, sfu logo
//     root.root.addChild(education);

//         //////////////////////////
//         const educationPage = new TreeNode("education.html", 1);
//         education.addChild(educationPage);

//         const resumePDF = new TreeNode("resume.pdf", 2);
//         education.addChild(resumePDF);

//         const transcriptPDF = new TreeNode("transcript.pdf", 2);
//         education.addChild(transcriptPDF);

//         const sfu_logoJPG = new TreeNode("sfu_logo.jpg", 2);
//         education.addChild(sfu_logoJPG);
//         //////////////////////////////

//     const projects = new TreeNode("Projects", 0); // projects.html, goober, examharmony, personal site, droppr., github.com
//     root.root.addChild(projects);

//         const projectsPage = new TreeNode("projects.html", 1);
//         projects.addChild(projectsPage);

//         const examharmony = new TreeNode("examharmony", 0);
//         projects.addChild(examharmony);

//             const examharmonyGIT = new TreeNode("github.com-examharmony.html", 3, "https://github.com/JohnnyDeng6/ExamHarmony2");
//             examharmony.addChild(examharmonyGIT);
//             const examharmonyWEB = new TreeNode("examharmony.html", 3, "https://examharmony.jzydeng.com");
//             examharmony.addChild(examharmonyWEB);
//             const examharmonyLOGO = new TreeNode("examharmony_logo.png", 2);
//             examharmony.addChild(examharmonyLOGO);

//         const goober = new TreeNode("goober", 0);
//         projects.addChild(goober);
//             const gooberGIT = new TreeNode("github.com-goober.html", 3,"https://github.com/JohnnyDeng6/goober");
//             goober.addChild(gooberGIT);
//             const gooberWEB = new TreeNode("goober.html", 3, "https://goober.jzydeng.com");
//             goober.addChild(gooberWEB);
//             const gooberLOGO = new TreeNode("goober_logo.png", 2);
//             goober.addChild(gooberLOGO);

//         const jzydeng = new TreeNode("jzydeng", 0);
//         projects.addChild(jzydeng);
//             const jzydengGIT = new TreeNode("github.com-jzydeng.html", 3, "https://github.com/JohnnyDeng6/jzydeng");
//             jzydeng.addChild(jzydengGIT);
//             const jzydengWEB = new TreeNode("jzydeng.html", 3, "https://jzydeng.com");
//             jzydeng.addChild(jzydengWEB);
//             const jzydengLOGO = new TreeNode("jzydeng_logo.png", 2);
//             jzydeng.addChild(jzydengLOGO);

//         const droppr = new TreeNode("droppr", 0);
//         projects.addChild(droppr);
//             const dropprGIT = new TreeNode("github.com/droppr.html", 3, "https://github.com/micahdbak/droppr");
//             droppr.addChild(dropprGIT);
//             const dropprWEB = new TreeNode("droppr.html", 3, "https://droppr.ca");
//             droppr.addChild(dropprWEB);
//             const dropprLOGO = new TreeNode("droppr_logo.png", 2);
//             droppr.addChild(dropprLOGO);


//         const github = new TreeNode("github.com.html", 3, "https://github.com/JohnnyDeng6");
//         projects.addChild(github);
// console.log("Tree traversal:");
// // root.traverse(root.root); //
// console.log(root.traverseToString(root.root));
// ///////////////////////////////////////////////////////////////

