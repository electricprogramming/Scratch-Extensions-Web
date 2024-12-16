export default function getSearchResults(possibleResults, query) {
  const checkMatch = function(keywords, query) {
    var queryKeywords = [...new Set(query.split(' '))];
    queryKeywords = queryKeywords.filter(item => item !== '');
    let res = true;
    queryKeywords.forEach((queryKeyword) => {
      if (!keywords.some(keyword => keyword.startsWith(queryKeyword))) {
        res = false;
      }
    });
    return res;
  }
  if (!(possibleResults instanceof Array)) {
    console.error(new TypeError('getSearchResults: argument "possibleResults" must be an array.'));
    return [];
  }
  if (!(typeof query === 'string')) {
    console.error(new TypeError('getSearchResults: argument "query" must be a string.'));
    return [];
  }
  if (query === '') return possibleResults;
  let results = [];
  possibleResults.forEach(item => {
    if (item.keywords instanceof Array) {
      if (checkMatch(item.keywords.map(keyword => keyword.toLowerCase()), query.toLowerCase())) {
        results.push(item);
      }
    }
  });
  return results;
};