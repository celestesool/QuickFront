import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { CanvasComponent } from '../types/canvasTypes';

export function exportToAngular(elements: CanvasComponent[]) {
  try {
    const zip = new JSZip();
    const rootFolder = zip.folder('angular-export');

    rootFolder?.file('package.json', generatePackageJson());
    rootFolder?.file('angular.json', generateAngularJson());
    rootFolder?.file('tsconfig.json', generateTsConfig());
    rootFolder?.file('tsconfig.app.json', generateTsConfigApp());

    const srcFolder = rootFolder?.folder('src');
    srcFolder?.file('main.ts', generateMainTs());
    srcFolder?.file('polyfills.ts', generatePolyfills());
    srcFolder?.file('styles.css', generateGlobalStyles());
    srcFolder?.file('index.html', generateIndexHtml());

    const appFolder = srcFolder?.folder('app');
    const componentContent = generateAngularComponent(elements);
    appFolder?.file('canvas.component.ts', componentContent.ts);
    appFolder?.file('canvas.component.html', componentContent.html);
    appFolder?.file('canvas.component.css', componentContent.css);
    appFolder?.file('app.module.ts', generateAppModule());
    appFolder?.file('app.component.ts', generateAppComponent());
    appFolder?.file('app.component.html', '<app-canvas></app-canvas>');
    appFolder?.file('app.component.css', '');

    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, 'angular-export.zip');
    }).catch(error => {
      console.error('Error al generar ZIP:', error);
      throw new Error('Error al generar el archivo ZIP');
    });
  } catch (error) {
    console.error('Error en exportToAngular:', error);
    throw new Error('Error al exportar a Angular');
  }
}

// ... (las importaciones y función exportToAngular se mantienen igual)

// Generación del componente principal mejorada
function generateAngularComponent(elements: CanvasComponent[]): { ts: string; html: string; css: string } {
  const safeElements = elements || [];
  
  const htmlContent = `
<div class="canvas">
  ${safeElements.map(el => generateElementHtml(el)).join('\n')}
</div>
  `;

  const cssContent = `
.canvas {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #f8f9fa;
  overflow: auto;
  margin: 0;
  padding:0px;
}
${safeElements.map(el => generateElementCss(el)).join('\n')}
  `;

  const tsContent = `
import { Component } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent {
  ${safeElements.some(el => el.type === 'input') ? generateInputLogic() : ''}
}
  `;

  return { 
    ts: tsContent.trim(), 
    html: htmlContent.trim(), 
    css: cssContent.trim() 
  };
}

function generateInputLogic(): string {
  return `
  inputValue: string = '';
  
  onInputChange(event: Event, id: string): void {
    this.inputValue = (event.target as HTMLInputElement).value;
    // Puedes agregar más lógica aquí si necesitas manejar múltiples inputs
  }`;
}

// Generación de elementos con estilos completos
function generateElementHtml(element: CanvasComponent): string {
  if (!element || !element.type) return '';
  
  const safeId = element.id ? element.id.replace(/[^a-zA-Z0-9-_]/g, '') : '';
  const safeContent = element.content || '';

  switch (element.type) {
    case 'button':
      return `
<div class="element ${element.type}" id="${safeId}">
  <button>${escapeHtml(safeContent)}</button>
</div>`;
    case 'text':
      return `
<div class="element ${element.type}" id="${safeId}">
  <p>${escapeHtml(safeContent)}</p>
</div>`;
    case 'image':
      return `
<div class="element ${element.type}" id="${safeId}">
  <img src="${escapeHtml(safeContent)}" alt="Imported image" onerror="this.style.display='none'">
</div>`;
    case 'input':
      return `
<div class="element ${element.type}" id="${safeId}">
  <input type="text" placeholder="${escapeHtml(safeContent)}" 
         (input)="onInputChange($event, '${safeId}')">
</div>`;
    case 'frame':
      return `<div class="element ${element.type}" id="${safeId}">${escapeHtml(safeContent)}</div>`;
    case 'square':
    case 'circle':
    case 'line':
      return `<div class="element ${element.type}" id="${safeId}"></div>`;
    default:
      return '';
  }
}

function generateElementCss(element: CanvasComponent): string {
  if (!element) return '';
  
  const safeId = element.id ? element.id.replace(/[^a-zA-Z0-9-_]/g, '') : '';
  const styles = element.styles || {};
  
  // Estilos base para todos los elementos
  let baseStyles = `
.element.${element.type}#${safeId} {
  position: absolute;
  top: ${Number(element.y) || 0}px;
  left: ${Number(element.x) || 0}px;
  width: ${Number(element.width) || 100}px;
  height: ${Number(element.height) || 100}px;
  transform: rotate(${Number(element.rotation) || 0}deg);
  ${convertStylesToCss(styles)}
}`;

  // Estilos específicos por tipo
  switch (element.type) {
    case 'button':
      return `${baseStyles}
.element.${element.type}#${safeId} button {
  width: 100%;
  height: 100%;
  border: none;
  cursor: default;
  background-color: inherit;
  color: inherit;
  font-family: inherit;
  padding: 0;
  margin: 0;
}`;
    
case 'text':
  return `
.element.${element.type}#${safeId} {
  position: absolute;
  top: ${Number(element.y) || 0}px;
  left: ${Number(element.x) || 0}px;
  width: ${Number(element.width) || 100}px;
  height: ${Number(element.height) || 100}px;
  transform: rotate(${Number(element.rotation) || 0}deg);
  border: 1px solid transparent;
  ${convertStylesToCss(element.styles || {})}
}
.element.${element.type}#${safeId} p {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-wrap: break-word;
  line-height: normal;
}
  `;

    
    case 'input':
      return `${baseStyles}
.element.${element.type}#${safeId} input {
  width: 100%;
  height: 100%;
  border: ${styles.borderWidth || '1px'} solid ${styles.borderColor || '#ccc'};
  background-color: ${styles.backgroundColor || 'white'};
  padding: 4px;
  box-sizing: border-box;
  font-family: inherit;
}`;
    
    case 'circle':
      return `${baseStyles}
.element.${element.type}#${safeId} {
  border-radius: 50%;
    background-color: ${styles.backgroundColor || 'transparent'}; /* Se agrega el color de fondo */
}`;
    
    case 'line':
      return `
.element.${element.type}#${safeId} {
  position: absolute;
  top: ${Number(element.y) || 0}px;
  left: ${Number(element.x) || 0}px;
  width: ${Number(element.width) || 100}px;
  height: 0;
  border-top: ${styles.borderWidth || '2px'} solid ${styles.borderColor || '#000'};
  transform: rotate(${Number(element.rotation) || 0}deg);
  transform-origin: left center;
}`;
    
    case 'frame':
      return `${baseStyles}
.element.${element.type}#${safeId} {
  border: ${styles.borderWidth || '1px'} solid ${styles.borderColor || '#000'};
  padding: ${styles.padding || '10px'};
  background-color: ${styles.backgroundColor || 'transparent'};
  overflow: hidden;
}`;
    
    default:
      return baseStyles;
  }
}

// ... (el resto de las funciones se mantienen igual)
function escapeHtml(unsafe: string): string {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function convertStylesToCss(styles: Record<string, any>): string {
  return Object.entries(styles)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
    .join('\n  ');
}

function generatePackageJson(): string {
  return `{
  "name": "canvas-export",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^17.2.0",
    "@angular/common": "^17.2.0",
    "@angular/compiler": "^17.2.0",
    "@angular/core": "^17.2.0",
    "@angular/forms": "^17.2.0",
    "@angular/platform-browser": "^17.2.0",
    "@angular/platform-browser-dynamic": "^17.2.0",
    "@angular/router": "^17.2.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.14.3"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^17.2.0",
    "@angular/cli": "~17.2.0",
    "@angular/compiler-cli": "^17.2.0",
    "@types/node": "^18.0.0",
    "typescript": "~5.2.0"
  }
}`;
}

function generateAngularJson(): string {
  return `{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "defaultProject": "canvas-export",
  "projects": {
    "canvas-export": {
      "projectType": "application",
      "schematics": {},
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/canvas-export",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": ["src/styles.css"],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kb",
                  "maximumError": "4kb"
                }
              ],
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "outputHashing": "all",
              "optimization": true,
              "sourceMap": false
            },
            "development": {
              "buildOptimizer": false,
              "optimization": false,
              "vendorChunk": true,
              "extractLicenses": false,
              "sourceMap": true,
              "namedChunks": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "canvas-export:build:production"
            },
            "development": {
              "buildTarget": "canvas-export:build:development"
            }
          },
          "defaultConfiguration": "development"
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "buildTarget": "canvas-export:build"
          }
        }
      }
    }
  }
}`;
}

function generateTsConfig(): string {
  return `{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "strict": true,
    "sourceMap": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022", "dom"]
  }
}`;
}

function generateTsConfigApp(): string {
  return `{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": ["src/main.ts", "src/polyfills.ts"],
  "include": ["src/**/*.d.ts"]
}`;
}

function generateMainTs(): string {
  return `import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));`;
}

function generatePolyfills(): string {
  return `import 'zone.js';`;
}

function generateIndexHtml(): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Canvas Export</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>`;
}

function generateGlobalStyles(): string {
  return `body {
  margin: 0;
  font-family: system-ui, sans-serif;
}`;
}

function generateAppModule(): string {
  return `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CanvasComponent } from './canvas.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent, CanvasComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}`;
}

function generateAppComponent(): string {
  return `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'canvas-export';
}`;
}
