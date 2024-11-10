function getSearchResults(possibleResults, query) {
  function checkMatch(keywords, query) {
    var queryKeywords = [...new Set(query.split(' '))];
    queryKeywords = queryKeywords.filter(item => item !== '');
    queryKeywords.forEach((keyword) => {
      if (!keywords.includes(keyword)) {
        return false;
      }
    });
    return true;
  }
  if (!(possibleResults instanceof Array)) {
    console.error(new TypeError('getSearchResults: argument "possibleResults" must be an array.'));
    return [];
  }
  if (!(typeof query === 'string')) {
    console.error(new TypeError('getSearchResults: argument "query" must be a string.'));
    return [];
  }
  let results = [];
  possibleResults.forEach(item => {
    if (item instanceof Array) {
      if (checkMatch(item, query.toLowerCase())) {
        results.push(item);
      }
    }
  });
  return results;
}
export default getSearchResults;