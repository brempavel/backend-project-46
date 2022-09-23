import stylish from './stylish.js';
import plain from './plain.js';

export default (rawDifference, formatName) => {
  switch (formatName) {
    case 'stylish':
      return stylish(rawDifference);
    case 'plain':
      return plain(rawDifference);
    default:
      throw new Error(`Unknown format type: ${formatName}`);
  }
}
