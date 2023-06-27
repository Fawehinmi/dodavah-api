// var randomize = require('randomatic');
import * as bcrypt from 'bcrypt';

// import * as _ from 'lodash';

export const helper = {
  // randomDigits: (length = 6) => {
  //   return randomize('0', length);
  // },
  hash: async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
  },
  removeSpecialChar: (val: string) => {
    return val?.replace(/[^a-zA-Z0-9 ]/g, '');
  },
};
