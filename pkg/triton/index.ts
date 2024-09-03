import { importTypes } from '@rancher/auto-import';
import { IPlugin } from '@shell/core/types';

// Init the package
export default function(plugin: IPlugin) {
  // Auto-import model, detail, edit from the folders
  importTypes(plugin);

  // Provide extension metadata from package.json
  // it will grab information such as `name` and `description`
  const metadata = require('./package.json');
  
  const icon = require('./triton.svg');

  metadata.icon = icon;

  // Assign the updated metadata back to the plugin
  plugin.metadata = metadata;

  plugin.register('image', 'providers/triton.svg', icon);
}