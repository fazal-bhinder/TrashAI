import { Step, StepType } from "./types";

export function parseXml(response: string): Step[] {
    const steps: Step[] = [];
    let stepId = 0;
    
    // Find the boltArtifact tag
    const artifactMatch = response.match(/<boltArtifact\s+([^>]*)>([\s\S]*?)<\/boltArtifact>/);
    
    if (!artifactMatch) {
        // Fallback: Try to extract code blocks directly
        const codeBlockMatches = response.matchAll(/```(\w+)?\s*\n([\s\S]*?)\n```/g);
        let foundCodeBlocks = false;
        
        for (const match of codeBlockMatches) {
            foundCodeBlocks = true;
            const language = match[1] || '';
            const code = match[2];
            
            // Try to guess file extension from language
            let extension = '.txt';
            if (language.includes('tsx') || language.includes('typescript')) extension = '.tsx';
            else if (language.includes('jsx') || language.includes('javascript')) extension = '.jsx';
            else if (language.includes('css')) extension = '.css';
            else if (language.includes('html')) extension = '.html';
            else if (language.includes('json')) extension = '.json';
            
            const fileName = `Component${stepId}${extension}`;
            const filePath = `src/components/${fileName}`;
            
            steps.push({
                id: stepId++,
                title: `Create ${fileName}`,
                description: `Create file: ${fileName}`,
                type: StepType.CreateFile,
                status: 'pending',
                code: code,
                path: filePath,
                name: fileName
            });
        }
        
        if (foundCodeBlocks) {
            return steps;
        }
        
        // Second fallback: Look for any TypeScript/JSX content
        const tsxPattern = /(?:import\s+.*?from|export\s+.*?function|const\s+\w+\s*=|function\s+\w+)/;
        if (tsxPattern.test(response)) {
            steps.push({
                id: stepId++,
                title: 'Create Component',
                description: 'Create component file',
                type: StepType.CreateFile,
                status: 'pending',
                code: response.trim(),
                path: 'src/components/GeneratedComponent.tsx',
                name: 'GeneratedComponent.tsx'
            });
            return steps;
        }
        
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
        status: 'pending',
        name: title
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
                path: filePath,
                name: fileName
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
                code: command,
                name: "Run Command"
            });
        }
    }
    
    return steps;
}