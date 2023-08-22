const esbuild = require('esbuild');
const packageJson = require('./package.json'); // Load the package.json file
const { execSync } = require('child_process');

let externalPkgs = Object.keys(packageJson.dependencies) // Get an array of package names
externalPkgs = externalPkgs.filter((pkg) => !pkg.includes("pocketbase"))
esbuild.build({
    entryPoints: ['./src/index.ts'], // Entry point of your library
    bundle: true,                    // Bundle the code
    platform: 'node',                // Target Node.js environment
    target: 'esnext',                // Target Node.js version
    outdir: 'dist',      // Output file
    external: [...externalPkgs, "lib0"],
    tsconfig: 'tsconfig.json',     // tsconfig.json path,
    minify: false,
    format: "cjs",
    sourcemap: true,
    plugins: [
        {
            name: 'TypeScriptDeclarationsPlugin',
            setup(build) {
                build.onEnd((result) => {
                    if (result.errors.length > 0) return
                    execSync('npx tsc -p .')
                })
            },
        }
    ]

}).catch((e) => {
    console.error(e)
    process.exit(1)
});    // Exit with an error code if build fails