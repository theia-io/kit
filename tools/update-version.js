const fs = require('fs');
const { execSync } = require('child_process');

// Get the current version from package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
let [major, minor, patch] = packageJson.version.split('.');

// Increment the patch version
patch++;

// Get the Git commit hash (shortened)
const gitHash = execSync('git rev-parse --short HEAD').toString().trim();

// Construct the new version string
const newVersion = `${major}.${minor}.${patch}-${gitHash}`;

// Update the package.json file
packageJson.version = newVersion;
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

console.log(`Updated package.json version to: ${newVersion}`);
