import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { loadUrl, loadVar } from './src/Loader';

// Evaluatly = window.Evaluatly = (() => (
//     { 
//         loadVar: loadVar,
//         loadUrl: loadUrl 
//     }
// ))(); 

export { loadVar, loadUrl}