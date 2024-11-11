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
      'Cell', 'Cells',
      'Iteration'
    ],
    path: 'Data-Grids',
    description: `Create and manage data grids in a similar way to Scratch's defaut variables category.`,
    by: 'electricprogramming'
  },
  {
    name: 'unexistent',
    keywords: ['unexistent'],
    path: 'unexistent',
    description: 'this does not exist',
    by: 'nobody'
  }
];