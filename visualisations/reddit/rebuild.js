;(function() {

// API
window.redditPack = main;

// code
var REDDIT_URL = "http://reddit.com";
var REDDIT_DATA_URL = "/visualisations/reddit/data";

function main(el,stories,index) {
  var story = stories[(index || 0) % stories.length];
  getRedditStoryComments(story,function(data) {
    clearLoading(el);
    vis(el,data);
  });
  setTimeout(function() {
    main(el,stories,(index || 0) + 1);
  },2500);
}

function vis(el,dataRoot) {

  // data: {replies: [], body: ""}

  var svg = d3.select(el).select('svg');
  
  // calcuate diameter so we fit in the svg
  var diameter;

  // configure pack d3.layout.pack
  // - size of whole layout
  // - how to access reply nodes in data
  // - size of item by length of answer body
  var layout;
       
  // bind the root of tree to svg
  // - and nodes to stories
  var nodes;
  
  // append a group to wrap each story
  // - add the circle
  var entered;
  
  // for update + enter
  // - set the .leaf class on leaves
  // - position the group
  // - size the circle
    
  // exit - remove nodes
  var exit;
}


function getRedditStoryComments(url,cb) {
  d3.json(REDDIT_DATA_URL + url,function(err,data) {
    if(err) return error(err);
    cb(formatStoryComments(data)); 
  });
}

function formatStoryComments(data) {
  var story = data[0].data.children[0].data;
  var comments = data[1];
  var baseUrl = REDDIT_URL + story.permalink;

  story.replies = comments.data.children.filter(removeMore)
    .map(formatComment);

  return story;

  function formatComment(comment) {
    var data = comment.data;
    if(data.replies) {
      data.replies = data.replies.data.children.filter(removeMore)
        .map(formatComment);
    } else {
      data.replies = [];
    }
    data.permalink = baseUrl + "/" + data.id;
    return data;
  }

  function removeMore(comment) {
    return comment.kind == "t1";
  }
}

function error(err) {
  console.error(err);
}

function clearLoading(el) {
  d3.select(el).select(".loading").remove();
}

})();












