/* eslint-disable */

function initTagify() {
  // The DOM element you wish to replace with Tagify
  const input = $('#techStack').get(0);
  // init Tagify script on the above inputs
  const tagifyInstance = new Tagify(input);
  let techStackValue = $('#techStackValue').val();
  techStackValue = techStackValue === '' ? '' : techStackValue;
  tagifyInstance.addTags(techStackValue);
}

$(function() {
  //init tagify
  initTagify();
});
