import yaml from 'js-yaml';

export default (data, extension) => {
  let parsedData;
  switch (extension) {
    case 'json':
      parsedData = JSON.parse(data);
      break;
    case 'yml':
    case 'yaml':
      parsedData = yaml.load(data);
      break;
    default:
      break;
  }
  return parsedData;
};
