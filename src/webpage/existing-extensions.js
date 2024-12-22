/*
This is a .js file instead of a .json file for a few reasons:
  1) Not applicable in this case, but .js files can have comments.
  2) `import` statements only work with .js files, not .json files.
  3) More flexibility in notation -- I just don't like the look of JSON.
*/
export default [
  {
    name: 'Data Grids',
    keywords: [
      'Data',
      'Variable', 'Variables',
      'Grid', 'Grids',
      'List', 'Lists',
      'Spreadsheet', 'Spreadsheets',
      'Row', 'Rows',
      'Column', 'Columns',
      'Cell', 'Cells'
    ],
    path: 'Data-Grids',
    description: `Create and manage data grids in a similar way to Scratch's defaut variables category.`,
    by: 'electricprogramming'
  },
  {
    name: 'Global WebSocket',
    keywords: [
      'WebSocket', 'WebSockets', 'Web', 'Socket',
      'Connect', 'Connection', 'Connections',
      'Server', 'Servers',
      'Internet',
    ],
    path: 'Global-WS',
    description: `Connect to WebSocket servers. One connection is shared across all sprites.`,
    by: 'electricprogramming'
  },
  {
    name: 'Text Replacers',
    keywords: [
      'String', 'Strings',
      'Text', 'Texts',
      'Replacer', 'Replacers',
    ],
    path: 'Text-Replacers',
    description: `Apply replacers to your text. Either apply simultaneously or in order.`,
    by: 'electricprogramming'
  },
  {
    name: 'JavaScript',
    keywords: [
      'JS', 'JavaScript', 'JScript',
      'programming',
      'language', 'languages',
    ],
    path: 'JavaScript',
    description: `Use JavaScript in Scratch. Also includes some extra utilities.`,
    by: 'electricprogramming'
  },
];