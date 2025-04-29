/*Parse input XML and convert it into steps.
⁠  ⁠Eg: Input -
⁠  ⁠<boltArtifact id=\"project-import\" title=\"Project Files\">
⁠    ⁠<boltAction type=|"file\" filePath=\"eslint.config.js\">
    import js from '@eslint/js'; \nimport globals from 'globals'; \n
    ⁠</boltAction>
⁠  ⁠<boltAction type="shell">
⁠       ⁠node index.js
⁠  ⁠</boltAction>
⁠  ⁠</boltArtifact>
⁠  ⁠Output -
    [{
        title: "Project Files", 
        status: "Pending"
    },{
        title: "Create eslint.config.js",
        type: StepType.CreateFile,
        code: "import js from '@eslint/js'; \nimport globals from 'globals'; \n",
    },{
        title: "Run Command",
        code: "node index.js",
        type: StepType.RunScript,    
    }]  
*/

import { Step, StepType } from "./types";

export function parseXml(response: string): Step[] {
    const steps: Step[] = [];
    let stepId = 0;
    
    // Find the boltArtifact tag
    const artifactMatch = response.match(/<boltArtifact\s+([^>]*)>([\s\S]*?)<\/boltArtifact>/);
    
    if (!artifactMatch) {
        return steps;
    }
    
    // Extract artifact attributes and content
    const artifactAttrs = artifactMatch[1];
    const artifactContent = artifactMatch[2];
    
    // Parse title attribute
    const titleMatch = artifactAttrs.match(/title=["']([^"']*)["']/);
    const title = titleMatch ? titleMatch[1] : "Unknown Project";
    
    // Add artifact as the first step
    steps.push({
        id: stepId++,
        title: title,
        description: `Initialize project: ${title}`,
        type: StepType .CreateFolder,
        status: 'pending'
    });
    
    // Find all boltAction tags
    const actionRegex = /<boltAction\s+([^>]*)>([\s\S]*?)<\/boltAction>/g;
    let actionMatch;
    
    while ((actionMatch = actionRegex.exec(artifactContent)) !== null) {
        const actionAttrs = actionMatch[1];
        const actionContent = actionMatch[2];
        
        // Parse type attribute
        const typeMatch = actionAttrs.match(/type=["']([^"']*)["']/);
        const typeValue = typeMatch ? typeMatch[1] : "";
        
        if (typeValue === "file") {
            // Handle file action
            const filePathMatch = actionAttrs.match(/filePath=["']([^"']*)["']/);
            const filePath = filePathMatch ? filePathMatch[1] : "unknown.txt";
            const fileName = filePath.split('/').pop() || filePath;
            
            steps.push({
                id: stepId++,
                title: `Create ${fileName}`,
                description: `Create file at path: ${filePath}`,
                type: StepType.CreateFile,
                status: 'pending',
                code: actionContent,
                path: filePath
            });
        } else if (typeValue === "shell") {
            // Handle shell action
            const command = actionContent.trim();
            steps.push({
                id: stepId++,
                title: "Run Command",
                description: `Execute: ${command}`,
                type: StepType.RunScript,
                status: 'pending',
                code: command
            });
        }
    }
    
    return steps;
}