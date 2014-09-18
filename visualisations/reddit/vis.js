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

  var svg = d3.select(el).select('svg');
  
  var diameter = Math.min(svg.attr("width"),svg.attr("height"))
    * 0.9;

  var layout = d3.layout.pack()
    .size([diameter, diameter])
    .children(function(d) {
      return d.replies
    })
    .value(function(d) {
      return d.body.length;
    });
       
  var nodes = svg.datum(dataRoot)
    .selectAll(".story")
    .data(layout.nodes);
  
  var entered = nodes.enter()
    .append("g")
    .classed("story",true)
    .attr("transform","translate(0,0)")
    .append("circle")
    .attr("r",0);
  
  nodes
    .classed("leaf",function(d) {
      return d.replies.length === 0;
    })
    .transition()
    .attr("transform",function(d) {
      return "translate(" + d.x + "," + d.y + ")"
    })
    .select("circle")
    .attr("r",function(d) {
      return d.r
    });
    
  nodes
    .exit()
    .remove();
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












