const fs = require('fs');
const path = require('path');

// Adjust the path to your main package.json if this script is not in project root/scripts
const packageJsonPath = path.join(__dirname, '../package.json'); // Assumes script is in project_root/scripts
const packageJson = require(packageJsonPath);
const appVersion = packageJson.version;

console.log(`Current UI version: ${appVersion}`);

// paths to your environment files relative to the script's location
const envFilePaths = [
  //   path.join(__dirname, '../apps/ui/src/environments/environment.ts'),
  path.join(__dirname, '../apps/ui/src/environments/environment.dev.ts'),
  path.join(__dirname, '../apps/ui/src/environments/environment.prod.ts'),
];

for (let filePath of envFilePaths) {
  try {
    if (fs.existsSync(filePath)) {
      let fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });

      // Regex to find and replace the appVersion property
      // Handles single quotes, double quotes, and backticks for the version string
      //   const versionRegex = /${PACKAGE_VERSION}\s*['"`][^'`]*['"`]/;
      const versionRegex = /{SCRIPT_REPLACED_PACKAGE_VERSION}/;
      const newVersionLine = `${appVersion}`;

      if (versionRegex.test(fileContent)) {
        fileContent = fileContent.replace(versionRegex, newVersionLine);
      } else {
        console.warn(
          'Version placeholder not found in: %s; \n\nFile content below:\n%s',
          filePath,
          fileContent,
        );
        break;
      }

      fs.writeFileSync(filePath, fileContent, { encoding: 'utf-8' });
      console.log(
        `Successfully updated version in: %s; \n\nFile content below:\n%s`,
        filePath,
        fileContent,
      );
    } else {
      console.warn(`Environment file not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
    process.exit(1); // Exit with error if update fails
  }
}
