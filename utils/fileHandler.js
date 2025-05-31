const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class FileHandler {
    // VULNERABILITY: Path traversal in file operations
    static readUserFile(filename) {
        // Vulnerable: No sanitization of filename
        const filePath = `./user_files/${filename}`;
        return fs.readFileSync(filePath, 'utf8');
    }
    
    // VULNERABILITY: Command injection in file processing
    static processFile(filename, command) {
        // Vulnerable: Direct execution of user-provided command
        const fullCommand = `${command} ./uploads/${filename}`;
        exec(fullCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
                return;
            }
            console.log(`Output: ${stdout}`);
        });
    }
    
    // VULNERABILITY: Race condition in file operations
    static async unsafeFileWrite(filename, data) {
        const tempFile = `/tmp/${filename}.tmp`;
        
        // Vulnerable: Race condition between check and use
        if (!fs.existsSync(tempFile)) {
            // Another process could create the file here
            fs.writeFileSync(tempFile, data);
            return fs.readFileSync(tempFile, 'utf8');
        }
    }
}

module.exports = FileHandler;