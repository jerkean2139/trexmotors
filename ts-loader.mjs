import { readFileSync } from 'fs';
import { dirname, extname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { transformSync } from 'esbuild';

const extensionsRegex = /\.(ts|tsx)$/;

export async function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    const filePath = fileURLToPath(url);
    const source = readFileSync(filePath, 'utf8');
    const { code } = transformSync(source, {
      loader: extname(filePath).slice(1),
      target: 'node20',
      format: 'esm',
      sourcefile: filePath,
      sourcemap: 'inline',
    });
    
    return {
      format: 'module',
      source: code,
      shortCircuit: true,
    };
  }
  
  return nextLoad(url, context);
}

export async function resolve(specifier, context, nextResolve) {
  // Handle TypeScript file extensions
  if (extensionsRegex.test(specifier)) {
    return nextResolve(specifier, context);
  }
  
  // Try to resolve .ts and .tsx extensions
  const parentPath = context.parentURL ? fileURLToPath(context.parentURL) : process.cwd();
  const extensions = ['', '.ts', '.tsx', '.js', '.mjs'];
  
  for (const ext of extensions) {
    try {
      const resolved = await nextResolve(specifier + ext, context);
      return resolved;
    } catch (e) {
      // Continue trying other extensions
    }
  }
  
  return nextResolve(specifier, context);
}