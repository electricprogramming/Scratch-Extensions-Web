function getSearchResults(possibleResults, query) {
  function checkMatch(text, query) {
    var keywords = [...new Set(query.split(' '))];
    keywords = keywords.filter(item => item !== '');
    var count = 0;
    keywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        count += 1;
      }
    });
    return count === keywords.length;
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
    const text = String(item).toLowerCase();
    if (checkMatch(text, query.toLowerCase())) {
      results.push(item);
    }
  });
  return results;
}
export default getSearchResults;
