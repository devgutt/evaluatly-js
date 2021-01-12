import strings from './resources/strings.json';

export const _ = (key, prefix = "") => strings[(prefix ? prefix + "." : "") + key] || key;

